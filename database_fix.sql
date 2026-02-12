-- Database Schema Fix for Missing Columns
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Ensure 'episodes' table has multi-quality video columns
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE public.episodes ADD COLUMN video_url_720p TEXT;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column video_url_720p already exists in episodes';
    END;

    BEGIN
        ALTER TABLE public.episodes ADD COLUMN video_url_1080p TEXT;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column video_url_1080p already exists in episodes';
    END;

    BEGIN
        ALTER TABLE public.episodes ADD COLUMN video_url_4k TEXT;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column video_url_4k already exists in episodes';
    END;
END $$;

-- 2. Force refresh PostgREST schema cache (run this just in case)
NOTIFY pgrst, 'reload schema';
