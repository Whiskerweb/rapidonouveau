-- ═══════════════════════════════════════════════════
-- RAPIDO'DEVIS V2 — SCHÉMA COMPLET
-- ═══════════════════════════════════════════════════

-- Enums
CREATE TYPE user_role AS ENUM ('client', 'admin', 'super_admin');
CREATE TYPE subscription_plan AS ENUM ('essentiel', 'expert');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');
CREATE TYPE estimation_status AS ENUM ('draft', 'submitted', 'in_progress', 'validated', 'delivered');
CREATE TYPE property_type AS ENUM ('maison', 'appartement', 'immeuble', 'local_commercial', 'autre');
CREATE TYPE work_category AS ENUM ('isolation_interieure', 'isolation_exterieure', 'electricite', 'plomberie', 'menuiserie', 'assainissement', 'toiture', 'chauffage', 'peinture');
CREATE TYPE work_level AS ENUM ('partial', 'complete');
CREATE TYPE attachment_type AS ENUM ('photo', 'plan', 'other');
CREATE TYPE blog_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE promo_duration AS ENUM ('once', 'repeating', 'forever');

-- ═══════════════════════════════════════
-- TABLE: profiles
-- Étend auth.users de Supabase
-- ═══════════════════════════════════════
CREATE TABLE profiles (
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

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_stripe ON profiles(stripe_customer_id);

-- ═══════════════════════════════════════
-- TABLE: subscriptions
-- ═══════════════════════════════════════
CREATE TABLE subscriptions (
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

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ═══════════════════════════════════════
-- TABLE: packs
-- ═══════════════════════════════════════
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  credits_total INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_packs_user ON packs(user_id);

-- ═══════════════════════════════════════
-- TABLE: estimations
-- ═══════════════════════════════════════
CREATE TABLE estimations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status estimation_status DEFAULT 'draft' NOT NULL,
  
  -- Informations du bien
  property_type property_type,
  surface_m2 DECIMAL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  year_built INTEGER,
  rooms INTEGER,
  levels INTEGER,
  
  -- Méta
  notes TEXT,
  assigned_admin_id UUID REFERENCES profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  submitted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_estimations_user ON estimations(user_id);
CREATE INDEX idx_estimations_status ON estimations(status);
CREATE INDEX idx_estimations_assigned ON estimations(assigned_admin_id);
CREATE INDEX idx_estimations_submitted ON estimations(submitted_at);

-- ═══════════════════════════════════════
-- TABLE: estimation_items
-- Les postes de travaux sélectionnés
-- ═══════════════════════════════════════
CREATE TABLE estimation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  category work_category NOT NULL,
  level work_level NOT NULL DEFAULT 'complete',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_estimation_items_estimation ON estimation_items(estimation_id);

-- ═══════════════════════════════════════
-- TABLE: attachments
-- Photos et plans uploadés par le client
-- ═══════════════════════════════════════
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
  type attachment_type NOT NULL DEFAULT 'photo',
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  size_bytes INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_attachments_estimation ON attachments(estimation_id);

-- ═══════════════════════════════════════
-- TABLE: quotes (devis générés par l'admin)
-- ═══════════════════════════════════════
CREATE TABLE quotes (
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

CREATE INDEX idx_quotes_estimation ON quotes(estimation_id);

-- ═══════════════════════════════════════
-- TABLE: quote_items (lignes du devis)
-- ═══════════════════════════════════════
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  category work_category NOT NULL,
  label TEXT NOT NULL,
  amount_min DECIMAL NOT NULL DEFAULT 0,
  amount_max DECIMAL NOT NULL DEFAULT 0,
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

-- ═══════════════════════════════════════
-- TABLE: promo_codes
-- ═══════════════════════════════════════
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  stripe_coupon_id TEXT,
  stripe_promo_code_id TEXT,
  type TEXT NOT NULL DEFAULT 'percent', -- 'percent' ou 'amount'
  value DECIMAL NOT NULL, -- pourcentage ou montant en centimes
  applies_to TEXT[] DEFAULT '{}', -- plans concernés, vide = tous
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

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);

-- ═══════════════════════════════════════
-- TABLE: site_content
-- Contenu éditable du site (hero, témoignages, FAQ, etc.)
-- ═══════════════════════════════════════
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,          -- 'hero', 'features', 'testimonials', 'faq', 'stats', 'team', 'partners', 'banner'
  key TEXT NOT NULL,              -- 'title', 'subtitle', 'items', etc.
  value JSONB NOT NULL,           -- contenu flexible
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  UNIQUE(section, key)
);

-- ═══════════════════════════════════════
-- TABLE: blog_posts (articles créés via admin)
-- ═══════════════════════════════════════
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,           -- HTML (Tiptap output)
  category TEXT DEFAULT 'expertise', -- 'expertise', 'evenement', 'actualite'
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

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at);

-- ═══════════════════════════════════════
-- TABLE: email_templates
-- ═══════════════════════════════════════
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger TEXT NOT NULL UNIQUE, -- 'welcome', 'estimation_received', 'quote_ready', etc.
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- ['prenom', 'plan', 'lien_devis']
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_by UUID REFERENCES profiles(id)
);

-- ═══════════════════════════════════════
-- TABLE: admin_activity_log
-- ═══════════════════════════════════════
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL, -- 'estimation.status_changed', 'promo.created', 'content.updated'
  entity_type TEXT,     -- 'estimation', 'promo_code', 'site_content', 'blog_post'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_activity_admin ON admin_activity_log(admin_id);
CREATE INDEX idx_activity_created ON admin_activity_log(created_at);

-- ═══════════════════════════════════════
-- TRIGGER: auto-create profile on signup
-- ═══════════════════════════════════════
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════
-- TRIGGER: auto-update updated_at
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_estimations_updated_at BEFORE UPDATE ON estimations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

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

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins manage all profiles" ON profiles FOR ALL USING (is_admin());

-- SUBSCRIPTIONS
CREATE POLICY "Users read own subscription" ON subscriptions FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR ALL USING (is_admin());

-- PACKS
CREATE POLICY "Users read own packs" ON packs FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Service role manages packs" ON packs FOR ALL USING (is_admin());

-- ESTIMATIONS
CREATE POLICY "Users CRUD own estimations" ON estimations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins manage all estimations" ON estimations FOR ALL USING (is_admin());

-- ESTIMATION_ITEMS
CREATE POLICY "Users CRUD own estimation items" ON estimation_items FOR ALL
  USING (EXISTS (SELECT 1 FROM estimations WHERE id = estimation_items.estimation_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage all estimation items" ON estimation_items FOR ALL USING (is_admin());

-- ATTACHMENTS
CREATE POLICY "Users CRUD own attachments" ON attachments FOR ALL
  USING (EXISTS (SELECT 1 FROM estimations WHERE id = attachments.estimation_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage all attachments" ON attachments FOR ALL USING (is_admin());

-- QUOTES
CREATE POLICY "Users read own quotes" ON quotes FOR SELECT
  USING (EXISTS (SELECT 1 FROM estimations WHERE id = quotes.estimation_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage all quotes" ON quotes FOR ALL USING (is_admin());

-- QUOTE_ITEMS
CREATE POLICY "Users read own quote items" ON quote_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM quotes q JOIN estimations e ON q.estimation_id = e.id WHERE q.id = quote_items.quote_id AND e.user_id = auth.uid()));
CREATE POLICY "Admins manage all quote items" ON quote_items FOR ALL USING (is_admin());

-- PROMO_CODES
CREATE POLICY "Public read active promos" ON promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage promos" ON promo_codes FOR ALL USING (is_admin());

-- SITE_CONTENT
CREATE POLICY "Public read site content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage site content" ON site_content FOR ALL USING (is_admin());

-- BLOG_POSTS
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published' AND published_at <= now());
CREATE POLICY "Admins manage all posts" ON blog_posts FOR ALL USING (is_admin());

-- EMAIL_TEMPLATES
CREATE POLICY "Admins manage templates" ON email_templates FOR ALL USING (is_admin());

-- ADMIN_ACTIVITY_LOG
CREATE POLICY "Admins read log" ON admin_activity_log FOR SELECT USING (is_admin());
CREATE POLICY "Admins insert log" ON admin_activity_log FOR INSERT WITH CHECK (is_admin());

-- ═══════════════════════════════════════
-- SEED DATA : email templates
-- ═══════════════════════════════════════
INSERT INTO email_templates (trigger, subject, body_html, variables) VALUES
('welcome', 'Bienvenue sur Rapido''Devis !', '<p>Bonjour {{prenom}}, bienvenue !</p>', '{"prenom", "email"}'),
('estimation_received', 'Votre demande d''estimation a été reçue', '<p>Bonjour {{prenom}}, nous avons bien reçu votre demande.</p>', '{"prenom", "estimation_id"}'),
('estimation_in_progress', 'Votre estimation est en cours de traitement', '<p>Bonjour {{prenom}}, un expert traite votre demande.</p>', '{"prenom"}'),
('quote_ready', 'Votre estimation est prête !', '<p>Bonjour {{prenom}}, votre devis est disponible : {{lien_devis}}</p>', '{"prenom", "lien_devis"}'),
('payment_failed', 'Problème avec votre paiement', '<p>Bonjour {{prenom}}, votre paiement a échoué.</p>', '{"prenom", "lien_paiement"}');

-- ═══════════════════════════════════════
-- TABLE: credit_transactions (Added from updated PRD)
-- ═══════════════════════════════════════
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES packs(id),
  estimation_id UUID REFERENCES estimations(id),
  type TEXT NOT NULL, -- 'debit' (utilisation) ou 'credit' (achat/remboursement)
  amount INTEGER NOT NULL, -- +1 pour achat, -1 pour utilisation
  balance_after INTEGER NOT NULL, -- solde après transaction
  description TEXT, -- "Estimation soumise #abc123" ou "Achat Pack Pro"
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at);

-- RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own transactions" ON credit_transactions FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "System inserts transactions" ON credit_transactions FOR INSERT WITH CHECK (is_admin());
