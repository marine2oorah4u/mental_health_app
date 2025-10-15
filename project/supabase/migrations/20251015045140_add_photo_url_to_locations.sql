/*
  # Add photo_url column to accessible_locations

  1. Changes
    - Add `photo_url` column to `accessible_locations` table
    - Allow NULL values (optional field)
  
  2. Notes
    - This enables storing uploaded photos or photo URLs for locations
*/

-- Add photo_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accessible_locations' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE accessible_locations ADD COLUMN photo_url TEXT;
  END IF;
END $$;