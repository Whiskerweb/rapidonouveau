-- ═══════════════════════════════════════════════════
-- SCRIPT COMPLET IDEMPOTENT — Toutes migrations 001-008
-- Peut etre relance sans erreur meme si partiellement applique
-- ═══════════════════════════════════════════════════

-- ============================================
-- 001: INITIAL SCHEMA
-- ============================================

-- Enums (idempotent)
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('client', 'admin', 'super_admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_plan AS ENUM ('essentiel', 'expert'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE estimation_status AS ENUM ('draft', 'submitted', 'in_progress', 'validated', 'delivered'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE property_type AS ENUM ('maison', 'appartement', 'immeuble', 'local_commercial', 'autre'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE work_category AS ENUM ('isolation_interieure', 'isolation_exterieure', 'electricite', 'plomberie', 'menuiserie', 'assainissement', 'toiture', 'chauffage', 'peinture'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE work_level AS ENUM ('partial', 'complete'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE attachment_type AS ENUM ('photo', 'plan', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE blog_status AS ENUM ('draft', 'scheduled', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE promo_duration AS ENUM ('once', 'repeating', 'forever'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  role user_role DEFAULT 'client' NOT NULL,
  logo_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe ON profiles(stripe_customer_id);

-- subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan subscription_plan NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- packs
CREATE TABLE IF NOT EXISTS packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  credits_total INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_packs_user ON packs(user_id);

-- estimations
CREATE TABLE IF NOT EXISTS estimations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status estimation_status DEFAULT 'draft' NOT NULL,
  property_type property_type,
  surface_m2 DECIMAL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  year_built INTEGER,
  rooms INTEGER,
  levels INTEGER,
  notes TEXT,
  assigned_admin_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  submitted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_estimations_user ON estimations(user_id);
CREATE INDEX IF NOT EXISTS idx_estimations_status ON estimations(status);
CREATE INDEX IF NOT EXISTS idx_estimations_assigned ON estimations(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_estimations_submitted ON estimations(submitted_at);

-- estimation_items
CREATE TABLE IF NOT EXISTS estimation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  category work_category NOT NULL,
  level work_level NOT NULL DEFAULT 'complete',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_estimation_items_estimation ON estimation_items(estimation_id);

-- attachments
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  type attachment_type NOT NULL DEFAULT 'photo',
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  size_bytes INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attachments_estimation ON attachments(estimation_id);

-- quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id),
  pdf_storage_path TEXT,
  total_amount_min DECIMAL,
  total_amount_max DECIMAL,
  notes_internal TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  validated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_quotes_estimation ON quotes(estimation_id);

-- quote_items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  category work_category NOT NULL,
  label TEXT NOT NULL,
  amount_min DECIMAL NOT NULL DEFAULT 0,
  amount_max DECIMAL NOT NULL DEFAULT 0,
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON quote_items(quote_id);

-- promo_codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  stripe_coupon_id TEXT,
  stripe_promo_code_id TEXT,
  type TEXT NOT NULL DEFAULT 'percent',
  value DECIMAL NOT NULL,
  applies_to TEXT[] DEFAULT '{}',
  duration promo_duration DEFAULT 'once' NOT NULL,
  duration_in_months INTEGER,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  max_redemptions INTEGER,
  times_redeemed INTEGER DEFAULT 0,
  first_time_only BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);

-- site_content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  UNIQUE(section, key)
);

-- blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'expertise',
  author_id UUID REFERENCES profiles(id),
  featured_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status blog_status DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);

-- email_templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_by UUID REFERENCES profiles(id)
);

-- admin_activity_log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_activity_admin ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON admin_activity_log(created_at);

-- credit_transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES packs(id),
  estimation_id UUID REFERENCES estimations(id),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created ON credit_transactions(created_at);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers (idempotent via DROP IF EXISTS)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_estimations_updated_at ON estimations;
CREATE TRIGGER update_estimations_updated_at BEFORE UPDATE ON estimations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON promo_codes;
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS (idempotent — ALTER TABLE ... ENABLE is safe to rerun)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimations ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies (idempotent via DO block)
DO $$ BEGIN
  -- PROFILES
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users read own profile') THEN
    CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users update own profile') THEN
    CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Admins manage all profiles') THEN
    CREATE POLICY "Admins manage all profiles" ON profiles FOR ALL USING (is_admin());
  END IF;

  -- SUBSCRIPTIONS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='subscriptions' AND policyname='Users read own subscription') THEN
    CREATE POLICY "Users read own subscription" ON subscriptions FOR SELECT USING (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='subscriptions' AND policyname='Service role manages subscriptions') THEN
    CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR ALL USING (is_admin());
  END IF;

  -- PACKS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='packs' AND policyname='Users read own packs') THEN
    CREATE POLICY "Users read own packs" ON packs FOR SELECT USING (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='packs' AND policyname='Service role manages packs') THEN
    CREATE POLICY "Service role manages packs" ON packs FOR ALL USING (is_admin());
  END IF;

  -- ESTIMATIONS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimations' AND policyname='Users CRUD own estimations') THEN
    CREATE POLICY "Users CRUD own estimations" ON estimations FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimations' AND policyname='Admins manage all estimations') THEN
    CREATE POLICY "Admins manage all estimations" ON estimations FOR ALL USING (is_admin());
  END IF;

  -- ESTIMATION_ITEMS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimation_items' AND policyname='Users CRUD own estimation items') THEN
    CREATE POLICY "Users CRUD own estimation items" ON estimation_items FOR ALL
      USING (EXISTS (SELECT 1 FROM estimations WHERE id = estimation_items.estimation_id AND user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimation_items' AND policyname='Admins manage all estimation items') THEN
    CREATE POLICY "Admins manage all estimation items" ON estimation_items FOR ALL USING (is_admin());
  END IF;

  -- ATTACHMENTS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='attachments' AND policyname='Users CRUD own attachments') THEN
    CREATE POLICY "Users CRUD own attachments" ON attachments FOR ALL
      USING (EXISTS (SELECT 1 FROM estimations WHERE id = attachments.estimation_id AND user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='attachments' AND policyname='Admins manage all attachments') THEN
    CREATE POLICY "Admins manage all attachments" ON attachments FOR ALL USING (is_admin());
  END IF;

  -- QUOTES
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quotes' AND policyname='Users read own quotes') THEN
    CREATE POLICY "Users read own quotes" ON quotes FOR SELECT
      USING (EXISTS (SELECT 1 FROM estimations WHERE id = quotes.estimation_id AND user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quotes' AND policyname='Admins manage all quotes') THEN
    CREATE POLICY "Admins manage all quotes" ON quotes FOR ALL USING (is_admin());
  END IF;

  -- QUOTE_ITEMS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quote_items' AND policyname='Users read own quote items') THEN
    CREATE POLICY "Users read own quote items" ON quote_items FOR SELECT
      USING (EXISTS (SELECT 1 FROM quotes q JOIN estimations e ON q.estimation_id = e.id WHERE q.id = quote_items.quote_id AND e.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quote_items' AND policyname='Admins manage all quote items') THEN
    CREATE POLICY "Admins manage all quote items" ON quote_items FOR ALL USING (is_admin());
  END IF;

  -- PROMO_CODES
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promo_codes' AND policyname='Public read active promos') THEN
    CREATE POLICY "Public read active promos" ON promo_codes FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promo_codes' AND policyname='Admins manage promos') THEN
    CREATE POLICY "Admins manage promos" ON promo_codes FOR ALL USING (is_admin());
  END IF;

  -- SITE_CONTENT
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_content' AND policyname='Public read site content') THEN
    CREATE POLICY "Public read site content" ON site_content FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_content' AND policyname='Admins manage site content') THEN
    CREATE POLICY "Admins manage site content" ON site_content FOR ALL USING (is_admin());
  END IF;

  -- BLOG_POSTS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Public read published posts') THEN
    CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published' AND published_at <= now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Admins manage all posts') THEN
    CREATE POLICY "Admins manage all posts" ON blog_posts FOR ALL USING (is_admin());
  END IF;

  -- EMAIL_TEMPLATES
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='email_templates' AND policyname='Admins manage templates') THEN
    CREATE POLICY "Admins manage templates" ON email_templates FOR ALL USING (is_admin());
  END IF;

  -- ADMIN_ACTIVITY_LOG
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_activity_log' AND policyname='Admins read log') THEN
    CREATE POLICY "Admins read log" ON admin_activity_log FOR SELECT USING (is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_activity_log' AND policyname='Admins insert log') THEN
    CREATE POLICY "Admins insert log" ON admin_activity_log FOR INSERT WITH CHECK (is_admin());
  END IF;

  -- CREDIT_TRANSACTIONS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='credit_transactions' AND policyname='Users read own transactions') THEN
    CREATE POLICY "Users read own transactions" ON credit_transactions FOR SELECT USING (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='credit_transactions' AND policyname='System inserts transactions') THEN
    CREATE POLICY "System inserts transactions" ON credit_transactions FOR INSERT WITH CHECK (is_admin());
  END IF;
END $$;

-- Seed email templates (idempotent via ON CONFLICT)
INSERT INTO email_templates (trigger, subject, body_html, variables) VALUES
('welcome', 'Bienvenue sur Rapido''Devis !', '<p>Bonjour {{prenom}}, bienvenue !</p>', '{"prenom", "email"}'),
('estimation_received', 'Votre demande d''estimation a été reçue', '<p>Bonjour {{prenom}}, nous avons bien reçu votre demande.</p>', '{"prenom", "estimation_id"}'),
('estimation_in_progress', 'Votre estimation est en cours de traitement', '<p>Bonjour {{prenom}}, un expert traite votre demande.</p>', '{"prenom"}'),
('quote_ready', 'Votre estimation est prête !', '<p>Bonjour {{prenom}}, votre devis est disponible : {{lien_devis}}</p>', '{"prenom", "lien_devis"}'),
('payment_failed', 'Problème avec votre paiement', '<p>Bonjour {{prenom}}, votre paiement a échoué.</p>', '{"prenom", "lien_paiement"}')
ON CONFLICT (trigger) DO NOTHING;


-- ============================================
-- 002: MULTI-PROFILES
-- ============================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_type TEXT,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_department TEXT,
  ADD COLUMN IF NOT EXISTS address_lat DECIMAL(10,8),
  ADD COLUMN IF NOT EXISTS address_lng DECIMAL(11,8),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add CHECK constraint idempotent
DO $$ BEGIN
  ALTER TABLE profiles ADD CONSTRAINT profiles_profile_type_check CHECK (profile_type IN ('artisan', 'immobilier', 'particulier'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_profile_type ON profiles(profile_type);

CREATE TABLE IF NOT EXISTS artisan_profiles (
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

DROP TRIGGER IF EXISTS update_artisan_profiles_updated_at ON artisan_profiles;
CREATE TRIGGER update_artisan_profiles_updated_at
  BEFORE UPDATE ON artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS immobilier_profiles (
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

DROP TRIGGER IF EXISTS update_immobilier_profiles_updated_at ON immobilier_profiles;
CREATE TRIGGER update_immobilier_profiles_updated_at
  BEFORE UPDATE ON immobilier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS particulier_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_owner BOOLEAN DEFAULT TRUE,
  property_type TEXT,
  estimated_budget_range TEXT,
  is_first_project BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

DROP TRIGGER IF EXISTS update_particulier_profiles_updated_at ON particulier_profiles;
CREATE TRIGGER update_particulier_profiles_updated_at
  BEFORE UPDATE ON particulier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE immobilier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE particulier_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Artisan profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='artisan_profiles' AND policyname='Users read own artisan profile') THEN
    CREATE POLICY "Users read own artisan profile" ON artisan_profiles FOR SELECT USING (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='artisan_profiles' AND policyname='Users update own artisan profile') THEN
    CREATE POLICY "Users update own artisan profile" ON artisan_profiles FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='artisan_profiles' AND policyname='Users insert own artisan profile') THEN
    CREATE POLICY "Users insert own artisan profile" ON artisan_profiles FOR INSERT WITH CHECK (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='artisan_profiles' AND policyname='Admins manage all artisan profiles') THEN
    CREATE POLICY "Admins manage all artisan profiles" ON artisan_profiles FOR ALL USING (is_admin());
  END IF;

  -- Immobilier profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='immobilier_profiles' AND policyname='Users read own immobilier profile') THEN
    CREATE POLICY "Users read own immobilier profile" ON immobilier_profiles FOR SELECT USING (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='immobilier_profiles' AND policyname='Users update own immobilier profile') THEN
    CREATE POLICY "Users update own immobilier profile" ON immobilier_profiles FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='immobilier_profiles' AND policyname='Users insert own immobilier profile') THEN
    CREATE POLICY "Users insert own immobilier profile" ON immobilier_profiles FOR INSERT WITH CHECK (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='immobilier_profiles' AND policyname='Admins manage all immobilier profiles') THEN
    CREATE POLICY "Admins manage all immobilier profiles" ON immobilier_profiles FOR ALL USING (is_admin());
  END IF;

  -- Particulier profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='particulier_profiles' AND policyname='Users read own particulier profile') THEN
    CREATE POLICY "Users read own particulier profile" ON particulier_profiles FOR SELECT USING (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='particulier_profiles' AND policyname='Users update own particulier profile') THEN
    CREATE POLICY "Users update own particulier profile" ON particulier_profiles FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='particulier_profiles' AND policyname='Users insert own particulier profile') THEN
    CREATE POLICY "Users insert own particulier profile" ON particulier_profiles FOR INSERT WITH CHECK (user_id = auth.uid() OR is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='particulier_profiles' AND policyname='Admins manage all particulier profiles') THEN
    CREATE POLICY "Admins manage all particulier profiles" ON particulier_profiles FOR ALL USING (is_admin());
  END IF;
END $$;


-- ============================================
-- 003: ENHANCED ESTIMATIONS
-- ============================================

ALTER TABLE estimations
  ADD COLUMN IF NOT EXISTS questionnaire_responses JSONB,
  ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
  ADD COLUMN IF NOT EXISTS ai_estimation JSONB,
  ADD COLUMN IF NOT EXISTS final_estimation JSONB,
  ADD COLUMN IF NOT EXISTS project_type TEXT,
  ADD COLUMN IF NOT EXISTS location_department TEXT;

-- reviewed_by needs special handling (FK)
DO $$ BEGIN
  ALTER TABLE estimations ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_estimations_project_type ON estimations(project_type);
CREATE INDEX IF NOT EXISTS idx_estimations_reviewed_by ON estimations(reviewed_by);


-- ============================================
-- 004: ESTIMATION DOCUMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS estimation_documents (
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
CREATE INDEX IF NOT EXISTS idx_estimation_documents_estimation ON estimation_documents(estimation_id);
CREATE INDEX IF NOT EXISTS idx_estimation_documents_uploaded_by ON estimation_documents(uploaded_by);

ALTER TABLE estimation_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimation_documents' AND policyname='Users read own estimation documents') THEN
    CREATE POLICY "Users read own estimation documents" ON estimation_documents FOR SELECT
      USING (is_visible_to_user = TRUE AND EXISTS (SELECT 1 FROM estimations WHERE id = estimation_documents.estimation_id AND user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimation_documents' AND policyname='Users update viewed_at on own documents') THEN
    CREATE POLICY "Users update viewed_at on own documents" ON estimation_documents FOR UPDATE
      USING (EXISTS (SELECT 1 FROM estimations WHERE id = estimation_documents.estimation_id AND user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='estimation_documents' AND policyname='Admins manage all estimation documents') THEN
    CREATE POLICY "Admins manage all estimation documents" ON estimation_documents FOR ALL USING (is_admin());
  END IF;
END $$;


-- ============================================
-- 005: NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Users read own notifications') THEN
    CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Users update own notifications') THEN
    CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Admins insert notifications') THEN
    CREATE POLICY "Admins insert notifications" ON notifications FOR INSERT WITH CHECK (is_admin());
  END IF;
END $$;

-- Realtime (safe to rerun)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================
-- 006: MATCHING SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS matching_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'cancelled', 'expired')),
  required_trades TEXT[] NOT NULL DEFAULT '{}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  max_distance_km INTEGER DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  matched_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE IF NOT EXISTS matching_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matching_request_id UUID NOT NULL REFERENCES matching_requests(id) ON DELETE CASCADE,
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
  artisan_message TEXT,
  estimated_start_date DATE,
  estimated_price DECIMAL(12,2),
  score NUMERIC(5,2) DEFAULT 0,
  user_accepted BOOLEAN DEFAULT FALSE,
  artisan_accepted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(matching_request_id, artisan_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matching_proposal_id UUID NOT NULL REFERENCES matching_proposals(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewed_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(matching_proposal_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_matching_requests_user ON matching_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_requests_status ON matching_requests(status);
CREATE INDEX IF NOT EXISTS idx_matching_requests_estimation ON matching_requests(estimation_id);
CREATE INDEX IF NOT EXISTS idx_matching_proposals_artisan ON matching_proposals(artisan_id);
CREATE INDEX IF NOT EXISTS idx_matching_proposals_request ON matching_proposals(matching_request_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewed_id);

ALTER TABLE matching_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Matching requests
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_requests' AND policyname='Users see own matching requests') THEN
    CREATE POLICY "Users see own matching requests" ON matching_requests FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_requests' AND policyname='Users create own matching requests') THEN
    CREATE POLICY "Users create own matching requests" ON matching_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_requests' AND policyname='Users update own matching requests') THEN
    CREATE POLICY "Users update own matching requests" ON matching_requests FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_requests' AND policyname='Admins manage all matching requests') THEN
    CREATE POLICY "Admins manage all matching requests" ON matching_requests FOR ALL USING (is_admin());
  END IF;

  -- Matching proposals
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_proposals' AND policyname='Artisans see relevant proposals') THEN
    CREATE POLICY "Artisans see relevant proposals" ON matching_proposals FOR SELECT
      USING (artisan_id = auth.uid() OR matching_request_id IN (SELECT id FROM matching_requests WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_proposals' AND policyname='Artisans create proposals') THEN
    CREATE POLICY "Artisans create proposals" ON matching_proposals FOR INSERT WITH CHECK (artisan_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_proposals' AND policyname='Participants update proposals') THEN
    CREATE POLICY "Participants update proposals" ON matching_proposals FOR UPDATE
      USING (artisan_id = auth.uid() OR matching_request_id IN (SELECT id FROM matching_requests WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matching_proposals' AND policyname='Admins manage all proposals') THEN
    CREATE POLICY "Admins manage all proposals" ON matching_proposals FOR ALL USING (is_admin());
  END IF;

  -- Reviews
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='Reviews visible to all') THEN
    CREATE POLICY "Reviews visible to all" ON reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='Participants create reviews') THEN
    CREATE POLICY "Participants create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='Admins manage all reviews') THEN
    CREATE POLICY "Admins manage all reviews" ON reviews FOR ALL USING (is_admin());
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_matching_requests_updated_at ON matching_requests;
CREATE TRIGGER update_matching_requests_updated_at
  BEFORE UPDATE ON matching_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_matching_proposals_updated_at ON matching_proposals;
CREATE TRIGGER update_matching_proposals_updated_at
  BEFORE UPDATE ON matching_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================
-- 007: BILLING SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS work_items_library (
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

CREATE TABLE IF NOT EXISTS billing_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  client_siret TEXT,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  parent_devis_id UUID REFERENCES billing_documents(id),
  estimation_id UUID REFERENCES estimations(id),
  matching_proposal_id UUID REFERENCES matching_proposals(id),
  status TEXT NOT NULL DEFAULT 'draft',
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

CREATE TABLE IF NOT EXISTS billing_document_lines (
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

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES billing_documents(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES billing_documents(id),
  reminder_level INTEGER NOT NULL DEFAULT 1,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sent_via TEXT DEFAULT 'email',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_billing_docs_artisan ON billing_documents(artisan_id);
CREATE INDEX IF NOT EXISTS idx_billing_docs_type ON billing_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_billing_docs_status ON billing_documents(status);
CREATE INDEX IF NOT EXISTS idx_billing_lines_doc ON billing_document_lines(document_id);
CREATE INDEX IF NOT EXISTS idx_work_library_artisan ON work_items_library(artisan_id);
CREATE INDEX IF NOT EXISTS idx_payments_document ON payments(document_id);

ALTER TABLE work_items_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_document_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='work_items_library' AND policyname='Artisans manage own library') THEN
    CREATE POLICY "Artisans manage own library" ON work_items_library FOR ALL USING (artisan_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='billing_documents' AND policyname='Artisans manage own billing docs') THEN
    CREATE POLICY "Artisans manage own billing docs" ON billing_documents FOR ALL USING (artisan_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='billing_document_lines' AND policyname='Lines via document owner') THEN
    CREATE POLICY "Lines via document owner" ON billing_document_lines FOR ALL
      USING (document_id IN (SELECT id FROM billing_documents WHERE artisan_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payments' AND policyname='Payments via document owner') THEN
    CREATE POLICY "Payments via document owner" ON payments FOR ALL
      USING (document_id IN (SELECT id FROM billing_documents WHERE artisan_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_reminders' AND policyname='Reminders via document owner') THEN
    CREATE POLICY "Reminders via document owner" ON payment_reminders FOR ALL
      USING (document_id IN (SELECT id FROM billing_documents WHERE artisan_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='work_items_library' AND policyname='Admins manage all work_items_library') THEN
    CREATE POLICY "Admins manage all work_items_library" ON work_items_library FOR ALL USING (is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='billing_documents' AND policyname='Admins manage all billing_documents') THEN
    CREATE POLICY "Admins manage all billing_documents" ON billing_documents FOR ALL USING (is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='billing_document_lines' AND policyname='Admins manage all billing_lines') THEN
    CREATE POLICY "Admins manage all billing_lines" ON billing_document_lines FOR ALL USING (is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payments' AND policyname='Admins manage all payments') THEN
    CREATE POLICY "Admins manage all payments" ON payments FOR ALL USING (is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_reminders' AND policyname='Admins manage all reminders') THEN
    CREATE POLICY "Admins manage all reminders" ON payment_reminders FOR ALL USING (is_admin());
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items_library;
CREATE TRIGGER update_work_items_updated_at
  BEFORE UPDATE ON work_items_library FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS update_billing_docs_updated_at ON billing_documents;
CREATE TRIGGER update_billing_docs_updated_at
  BEFORE UPDATE ON billing_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================
-- 008: ADVANCED BILLING FEATURES
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

-- Avoir reference
DO $$ BEGIN
  ALTER TABLE billing_documents ADD COLUMN avoir_reference_id UUID REFERENCES billing_documents(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

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
CREATE INDEX IF NOT EXISTS idx_billing_docs_avoir_ref ON billing_documents(avoir_reference_id);

-- Fonction de numerotation mise a jour
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

-- RLS: acces public via sign_token
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'billing_documents' AND policyname = 'Public sign access by token'
  ) THEN
    CREATE POLICY "Public sign access by token" ON billing_documents
      FOR SELECT
      USING (sign_token IS NOT NULL AND status = 'sent');
  END IF;
END $$;


-- ============================================
-- FIN — Script complet applique avec succes
-- ============================================
