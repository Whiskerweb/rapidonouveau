-- ============================================
-- 012: Bibliotheque produits + Fournisseurs
-- ============================================

-- Fournisseurs
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artisans manage own suppliers" ON suppliers
  FOR ALL USING (artisan_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_suppliers_artisan ON suppliers(artisan_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_suppliers_updated_at();

-- Categories bibliotheque
CREATE TABLE IF NOT EXISTS library_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artisan_id, name)
);

ALTER TABLE library_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artisans manage own categories" ON library_categories
  FOR ALL USING (artisan_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_library_categories_artisan ON library_categories(artisan_id);

-- Enrichir work_items_library
ALTER TABLE work_items_library
  ADD COLUMN IF NOT EXISTS cost_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supplier_reference TEXT,
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS use_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES library_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_work_library_favorite ON work_items_library(artisan_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_work_library_last_used ON work_items_library(artisan_id, last_used_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_work_library_category ON work_items_library(category_id);
CREATE INDEX IF NOT EXISTS idx_work_library_supplier ON work_items_library(supplier_id);

-- Catalogue fournisseur
CREATE TABLE IF NOT EXISTS supplier_catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  artisan_id UUID NOT NULL REFERENCES artisan_profiles(user_id) ON DELETE CASCADE,
  reference TEXT,
  designation TEXT NOT NULL,
  description TEXT,
  unit TEXT DEFAULT 'u',
  price_ht NUMERIC(12,2) NOT NULL,
  tva_rate NUMERIC(5,2) DEFAULT 20.00,
  category TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE supplier_catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artisans manage own catalog items" ON supplier_catalog_items
  FOR ALL USING (artisan_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_supplier_catalog_supplier ON supplier_catalog_items(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_catalog_artisan ON supplier_catalog_items(artisan_id);
