/*
  # User Preferences and Achievements System

  ## New Tables
  
  ### `user_preferences`
  Stores user customization settings for their AI companion experience
  - `user_id` (uuid, foreign key to auth.users)
  - `companion_personality` (text) - Personality tone: 'supportive', 'energetic', 'calm', 'balanced'
  - `response_length` (text) - Response length preference: 'brief', 'moderate', 'detailed'
  - `conversation_style` (text) - Conversation style: 'casual', 'professional', 'friendly'
  - `use_name_frequency` (text) - How often to use user's name: 'rarely', 'sometimes', 'often'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `achievements`
  Defines available achievements users can earn
  - `id` (uuid, primary key)
  - `name` (text) - Achievement name
  - `description` (text) - What the achievement is for
  - `category` (text) - Category: 'engagement', 'wellness', 'milestone', 'special'
  - `icon` (text) - Icon name for display
  - `points` (integer) - Points awarded for this achievement
  - `requirement_type` (text) - Type of requirement: 'count', 'streak', 'specific'
  - `requirement_value` (integer) - Value needed to unlock
  - `created_at` (timestamptz)

  ### `user_achievements`
  Tracks which achievements users have earned
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `achievement_id` (uuid, foreign key to achievements)
  - `earned_at` (timestamptz)
  - `progress` (integer) - Current progress toward achievement

  ### `user_stats`
  Tracks user statistics for achievement progress
  - `user_id` (uuid, primary key, foreign key to auth.users)
  - `total_conversations` (integer) - Total chat sessions
  - `total_messages` (integer) - Total messages sent
  - `current_streak` (integer) - Current daily streak
  - `longest_streak` (integer) - Longest daily streak achieved
  - `breathing_exercises_completed` (integer)
  - `journal_entries_created` (integer)
  - `mood_logs_created` (integer)
  - `total_points` (integer) - Total achievement points earned
  - `last_active_date` (date) - Last date user was active
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all new tables
  - Users can only read and update their own preferences
  - Users can only read their own achievements and stats
  - Achievements table is read-only for all users

  ## Indexes
  - Index on user_achievements(user_id) for fast lookup
  - Index on user_achievements(achievement_id) for stats
  - Index on user_stats(last_active_date) for streak calculations
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_personality text DEFAULT 'balanced' CHECK (companion_personality IN ('supportive', 'energetic', 'calm', 'balanced')),
  response_length text DEFAULT 'moderate' CHECK (response_length IN ('brief', 'moderate', 'detailed')),
  conversation_style text DEFAULT 'friendly' CHECK (conversation_style IN ('casual', 'professional', 'friendly')),
  use_name_frequency text DEFAULT 'sometimes' CHECK (use_name_frequency IN ('rarely', 'sometimes', 'often')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('engagement', 'wellness', 'milestone', 'special')),
  icon text NOT NULL,
  points integer DEFAULT 10,
  requirement_type text NOT NULL CHECK (requirement_type IN ('count', 'streak', 'specific')),
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_conversations integer DEFAULT 0,
  total_messages integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  breathing_exercises_completed integer DEFAULT 0,
  journal_entries_created integer DEFAULT 0,
  mood_logs_created integer DEFAULT 0,
  total_points integer DEFAULT 0,
  last_active_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_active ON user_stats(last_active_date);

-- Insert initial achievements
INSERT INTO achievements (name, description, category, icon, points, requirement_type, requirement_value) VALUES
  ('First Steps', 'Start your first conversation with Buddy', 'engagement', 'message-circle', 10, 'count', 1),
  ('Getting to Know You', 'Have 5 conversations with Buddy', 'engagement', 'users', 25, 'count', 5),
  ('Trusted Friend', 'Have 25 conversations with Buddy', 'engagement', 'heart', 50, 'count', 25),
  ('Devoted Companion', 'Have 100 conversations with Buddy', 'engagement', 'award', 100, 'count', 100),
  
  ('Breathing Beginner', 'Complete your first breathing exercise', 'wellness', 'wind', 15, 'count', 1),
  ('Calm Master', 'Complete 20 breathing exercises', 'wellness', 'circle-check', 50, 'count', 20),
  
  ('Journal Journey', 'Write your first journal entry', 'wellness', 'book-open', 15, 'count', 1),
  ('Reflective Writer', 'Write 10 journal entries', 'wellness', 'pen-tool', 50, 'count', 10),
  
  ('Mood Tracker', 'Log your first mood', 'wellness', 'smile', 10, 'count', 1),
  ('Emotional Awareness', 'Log moods for 7 days in a row', 'wellness', 'trending-up', 50, 'streak', 7),
  
  ('Week Warrior', 'Use the app for 7 days in a row', 'milestone', 'calendar', 75, 'streak', 7),
  ('Month Master', 'Use the app for 30 days in a row', 'milestone', 'trophy', 200, 'streak', 30),
  
  ('Night Owl', 'Have a conversation after midnight', 'special', 'moon', 25, 'specific', 1),
  ('Early Bird', 'Have a conversation before 6 AM', 'special', 'sunrise', 25, 'specific', 1),
  ('Wellness Champion', 'Earn 500 total points', 'special', 'star', 100, 'count', 500)
ON CONFLICT DO NOTHING;