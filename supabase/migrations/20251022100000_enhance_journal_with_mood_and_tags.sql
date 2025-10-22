/*
  # Enhance Journal with Mood and Tags

  ## Changes
  - Adds `mood_rating` column to journal_entries (1-5 scale)
  - Adds `tags` text array column for categorization
  - Adds `prompt_used` text column to track which prompt was used

  ## Purpose
  Allows users to:
  - Tag journal entries with mood ratings
  - Categorize entries with tags (e.g., work, family, anxiety, joy)
  - Track which prompts inspired their writing
*/

-- Add new columns to journal_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'mood_rating'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 5);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'tags'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN tags text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'prompt_used'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN prompt_used text;
  END IF;
END $$;

-- Create index for faster tag searches
CREATE INDEX IF NOT EXISTS idx_journal_entries_tags ON journal_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON journal_entries(user_id, mood_rating);
