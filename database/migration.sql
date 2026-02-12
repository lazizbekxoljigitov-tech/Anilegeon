-- ============================================
-- ANILEGEON Consolidated Database Migration (COMPLETE)
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anime (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  banner_url TEXT,
  thumbnail_url TEXT,
  rating DECIMAL(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
  is_trending BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  title VARCHAR(255),
  episode_number INTEGER NOT NULL,
  video_url TEXT,
  video_url_720p TEXT,
  video_url_1080p TEXT,
  video_url_4k TEXT,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(anime_id, episode_number)
);

CREATE TABLE IF NOT EXISTS anime_categories (
  anime_id UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (anime_id, category_id)
);

CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, anime_id, episode_id)
);

CREATE TABLE IF NOT EXISTS saved_anime (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

CREATE TABLE IF NOT EXISTS views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Disable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE anime DISABLE ROW LEVEL SECURITY;
ALTER TABLE episodes DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE anime_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_anime DISABLE ROW LEVEL SECURITY;
ALTER TABLE views DISABLE ROW LEVEL SECURITY;

-- 4. Storage Buckets (Set 700MB for Videos, 100MB for Images)
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('banners', 'banners', true, 104857600) 
ON CONFLICT (id) DO UPDATE SET file_size_limit = 104857600;

INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('thumbnails', 'thumbnails', true, 104857600) 
ON CONFLICT (id) DO UPDATE SET file_size_limit = 104857600;

INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('videos', 'videos', true, 734003200) 
ON CONFLICT (id) DO UPDATE SET file_size_limit = 734003200;

INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('avatars', 'avatars', true, 10485760) 
ON CONFLICT (id) DO UPDATE SET file_size_limit = 10485760;

-- 5. Storage Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
    DROP POLICY IF EXISTS "Allow service uploads" ON storage.objects;
END $$;

CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Allow service uploads" ON storage.objects FOR INSERT WITH CHECK (true);

-- 6. Seed Default Categories
INSERT INTO categories (name) VALUES
  ('Action'), ('Adventure'), ('Comedy'), ('Drama'), ('Fantasy'),
  ('Horror'), ('Mecha'), ('Music'), ('Mystery'), ('Psychological'),
  ('Romance'), ('Sci-Fi'), ('Slice of Life'), ('Sports'),
  ('Supernatural'), ('Thriller')
ON CONFLICT (name) DO NOTHING;
