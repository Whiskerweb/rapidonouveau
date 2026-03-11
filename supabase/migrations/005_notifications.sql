-- ═══════════════════════════════════════════════════
-- MIGRATION 005 : Notifications
-- Système de notifications in-app temps réel
-- ═══════════════════════════════════════════════════

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs lisent leurs propres notifications
CREATE POLICY "Users read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Les utilisateurs peuvent marquer comme lu
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Seuls les admins/système peuvent créer des notifications
CREATE POLICY "Admins insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (is_admin());

-- Activer Supabase Realtime sur la table notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
