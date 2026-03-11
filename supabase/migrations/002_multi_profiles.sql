-- ═══════════════════════════════════════════════════
-- MIGRATION 002 : Système multi-profils
-- Ajoute les types de profils métier (artisan, immobilier, particulier)
-- ═══════════════════════════════════════════════════

-- Nouveaux champs sur profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_type TEXT CHECK (profile_type IN ('artisan', 'immobilier', 'particulier')),
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_department TEXT,
  ADD COLUMN IF NOT EXISTS address_lat DECIMAL(10,8),
  ADD COLUMN IF NOT EXISTS address_lng DECIMAL(11,8),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_profile_type ON profiles(profile_type);

-- ═══════════════════════════════════════
-- TABLE: artisan_profiles
-- ═══════════════════════════════════════
CREATE TABLE artisan_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  siret VARCHAR(14) NOT NULL,
  company_name TEXT,
  main_trade TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  insurance_decennale_number TEXT,
  insurance_expiry DATE,
  certifications TEXT[] DEFAULT '{}',
  intervention_radius_km INTEGER DEFAULT 50,
  hourly_rate DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  verified_documents JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_artisan_profiles_updated_at
  BEFORE UPDATE ON artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════
-- TABLE: immobilier_profiles
-- ═══════════════════════════════════════
CREATE TABLE immobilier_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  siret VARCHAR(14),
  company_name TEXT,
  immobilier_role TEXT CHECK (immobilier_role IN ('agent', 'marchand_biens', 'promoteur', 'diagnostiqueur')),
  agency_name TEXT,
  network TEXT,
  annual_volume INTEGER,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_immobilier_profiles_updated_at
  BEFORE UPDATE ON immobilier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════
-- TABLE: particulier_profiles
-- ═══════════════════════════════════════
CREATE TABLE particulier_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_owner BOOLEAN DEFAULT TRUE,
  property_type TEXT,
  estimated_budget_range TEXT,
  is_first_project BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_particulier_profiles_updated_at
  BEFORE UPDATE ON particulier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

ALTER TABLE artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE immobilier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE particulier_profiles ENABLE ROW LEVEL SECURITY;

-- Artisan profiles
CREATE POLICY "Users read own artisan profile"
  ON artisan_profiles FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users update own artisan profile"
  ON artisan_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own artisan profile"
  ON artisan_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins manage all artisan profiles"
  ON artisan_profiles FOR ALL
  USING (is_admin());

-- Immobilier profiles
CREATE POLICY "Users read own immobilier profile"
  ON immobilier_profiles FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users update own immobilier profile"
  ON immobilier_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own immobilier profile"
  ON immobilier_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins manage all immobilier profiles"
  ON immobilier_profiles FOR ALL
  USING (is_admin());

-- Particulier profiles
CREATE POLICY "Users read own particulier profile"
  ON particulier_profiles FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users update own particulier profile"
  ON particulier_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own particulier profile"
  ON particulier_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins manage all particulier profiles"
  ON particulier_profiles FOR ALL
  USING (is_admin());
