/*
  # Add Background Pattern Preference

  1. Changes
    - Add `background_pattern` column to `user_preferences` table
    - Default value is 'botanical' (matching login screen style)
    - Available options: botanical, geometric, wavy, dots, blobs, confetti

  2. Security
    - Existing RLS policies cover this new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'background_pattern'
  ) THEN
    ALTER TABLE user_preferences 
    ADD COLUMN background_pattern text DEFAULT 'botanical' CHECK (
      background_pattern IN ('botanical', 'geometric', 'wavy', 'dots', 'blobs', 'confetti')
    );
  END IF;
END $$;
