-- Autoliquidation TVA for sous-traitance
ALTER TABLE billing_documents ADD COLUMN IF NOT EXISTS autoliquidation_active BOOLEAN DEFAULT false;
