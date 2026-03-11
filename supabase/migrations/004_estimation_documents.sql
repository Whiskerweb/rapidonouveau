-- ═══════════════════════════════════════════════════
-- MIGRATION 004 : Documents d'estimation
-- PDFs et documents uploadés par les admins pour les utilisateurs
-- ═══════════════════════════════════════════════════

CREATE TABLE estimation_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id),
  document_type TEXT NOT NULL DEFAULT 'estimation_pdf'
    CHECK (document_type IN ('estimation_pdf', 'devis_detaille', 'plan', 'photo', 'autre')),
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER,
  is_visible_to_user BOOLEAN DEFAULT TRUE,
  notified_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_estimation_documents_estimation ON estimation_documents(estimation_id);
CREATE INDEX idx_estimation_documents_uploaded_by ON estimation_documents(uploaded_by);

-- RLS
ALTER TABLE estimation_documents ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les documents de leurs propres estimations
CREATE POLICY "Users read own estimation documents"
  ON estimation_documents FOR SELECT
  USING (
    is_visible_to_user = TRUE
    AND EXISTS (
      SELECT 1 FROM estimations
      WHERE id = estimation_documents.estimation_id
      AND user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent marquer comme vu (update viewed_at)
CREATE POLICY "Users update viewed_at on own documents"
  ON estimation_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM estimations
      WHERE id = estimation_documents.estimation_id
      AND user_id = auth.uid()
    )
  );

-- Les admins gèrent tout
CREATE POLICY "Admins manage all estimation documents"
  ON estimation_documents FOR ALL
  USING (is_admin());
