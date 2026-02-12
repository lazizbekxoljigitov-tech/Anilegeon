-- Supabase Perfection SQL Script
-- Run this in your Supabase SQL Editor

-- 1. Tables Setup
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.anime (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    banner_url TEXT,
    thumbnail_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    is_trending BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'ongoing', -- ongoing, completed
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.anime_categories (
    anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (anime_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
    title TEXT,
    episode_number INTEGER NOT NULL,
    video_url TEXT,
    video_url_720p TEXT,
    video_url_1080p TEXT,
    video_url_4k TEXT,
    duration INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(anime_id, episode_number)
);

CREATE TABLE IF NOT EXISTS public.views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, anime_id, episode_id)
);

CREATE TABLE IF NOT EXISTS public.saved_anime (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, anime_id)
);

-- 2. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_anime_updated_at') THEN
        CREATE TRIGGER update_anime_updated_at BEFORE UPDATE ON public.anime FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_episodes_updated_at') THEN
        CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON public.episodes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- 3. RLS - Enable and set public access (Simplified for development)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on anime" ON public.anime FOR SELECT USING (true);
CREATE POLICY "Allow public select on episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Allow public select on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public select on anime_categories" ON public.anime_categories FOR SELECT USING (true);

-- Note: In production, insert/update/delete should be restricted to authenticated admins.
-- These policies allow full read for everyone.
