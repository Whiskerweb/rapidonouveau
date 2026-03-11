-- Billing clients table
CREATE TABLE IF NOT EXISTS billing_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  siret TEXT,
  client_type TEXT DEFAULT 'particulier' CHECK (client_type IN ('particulier', 'professionnel')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_billing_clients_artisan ON billing_clients(artisan_id);

-- RLS
ALTER TABLE billing_clients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'billing_clients' AND policyname = 'billing_clients_artisan_all') THEN
    CREATE POLICY billing_clients_artisan_all ON billing_clients FOR ALL USING (artisan_id = auth.uid());
  END IF;
END $$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_billing_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS billing_clients_updated_at ON billing_clients;
CREATE TRIGGER billing_clients_updated_at
  BEFORE UPDATE ON billing_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_clients_updated_at();
