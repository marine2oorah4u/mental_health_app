/*
  # Create Medication Reminders System

  ## New Tables

  ### `medications`
  Stores user medications
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `name` (text) - Medication name
  - `dosage` (text) - Dosage amount (e.g., "10mg", "2 pills")
  - `frequency` (text) - How often: 'daily', 'twice_daily', 'three_times_daily', 'as_needed', 'custom'
  - `times` (text[]) - Array of times to take (e.g., ['08:00', '20:00'])
  - `notes` (text) - Additional notes
  - `color` (text) - Color for visual identification
  - `is_active` (boolean) - Currently taking this medication
  - `start_date` (date) - When they started taking it
  - `end_date` (date) - When to stop (optional)
  - `created_at` (timestamptz)

  ### `medication_logs`
  Tracks when medications are taken
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `medication_id` (uuid, foreign key to medications)
  - `scheduled_time` (timestamptz) - When it was supposed to be taken
  - `taken_at` (timestamptz) - When it was actually taken (null if skipped)
  - `status` (text) - 'taken', 'skipped', 'missed'
  - `note` (text) - Optional note about this dose
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only read/write their own medications and logs

  ## Indexes
  - Index on medications(user_id, is_active)
  - Index on medication_logs(user_id, scheduled_time)
*/

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'twice_daily', 'three_times_daily', 'as_needed', 'custom')),
  times text[] NOT NULL,
  notes text,
  color text DEFAULT '#8B5CF6',
  is_active boolean DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Create medication_logs table
CREATE TABLE IF NOT EXISTS medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  taken_at timestamptz,
  status text NOT NULL CHECK (status IN ('taken', 'skipped', 'missed')) DEFAULT 'taken',
  note text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;

-- Policies for medications
CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for medication_logs
CREATE POLICY "Users can view own medication logs"
  ON medication_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medication logs"
  ON medication_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medication logs"
  ON medication_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medication logs"
  ON medication_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_medications_user_active ON medications(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_medication_logs_user_time ON medication_logs(user_id, scheduled_time DESC);
CREATE INDEX IF NOT EXISTS idx_medication_logs_medication ON medication_logs(medication_id, scheduled_time DESC);
