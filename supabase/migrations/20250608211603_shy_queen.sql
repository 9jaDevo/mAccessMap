/*
  # Setup Storage for Review Photos

  1. Storage Bucket
    - Create 'review-photos' bucket for storing review images
    - Set file size limit to 10MB
    - Allow common image formats (JPEG, PNG, WebP, GIF)
    - Enable public read access

  2. Security Policies
    - Users can upload photos to their own folders
    - Public read access for all photos
    - Users can manage their own photos only

  3. Utility Functions
    - Helper function to generate photo URLs
*/

-- Create the storage bucket
DO $$
BEGIN
  -- Check if bucket already exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'review-photos'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (
      id, 
      name, 
      public, 
      file_size_limit, 
      allowed_mime_types,
      created_at,
      updated_at
    ) VALUES (
      'review-photos',
      'review-photos',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      now(),
      now()
    );
  END IF;
END $$;

-- Ensure RLS is enabled on storage.objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'objects' 
    AND n.nspname = 'storage'
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload review photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view review photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own review photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own review photos" ON storage.objects;

-- Policy: Allow authenticated users to upload photos to their own user folder
CREATE POLICY "Users can upload review photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'review-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access to all photos in the bucket
CREATE POLICY "Public can view review photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'review-photos');

-- Policy: Allow users to update their own photos
CREATE POLICY "Users can update own review photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'review-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own photos
CREATE POLICY "Users can delete own review photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'review-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a function to help with photo URL generation
CREATE OR REPLACE FUNCTION public.get_photo_url(bucket_name text, file_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN concat(
    current_setting('app.settings.supabase_url', true),
    '/storage/v1/object/public/',
    bucket_name,
    '/',
    file_path
  );
EXCEPTION
  WHEN others THEN
    -- Fallback if setting is not available
    RETURN concat(
      '/storage/v1/object/public/',
      bucket_name,
      '/',
      file_path
    );
END;
$$;

-- Grant execute permission on the utility function
GRANT EXECUTE ON FUNCTION public.get_photo_url(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_photo_url(text, text) TO anon;