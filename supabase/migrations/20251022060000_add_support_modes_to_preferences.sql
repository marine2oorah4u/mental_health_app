/*
  # Add Support Modes to User Preferences

  ## Changes
  - Adds `religious_spiritual_support` boolean column to user_preferences
  - Adds `veteran_support` boolean column to user_preferences
  - Adds `lgbtq_support` boolean column to user_preferences
  - Sets default values to false for all new columns

  ## Purpose
  Allows users to opt-in to specialized support modes:
  - Religious/Spiritual Support: Companion can reference faith, prayer, spirituality
  - Veteran Support: Companion understands military culture and PTSD
  - LGBTQ+ Support: Companion is affirming and understands LGBTQ+ issues

  ## Security
  - No RLS changes needed (inherits from existing user_preferences policies)
*/

-- Add support mode columns to user_preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'religious_spiritual_support'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN religious_spiritual_support boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'veteran_support'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN veteran_support boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'lgbtq_support'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN lgbtq_support boolean DEFAULT false;
  END IF;
END $$;
