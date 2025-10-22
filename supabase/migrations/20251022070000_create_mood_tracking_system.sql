/*
  # Create Mood Tracking System

  ## New Tables

  ### `daily_check_ins`
  Stores daily mood check-ins with ratings, gratitude, and notes
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `check_in_date` (date) - The date of check-in
  - `mood_rating` (integer) - Mood from 1-5 (1=struggling, 5=amazing)
  - `energy_level` (integer) - Energy from 1-5
  - `anxiety_level` (integer) - Anxiety from 1-5
  - `gratitude_text` (text) - What they're grateful for
  - `note` (text) - Additional notes
  - `activities` (text[]) - Activities done that day
  - `sleep_quality` (integer) - Sleep rating 1-5
  - `created_at` (timestamptz)

  ### `mood_entries`
  Quick mood logs throughout the day (multiple per day allowed)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `mood_rating` (integer) - Mood from 1-5
  - `note` (text) - Quick note
  - `triggers` (text[]) - What triggered this mood
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only read/write their own check-ins and mood entries

  ## Indexes
  - Index on daily_check_ins(user_id, check_in_date) for fast lookups
  - Index on mood_entries(user_id, created_at) for timeline queries
*/

-- Create daily_check_ins table
CREATE TABLE IF NOT EXISTS daily_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_date date NOT NULL,
  mood_rating integer NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5),
  anxiety_level integer CHECK (anxiety_level >= 1 AND anxiety_level <= 5),
  gratitude_text text,
  note text,
  activities text[],
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_rating integer NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
  note text,
  triggers text[],
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Policies for daily_check_ins
CREATE POLICY "Users can view own check-ins"
  ON daily_check_ins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON daily_check_ins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON daily_check_ins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins"
  ON daily_check_ins FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for mood_entries
CREATE POLICY "Users can view own mood entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON mood_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
  ON mood_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_check_ins_user_date ON daily_check_ins(user_id, check_in_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_time ON mood_entries(user_id, created_at DESC);
