-- ============================================
-- 008: Advanced billing features
-- Sections, situations, avoirs, retenue garantie, signature
-- ============================================

-- Sections dans les lignes
ALTER TABLE billing_document_lines
  ADD COLUMN IF NOT EXISTS section_title TEXT,
  ADD COLUMN IF NOT EXISTS is_section_header BOOLEAN DEFAULT FALSE;

-- Avancement pour factures de situation
ALTER TABLE billing_document_lines
  ADD COLUMN IF NOT EXISTS previous_pct NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_pct NUMERIC(5,2) DEFAULT 100;

-- Retenue de garantie sur les documents
ALTER TABLE billing_documents
  ADD COLUMN IF NOT EXISTS retenue_garantie_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS retenue_garantie_pct NUMERIC(5,2) DEFAULT 5.00;

-- Avoir reference (credit note references original document)
ALTER TABLE billing_documents
  ADD COLUMN IF NOT EXISTS avoir_reference_id UUID REFERENCES billing_documents(id);

-- Sign token pour signature electronique publique
ALTER TABLE billing_documents
  ADD COLUMN IF NOT EXISTS sign_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS signer_ip TEXT;

-- Mettre a jour la contrainte document_type pour ajouter 'avoir'
ALTER TABLE billing_documents DROP CONSTRAINT IF EXISTS billing_documents_document_type_check;
ALTER TABLE billing_documents ADD CONSTRAINT billing_documents_document_type_check
  CHECK (document_type IN ('devis', 'facture', 'acompte', 'situation', 'avoir'));

-- Mettre a jour la contrainte status pour ajouter 'signed'
ALTER TABLE billing_documents DROP CONSTRAINT IF EXISTS billing_documents_status_check;
ALTER TABLE billing_documents ADD CONSTRAINT billing_documents_status_check
  CHECK (status IN ('draft', 'sent', 'signed', 'accepted', 'rejected', 'paid', 'partially_paid', 'overdue', 'cancelled'));

-- Index sur sign_token pour acces public rapide
CREATE INDEX IF NOT EXISTS idx_billing_docs_sign_token ON billing_documents(sign_token);

-- Index sur avoir_reference_id
CREATE INDEX IF NOT EXISTS idx_billing_docs_avoir_ref ON billing_documents(avoir_reference_id);

-- Mettre a jour la fonction de numerotation pour les nouveaux types
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
    WHEN 'acompte' THEN 'FA'
    WHEN 'situation' THEN 'FS'
    WHEN 'avoir' THEN 'AV'
    ELSE 'X'
  END;
  year_str := EXTRACT(YEAR FROM NOW())::TEXT;

  -- Pour les acomptes et situations, utiliser la meme sequence que les factures
  IF p_type IN ('acompte', 'situation') THEN
    SELECT COALESCE(MAX(
      CAST(SPLIT_PART(document_number, '-', 3) AS INTEGER)
    ), 0) + 1 INTO seq
    FROM billing_documents
    WHERE artisan_id = p_artisan_id
      AND document_type IN ('facture', 'acompte', 'situation')
      AND (
        document_number LIKE 'F-' || year_str || '-%'
        OR document_number LIKE 'FA-' || year_str || '-%'
        OR document_number LIKE 'FS-' || year_str || '-%'
      );
  ELSE
    SELECT COALESCE(MAX(
      CAST(SPLIT_PART(document_number, '-', 3) AS INTEGER)
    ), 0) + 1 INTO seq
    FROM billing_documents
    WHERE artisan_id = p_artisan_id
      AND document_type = p_type
      AND document_number LIKE prefix || '-' || year_str || '-%';
  END IF;

  RETURN prefix || '-' || year_str || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- RLS: permettre acces lecture publique via sign_token (pour la page de signature)
-- On ne modifie pas les politiques existantes, on ajoute juste une politique SELECT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'billing_documents' AND policyname = 'Public sign access by token'
  ) THEN
    CREATE POLICY "Public sign access by token" ON billing_documents
      FOR SELECT
      USING (sign_token IS NOT NULL AND status = 'sent');
  END IF;
END $$;
