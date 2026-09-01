/*
# Create hive-images storage bucket

## Purpose
Creates a public storage bucket for hive image uploads used in AI health screening.

## Changes
- Creates storage bucket 'hive-images' if it doesn't exist
- Sets bucket to public so images can be accessed by the AI screening edge function
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('hive-images', 'hive-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to hive-images
DROP POLICY IF EXISTS "Allow authenticated uploads to hive-images" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to hive-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hive-images');

-- Allow public read of hive-images (needed for AI edge function and display)
DROP POLICY IF EXISTS "Allow public read of hive-images" ON storage.objects;
CREATE POLICY "Allow public read of hive-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'hive-images');

-- Allow authenticated users to delete their uploads
DROP POLICY IF EXISTS "Allow authenticated delete from hive-images" ON storage.objects;
CREATE POLICY "Allow authenticated delete from hive-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hive-images');
