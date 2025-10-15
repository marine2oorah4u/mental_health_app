/*
  # User Goals System

  ## Overview
  Allows users to set custom goals with Buddy through natural conversation.
  Goals can be wellness-related, personal milestones, or any self-improvement targets.

  ## New Tables

  ### `user_goals`
  Stores user-defined goals that Buddy helps track and support
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `title` (text) - Short goal description
  - `description` (text) - Detailed explanation
  - `category` (text) - Type: 'wellness', 'habit', 'milestone', 'personal', 'other'
  - `target_date` (date, nullable) - Optional deadline
  - `status` (text) - Status: 'active', 'completed', 'paused', 'abandoned'
  - `progress_notes` (jsonb) - Array of progress updates with timestamps
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - `completed_at` (timestamptz, nullable)

  ### `goal_check_ins`
  Tracks progress check-ins and updates from conversations
  - `id` (uuid, primary key)
  - `goal_id` (uuid, foreign key to user_goals)
  - `user_id` (uuid, foreign key to auth.users)
  - `note` (text) - Progress update or reflection
  - `sentiment` (text) - How user feels: 'positive', 'neutral', 'struggling', 'neutral'
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own goals and check-ins
  - No public access

  ## Indexes
  - Index on user_goals(user_id, status) for active goals query
  - Index on goal_check_ins(goal_id) for progress history
*/

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'personal' CHECK (category IN ('wellness', 'habit', 'milestone', 'personal', 'other')),
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress_notes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create goal_check_ins table
CREATE TABLE IF NOT EXISTS goal_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note text NOT NULL,
  sentiment text DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'struggling')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE goal_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check-ins"
  ON goal_check_ins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON goal_check_ins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON goal_check_ins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins"
  ON goal_check_ins FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_goals_user_status ON user_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goal_check_ins_goal_id ON goal_check_ins(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_check_ins_user_id ON goal_check_ins(user_id);

-- Add new achievement for goal setting
INSERT INTO achievements (name, description, category, icon, points, requirement_type, requirement_value)
VALUES 
  ('Goal Setter', 'Set your first goal with Buddy', 'special', 'star', 20, 'count', 1),
  ('Dream Chaser', 'Set 5 goals', 'special', 'star', 50, 'count', 5),
  ('Goal Crusher', 'Complete your first goal', 'milestone', 'trophy', 75, 'count', 1),
  ('Unstoppable', 'Complete 5 goals', 'milestone', 'trophy', 150, 'count', 5)
ON CONFLICT DO NOTHING;