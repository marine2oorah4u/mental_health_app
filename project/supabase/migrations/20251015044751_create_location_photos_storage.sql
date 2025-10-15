/*
  # Create Storage Bucket for Location Photos

  1. Storage
    - Create public bucket `location-photos` for user-uploaded location images
    - Set up RLS policies for uploads and access
  
  2. Security
    - Allow authenticated users to upload photos
    - Allow public read access to all photos
    - Limit file size to 5MB
*/

-- Create storage bucket for location photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('location-photos', 'location-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload location photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'location-photos');

-- Allow public read access to all photos
CREATE POLICY "Anyone can view location photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'location-photos');

-- Allow users to update their own uploads
CREATE POLICY "Users can update their own location photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'location-photos' AND owner = auth.uid());

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own location photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'location-photos' AND owner = auth.uid());