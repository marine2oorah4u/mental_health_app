/*
  # Add Meltdown Logs Table

  1. New Tables
    - `meltdown_logs` - Track meltdown incidents for pattern analysis
      - `id` (uuid, primary key)
      - `scout_profile_id` (uuid, foreign key to scout_profiles)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date) - Date of incident
      - `time` (text) - Time of incident
      - `duration` (integer) - Duration in minutes
      - `intensity` (integer) - Scale 1-5
      - `location` (text) - Where it occurred
      - `triggers` (text[]) - Contributing factors
      - `warning_signs` (text[]) - Observable behaviors before escalation
      - `interventions_used` (text[]) - Strategies attempted
      - `effectiveness` (integer) - How helpful interventions were (1-5)
      - `recovery_time` (integer) - Minutes to fully calm down
      - `notes` (text) - Additional details
      - `follow_up_needed` (boolean) - Requires professional consultation
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on meltdown_logs table
    - Users can only access their own logs
*/

CREATE TABLE IF NOT EXISTS meltdown_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_profile_id uuid REFERENCES scout_profiles ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  duration integer DEFAULT 0,
  intensity integer DEFAULT 3,
  location text DEFAULT '',
  triggers text[] DEFAULT '{}',
  warning_signs text[] DEFAULT '{}',
  interventions_used text[] DEFAULT '{}',
  effectiveness integer DEFAULT 3,
  recovery_time integer DEFAULT 0,
  notes text DEFAULT '',
  follow_up_needed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meltdown_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meltdown logs"
  ON meltdown_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meltdown logs"
  ON meltdown_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meltdown logs"
  ON meltdown_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meltdown logs"
  ON meltdown_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meltdown_logs_user_id ON meltdown_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_meltdown_logs_scout_profile_id ON meltdown_logs(scout_profile_id);
CREATE INDEX IF NOT EXISTS idx_meltdown_logs_date ON meltdown_logs(date DESC);