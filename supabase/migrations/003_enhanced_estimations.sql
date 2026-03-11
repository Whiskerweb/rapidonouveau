-- ═══════════════════════════════════════════════════
-- MIGRATION 003 : Estimations enrichies
-- Ajoute le support du questionnaire intelligent et du prompt IA
-- ═══════════════════════════════════════════════════

ALTER TABLE estimations
  ADD COLUMN IF NOT EXISTS questionnaire_responses JSONB,
  ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
  ADD COLUMN IF NOT EXISTS ai_estimation JSONB,
  ADD COLUMN IF NOT EXISTS final_estimation JSONB,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS project_type TEXT,
  ADD COLUMN IF NOT EXISTS location_department TEXT;

CREATE INDEX IF NOT EXISTS idx_estimations_project_type ON estimations(project_type);
CREATE INDEX IF NOT EXISTS idx_estimations_reviewed_by ON estimations(reviewed_by);
