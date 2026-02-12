-- =============================================
-- ANILEGEON: User Profile Settings Migration
-- =============================================

-- 1) Extend users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2) User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  genres TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'sub',
  autoplay BOOLEAN DEFAULT TRUE,
  quality TEXT DEFAULT '720p',
  mature_content BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) User Privacy
CREATE TABLE IF NOT EXISTS user_privacy (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  show_status BOOLEAN DEFAULT TRUE,
  allow_requests BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  episode_alerts BOOLEAN DEFAULT TRUE,
  comment_replies BOOLEAN DEFAULT TRUE,
  friend_requests BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) Blocked Users
CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

-- 6) Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own privacy" ON user_privacy FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON user_notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own blocks" ON blocked_users FOR ALL USING (auth.uid() = user_id);
