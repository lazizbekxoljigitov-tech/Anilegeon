-- Supabase Storage Permissions Fix
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the 'videos' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow anyone to upload files to the 'videos' bucket
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

-- 3. Allow anyone to view files in the 'videos' bucket
CREATE POLICY "Allow public select"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- 4. Allow anyone to update/delete files (Optional, for admin use)
CREATE POLICY "Allow public update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos');

CREATE POLICY "Allow public delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');
