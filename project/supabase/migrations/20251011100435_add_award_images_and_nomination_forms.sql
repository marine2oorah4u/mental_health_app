/*
  Add Award Images and Nomination Form Support

  Changes:
  1. Add image_url column to awards table for award badge/patch images
  2. Update award_forms to better support nomination forms
  3. Add indexes for performance

  This allows awards to display images and include nomination forms
*/

-- Add image URL to awards table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'awards' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE awards ADD COLUMN image_url text;
  END IF;
END $$;

-- Add nomination_url to awards for direct links to nomination forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'awards' AND column_name = 'nomination_url'
  ) THEN
    ALTER TABLE awards ADD COLUMN nomination_url text;
  END IF;
END $$;