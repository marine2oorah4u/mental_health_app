/*
  # Add Interactive Tools Data Tables

  1. New Tables
    - `tool_usage_logs`: Track when scouts use which tools
    - `feelings_checkins`: Save feelings check-in history
    - `zone_checkins`: Save zones of regulation check-ins
    - `reward_goals`: Custom reward goals for token system
    - `sensory_preferences`: Individual sensory preference tracking
    - `first_then_boards`: Saved first-then board combinations
    - `visual_schedules_enhanced`: Enhanced visual schedules
    - `schedule_activities`: Activities within schedules
    - `social_stories`: Custom social stories
    - `task_checklists`: Task completion tracking

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Scout profiles can be shared with designated leaders
*/

-- Tool Usage Logs
CREATE TABLE IF NOT EXISTS tool_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  tool_name text NOT NULL,
  duration_seconds int,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tool_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tool logs"
  ON tool_usage_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tool logs"
  ON tool_usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Feelings Check-ins
CREATE TABLE IF NOT EXISTS feelings_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  feeling text NOT NULL,
  intensity int CHECK (intensity >= 1 AND intensity <= 5),
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feelings_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feelings"
  ON feelings_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own feelings"
  ON feelings_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own feelings"
  ON feelings_checkins FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Zone Check-ins (Zones of Regulation)
CREATE TABLE IF NOT EXISTS zone_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  zone text NOT NULL CHECK (zone IN ('blue', 'green', 'yellow', 'red')),
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE zone_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own zones"
  ON zone_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own zones"
  ON zone_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own zones"
  ON zone_checkins FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reward Goals (Token System)
CREATE TABLE IF NOT EXISTS reward_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  name text NOT NULL,
  emoji text DEFAULT '⭐',
  tokens_needed int NOT NULL DEFAULT 5,
  tokens_earned int NOT NULL DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reward_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON reward_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON reward_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON reward_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON reward_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sensory Preferences
CREATE TABLE IF NOT EXISTS sensory_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  category text NOT NULL CHECK (category IN ('sounds', 'touch', 'visual', 'movement', 'smell')),
  item_name text NOT NULL,
  preference text NOT NULL CHECK (preference IN ('love', 'okay', 'avoid', 'unknown')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scout_profile_id, category, item_name)
);

ALTER TABLE sensory_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sensory prefs"
  ON sensory_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sensory prefs"
  ON sensory_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensory prefs"
  ON sensory_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensory prefs"
  ON sensory_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- First-Then Boards
CREATE TABLE IF NOT EXISTS first_then_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  first_activity jsonb NOT NULL,
  then_activity jsonb NOT NULL,
  saved boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE first_then_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own boards"
  ON first_then_boards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boards"
  ON first_then_boards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards"
  ON first_then_boards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Visual Schedules Enhanced
CREATE TABLE IF NOT EXISTS visual_schedules_enhanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  title text NOT NULL,
  description text,
  schedule_date date,
  is_template boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visual_schedules_enhanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schedules"
  ON visual_schedules_enhanced FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own schedules"
  ON visual_schedules_enhanced FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON visual_schedules_enhanced FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON visual_schedules_enhanced FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Schedule Activities
CREATE TABLE IF NOT EXISTS schedule_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES visual_schedules_enhanced ON DELETE CASCADE NOT NULL,
  activity_name text NOT NULL,
  activity_emoji text DEFAULT '📍',
  start_time time,
  duration_minutes int,
  notes text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedule_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities in own schedules"
  ON schedule_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visual_schedules_enhanced
      WHERE visual_schedules_enhanced.id = schedule_activities.schedule_id
      AND visual_schedules_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activities in own schedules"
  ON schedule_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM visual_schedules_enhanced
      WHERE visual_schedules_enhanced.id = schedule_activities.schedule_id
      AND visual_schedules_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update activities in own schedules"
  ON schedule_activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visual_schedules_enhanced
      WHERE visual_schedules_enhanced.id = schedule_activities.schedule_id
      AND visual_schedules_enhanced.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM visual_schedules_enhanced
      WHERE visual_schedules_enhanced.id = schedule_activities.schedule_id
      AND visual_schedules_enhanced.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete activities in own schedules"
  ON schedule_activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visual_schedules_enhanced
      WHERE visual_schedules_enhanced.id = schedule_activities.schedule_id
      AND visual_schedules_enhanced.user_id = auth.uid()
    )
  );

-- Social Stories
CREATE TABLE IF NOT EXISTS social_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  title text NOT NULL,
  situation text NOT NULL,
  pages jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stories"
  ON social_stories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own stories"
  ON social_stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON social_stories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON social_stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Task Checklists
CREATE TABLE IF NOT EXISTS task_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scout_profile_id uuid REFERENCES scout_profiles,
  title text NOT NULL,
  tasks jsonb DEFAULT '[]',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE task_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checklists"
  ON task_checklists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own checklists"
  ON task_checklists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklists"
  ON task_checklists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklists"
  ON task_checklists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tool_usage_logs_user ON tool_usage_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feelings_checkins_user ON feelings_checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_zone_checkins_user ON zone_checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reward_goals_user ON reward_goals(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_sensory_preferences_user ON sensory_preferences(user_id, scout_profile_id);
CREATE INDEX IF NOT EXISTS idx_schedule_activities_schedule ON schedule_activities(schedule_id, sort_order);