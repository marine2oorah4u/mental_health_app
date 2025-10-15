/*
  # Add Emergency Protocols and User Settings Tables

  1. New Tables
    - `emergency_protocols` - Custom emergency response plans
      - `id` (uuid, primary key)
      - `scout_profile_id` (uuid, foreign key to scout_profiles)
      - `user_id` (uuid, foreign key to auth.users)
      - `protocol_type` (text) - Type of emergency (meltdown, medical, safety)
      - `steps` (text[]) - Sequential response steps
      - `warning_signs` (text[]) - When to activate this protocol
      - `contact_list` (jsonb) - Emergency contacts with roles
      - `medications` (jsonb) - Medication information
      - `safe_spaces` (text[]) - Designated calm areas
      - `do_not_do` (text[]) - Actions to avoid
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_settings` - User preferences and accessibility settings
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, unique)
      - `theme` (text) - campfire, forest, twilight, classic
      - `color_mode` (text) - light, dark, system
      - `font_size` (text) - small, medium, large, xlarge
      - `high_contrast` (boolean)
      - `dyslexia_font` (boolean)
      - `reduced_motion` (boolean)
      - `language` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `meeting_plans` - Saved meeting plans for leaders
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `meeting_date` (date)
      - `duration` (integer) - minutes
      - `expected_attendance` (integer)
      - `agenda_items` (jsonb) - Array of {time, activity, duration}
      - `accommodation_notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `campout_plans` - Saved campout plans for leaders
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `location` (text)
      - `checklist_data` (jsonb) - Checkbox states
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

-- Emergency Protocols Table
CREATE TABLE IF NOT EXISTS emergency_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_profile_id uuid REFERENCES scout_profiles ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users NOT NULL,
  protocol_type text DEFAULT 'meltdown',
  steps text[] DEFAULT '{}',
  warning_signs text[] DEFAULT '{}',
  contact_list jsonb DEFAULT '[]'::jsonb,
  medications jsonb DEFAULT '[]'::jsonb,
  safe_spaces text[] DEFAULT '{}',
  do_not_do text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emergency protocols"
  ON emergency_protocols FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own emergency protocols"
  ON emergency_protocols FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency protocols"
  ON emergency_protocols FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency protocols"
  ON emergency_protocols FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_emergency_protocols_user_id ON emergency_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_protocols_scout_profile_id ON emergency_protocols(scout_profile_id);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  theme text DEFAULT 'campfire',
  color_mode text DEFAULT 'system',
  font_size text DEFAULT 'medium',
  high_contrast boolean DEFAULT false,
  dyslexia_font boolean DEFAULT false,
  reduced_motion boolean DEFAULT false,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Meeting Plans Table
CREATE TABLE IF NOT EXISTS meeting_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  meeting_date date,
  duration integer DEFAULT 90,
  expected_attendance integer,
  agenda_items jsonb DEFAULT '[]'::jsonb,
  accommodation_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meeting_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meeting plans"
  ON meeting_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meeting plans"
  ON meeting_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meeting plans"
  ON meeting_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meeting plans"
  ON meeting_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meeting_plans_user_id ON meeting_plans(user_id);

-- Campout Plans Table
CREATE TABLE IF NOT EXISTS campout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  start_date date,
  end_date date,
  location text DEFAULT '',
  checklist_data jsonb DEFAULT '{}'::jsonb,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campout plans"
  ON campout_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campout plans"
  ON campout_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campout plans"
  ON campout_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campout plans"
  ON campout_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_campout_plans_user_id ON campout_plans(user_id);