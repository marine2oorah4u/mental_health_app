/*
  # Profile Customization Enhancement

  ## Summary
  Adds bio and avatar URL fields to profiles table for user customization.

  ## Changes
  1. New Columns
    - `bio` (text, nullable) - User biography or about me section
    - `avatar_url` (text, nullable) - URL to user's avatar image

  ## Notes
  - Both fields are optional and nullable
  - No default values set
  - Existing RLS policies cover these new fields
*/

-- Add bio field to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

-- Add avatar_url field to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;
