-- Add billing-specific fields to artisan_profiles
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS insurance_decennale_name TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS bank_iban TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS bank_bic TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS default_payment_terms TEXT DEFAULT '30 jours';
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS default_penalty_rate DECIMAL(5,2) DEFAULT 10.0;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS footer_text TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE artisan_profiles ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#1a365d';
