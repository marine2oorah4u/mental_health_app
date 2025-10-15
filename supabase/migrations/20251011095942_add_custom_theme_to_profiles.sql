/*
  # Add Custom Theme Support to Profiles

  1. Changes
    - Add `custom_theme_data` column to profiles table
      - Stores JSON data for user's custom theme colors
      - Nullable, only populated when user creates custom theme

  2. Notes
    - Uses JSONB for efficient storage and querying
    - No breaking changes to existing data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'custom_theme_data'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_theme_data jsonb;
  END IF;
END $$;