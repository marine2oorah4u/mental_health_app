/*
  # Create Core Tables for Scout Inclusion Platform

  1. New Tables
    - scout_profiles: Scout information with disability types and needs
    - activities: Games and activities with accommodation information
    - tips: Context-aware guidance for leaders
    - calm_plans: Personalized calm-down plans
    - visual_schedules: Schedule templates for events
    - schedule_items: Individual schedule entries

  2. Security
    - Enable RLS on all tables
    - Policies for user data access and public content
*/

-- Scout Profiles Table
CREATE TABLE IF NOT EXISTS scout_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  disability_types text[] DEFAULT '{}',
  communication_level text,
  support_level text,
  strengths text[] DEFAULT '{}',
  challenges text[] DEFAULT '{}',
  special_interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scout_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scout profiles"
  ON scout_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scout profiles"
  ON scout_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scout profiles"
  ON scout_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scout profiles"
  ON scout_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  duration text,
  group_size text,
  materials text[] DEFAULT '{}',
  instructions text[] DEFAULT '{}',
  adaptations text[] DEFAULT '{}',
  disability_support text[] DEFAULT '{}',
  hero_image_url text,
  created_by uuid REFERENCES auth.users,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public activities are viewable by everyone"
  ON activities FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Tips Table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  context text,
  disability_types text[] DEFAULT '{}',
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tips are viewable by authenticated users"
  ON tips FOR SELECT
  TO authenticated
  USING (true);

-- Calm Plans Table
CREATE TABLE IF NOT EXISTS calm_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_profile_id uuid REFERENCES scout_profiles,
  user_id uuid REFERENCES auth.users NOT NULL,
  triggers text[] DEFAULT '{}',
  calm_strategies text[] DEFAULT '{}',
  communication_preferences text[] DEFAULT '{}',
  sensory_needs text[] DEFAULT '{}',
  buddy_preferences text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE calm_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calm plans"
  ON calm_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calm plans"
  ON calm_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calm plans"
  ON calm_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calm plans"
  ON calm_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Visual Schedules Table
CREATE TABLE IF NOT EXISTS visual_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_profile_id uuid REFERENCES scout_profiles,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  type text DEFAULT 'meeting',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visual_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own visual schedules"
  ON visual_schedules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own visual schedules"
  ON visual_schedules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visual schedules"
  ON visual_schedules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own visual schedules"
  ON visual_schedules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Schedule Items Table
CREATE TABLE IF NOT EXISTS schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES visual_schedules ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  time_slot text,
  duration integer DEFAULT 0,
  icon text,
  image_url text,
  order_position integer NOT NULL,
  completed boolean DEFAULT false
);

ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view schedule items for own schedules"
  ON schedule_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visual_schedules
      WHERE visual_schedules.id = schedule_items.schedule_id
      AND visual_schedules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create schedule items for own schedules"
  ON schedule_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM visual_schedules
      WHERE visual_schedules.id = schedule_items.schedule_id
      AND visual_schedules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update schedule items for own schedules"
  ON schedule_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visual_schedules
      WHERE visual_schedules.id = schedule_items.schedule_id
      AND visual_schedules.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM visual_schedules
      WHERE visual_schedules.id = schedule_items.schedule_id
      AND visual_schedules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete schedule items for own schedules"
  ON schedule_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM visual_schedules
      WHERE visual_schedules.id = schedule_items.schedule_id
      AND visual_schedules.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scout_profiles_user_id ON scout_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by);
CREATE INDEX IF NOT EXISTS idx_tips_category ON tips(category);
CREATE INDEX IF NOT EXISTS idx_calm_plans_user_id ON calm_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_calm_plans_scout_profile_id ON calm_plans(scout_profile_id);
CREATE INDEX IF NOT EXISTS idx_visual_schedules_user_id ON visual_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_items_schedule_id ON schedule_items(schedule_id);