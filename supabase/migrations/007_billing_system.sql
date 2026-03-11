-- Migration 007: Billing system (devis/factures for artisans)

-- Work items library (artisan's reusable catalog)
CREATE TABLE work_items_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id) ON DELETE CASCADE,
  designation TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'u',
  unit_price_ht NUMERIC(12,2) NOT NULL,
  tva_rate NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing documents (devis, factures, acomptes, situations)
CREATE TABLE billing_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  client_siret TEXT,

  document_type TEXT NOT NULL CHECK (document_type IN ('devis', 'facture', 'acompte', 'situation')),
  document_number TEXT NOT NULL,

  parent_devis_id UUID REFERENCES billing_documents(id),
  estimation_id UUID REFERENCES estimations(id),
  matching_proposal_id UUID REFERENCES matching_proposals(id),

  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'paid', 'partially_paid', 'overdue', 'cancelled')),

  total_ht NUMERIC(12,2) DEFAULT 0,
  total_tva NUMERIC(12,2) DEFAULT 0,
  total_ttc NUMERIC(12,2) DEFAULT 0,
  deposit_percentage NUMERIC(5,2),

  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  validity_date DATE,
  due_date DATE,

  payment_terms TEXT DEFAULT 'À réception de facture',
  payment_method TEXT DEFAULT 'Virement bancaire',
  project_address TEXT,
  project_description TEXT,
  notes TEXT,
  legal_mentions TEXT,

  signed_at TIMESTAMPTZ,
  signature_data TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing document lines
CREATE TABLE billing_document_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES billing_documents(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,

  designation TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'u',
  quantity NUMERIC(12,3) NOT NULL DEFAULT 1,
  unit_price_ht NUMERIC(12,2) NOT NULL,
  tva_rate NUMERIC(5,2) NOT NULL DEFAULT 20.00,

  total_ht NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price_ht) STORED,
  total_tva NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price_ht * tva_rate / 100, 2)) STORED,
  total_ttc NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price_ht * (1 + tva_rate / 100), 2)) STORED,

  library_item_id UUID REFERENCES work_items_library(id),
  cost_price NUMERIC(12,2),
  margin_percentage NUMERIC(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments tracking
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES billing_documents(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment reminders
CREATE TABLE payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES billing_documents(id),
  reminder_level INTEGER NOT NULL DEFAULT 1,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sent_via TEXT DEFAULT 'email',
  notes TEXT
);

-- Indexes
CREATE INDEX idx_billing_docs_artisan ON billing_documents(artisan_id);
CREATE INDEX idx_billing_docs_type ON billing_documents(document_type);
CREATE INDEX idx_billing_docs_status ON billing_documents(status);
CREATE INDEX idx_billing_lines_doc ON billing_document_lines(document_id);
CREATE INDEX idx_work_library_artisan ON work_items_library(artisan_id);
CREATE INDEX idx_payments_document ON payments(document_id);

-- RLS
ALTER TABLE work_items_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_document_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artisans manage own library" ON work_items_library
  FOR ALL USING (artisan_id = auth.uid());
CREATE POLICY "Artisans manage own billing docs" ON billing_documents
  FOR ALL USING (artisan_id = auth.uid());
CREATE POLICY "Lines via document owner" ON billing_document_lines
  FOR ALL USING (document_id IN (SELECT id FROM billing_documents WHERE artisan_id = auth.uid()));
CREATE POLICY "Payments via document owner" ON payments
  FOR ALL USING (document_id IN (SELECT id FROM billing_documents WHERE artisan_id = auth.uid()));
CREATE POLICY "Reminders via document owner" ON payment_reminders
  FOR ALL USING (document_id IN (SELECT id FROM billing_documents WHERE artisan_id = auth.uid()));

-- Admin policies
CREATE POLICY "Admins manage all work_items_library" ON work_items_library FOR ALL USING (is_admin());
CREATE POLICY "Admins manage all billing_documents" ON billing_documents FOR ALL USING (is_admin());
CREATE POLICY "Admins manage all billing_lines" ON billing_document_lines FOR ALL USING (is_admin());
CREATE POLICY "Admins manage all payments" ON payments FOR ALL USING (is_admin());
CREATE POLICY "Admins manage all reminders" ON payment_reminders FOR ALL USING (is_admin());

-- Sequential document numbering function
CREATE OR REPLACE FUNCTION next_document_number(p_artisan_id UUID, p_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  year_str TEXT;
  seq INTEGER;
BEGIN
  prefix := CASE p_type
    WHEN 'devis' THEN 'D'
    WHEN 'facture' THEN 'F'
    WHEN 'acompte' THEN 'A'
    ELSE 'S'
  END;
  year_str := EXTRACT(YEAR FROM NOW())::TEXT;

  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(document_number, '-', 3) AS INTEGER)
  ), 0) + 1 INTO seq
  FROM billing_documents
  WHERE artisan_id = p_artisan_id
    AND document_type = p_type
    AND document_number LIKE prefix || '-' || year_str || '-%';

  RETURN prefix || '-' || year_str || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Auto-update timestamps
CREATE TRIGGER update_work_items_updated_at
  BEFORE UPDATE ON work_items_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_billing_docs_updated_at
  BEFORE UPDATE ON billing_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
