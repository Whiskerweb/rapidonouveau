-- Migration 006: Matching system (artisan-client matching)

-- Matching requests (user requests artisan matching for a delivered estimation)
CREATE TABLE matching_requests (
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

-- Matching proposals (artisan sees the request, proposes)
CREATE TABLE matching_proposals (
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

-- Reviews (after project completion)
CREATE TABLE reviews (
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

-- Indexes
CREATE INDEX idx_matching_requests_user ON matching_requests(user_id);
CREATE INDEX idx_matching_requests_status ON matching_requests(status);
CREATE INDEX idx_matching_requests_estimation ON matching_requests(estimation_id);
CREATE INDEX idx_matching_proposals_artisan ON matching_proposals(artisan_id);
CREATE INDEX idx_matching_proposals_request ON matching_proposals(matching_request_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);

-- RLS
ALTER TABLE matching_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Matching requests policies
CREATE POLICY "Users see own matching requests" ON matching_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own matching requests" ON matching_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own matching requests" ON matching_requests
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all matching requests" ON matching_requests
  FOR ALL USING (is_admin());

-- Matching proposals policies
CREATE POLICY "Artisans see relevant proposals" ON matching_proposals
  FOR SELECT USING (
    artisan_id = auth.uid() OR
    matching_request_id IN (SELECT id FROM matching_requests WHERE user_id = auth.uid())
  );
CREATE POLICY "Artisans create proposals" ON matching_proposals
  FOR INSERT WITH CHECK (artisan_id = auth.uid());
CREATE POLICY "Participants update proposals" ON matching_proposals
  FOR UPDATE USING (
    artisan_id = auth.uid() OR
    matching_request_id IN (SELECT id FROM matching_requests WHERE user_id = auth.uid())
  );
CREATE POLICY "Admins manage all proposals" ON matching_proposals
  FOR ALL USING (is_admin());

-- Reviews policies
CREATE POLICY "Reviews visible to all" ON reviews
  FOR SELECT USING (true);
CREATE POLICY "Participants create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Admins manage all reviews" ON reviews
  FOR ALL USING (is_admin());

-- Auto-update timestamps
CREATE TRIGGER update_matching_requests_updated_at
  BEFORE UPDATE ON matching_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matching_proposals_updated_at
  BEFORE UPDATE ON matching_proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
