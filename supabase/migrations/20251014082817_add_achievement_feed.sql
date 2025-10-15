/*
  # Achievement Feed System

  ## Overview
  Adds optional public achievement sharing so users can celebrate wins together.
  Users opt-in to share their achievements with the community.

  ## New Tables

  ### `user_settings`
  User privacy and sharing preferences
  - `user_id` (uuid, primary key, foreign key to auth.users)
  - `share_achievements` (boolean) - Whether to share achievements publicly
  - `display_name` (text) - Public display name (defaults to "Anonymous")
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `achievement_feed`
  Public feed of achievements (only for users who opted in)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `achievement_id` (uuid, foreign key to achievements)
  - `display_name` (text) - Cached display name
  - `earned_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only update their own settings
  - Achievement feed is publicly readable (opt-in only)
  - No personal information exposed

  ## Privacy
  - All sharing is opt-in (default: private)
  - Users choose their display name
  - No email or personal data in feed
  - Users can opt-out anytime
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  share_achievements boolean DEFAULT false,
  display_name text DEFAULT 'Anonymous',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create achievement_feed table
CREATE TABLE IF NOT EXISTS achievement_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Anonymous',
  earned_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievement_feed ENABLE ROW LEVEL SECURITY;

-- Anyone can view the public feed
CREATE POLICY "Anyone can view achievement feed"
  ON achievement_feed FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own achievements (enforced by trigger)
CREATE POLICY "Users can insert own feed items"
  ON achievement_feed FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for feed performance
CREATE INDEX IF NOT EXISTS idx_achievement_feed_created_at ON achievement_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievement_feed_user_id ON achievement_feed(user_id);

-- Create trigger function to automatically add to feed when opted in
CREATE OR REPLACE FUNCTION add_to_achievement_feed()
RETURNS TRIGGER AS $$
DECLARE
  user_sharing boolean;
  user_display_name text;
BEGIN
  -- Check if user has opted in to sharing
  SELECT share_achievements, display_name
  INTO user_sharing, user_display_name
  FROM user_settings
  WHERE user_id = NEW.user_id;

  -- If user is sharing, add to public feed
  IF user_sharing = true THEN
    INSERT INTO achievement_feed (user_id, achievement_id, display_name, earned_at)
    VALUES (NEW.user_id, NEW.achievement_id, COALESCE(user_display_name, 'Anonymous'), NEW.earned_at);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on user_achievements
DROP TRIGGER IF EXISTS trigger_add_to_achievement_feed ON user_achievements;
CREATE TRIGGER trigger_add_to_achievement_feed
  AFTER INSERT ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION add_to_achievement_feed();