/*
  # Add Sensory Profiles Table

  1. New Tables
    - `sensory_profiles` - Store sensory sensitivity information for Scouts
      - `id` (uuid, primary key)
      - `scout_profile_id` (uuid, foreign key to scout_profiles)
      - `user_id` (uuid, foreign key to auth.users)
      - `visual_sensitivity` (text) - hyposensitive, typical, hypersensitive
      - `visual_triggers` (text[])
      - `visual_accommodations` (text[])
      - `auditory_sensitivity` (text)
      - `auditory_triggers` (text[])
      - `auditory_accommodations` (text[])
      - `tactile_sensitivity` (text)
      - `tactile_triggers` (text[])
      - `tactile_accommodations` (text[])
      - `vestibular_sensitivity` (text)
      - `vestibular_triggers` (text[])
      - `vestibular_accommodations` (text[])
      - `proprioceptive_sensitivity` (text)
      - `proprioceptive_triggers` (text[])
      - `proprioceptive_accommodations` (text[])
      - `gustatory_sensitivity` (text)
      - `gustatory_triggers` (text[])
      - `gustatory_accommodations` (text[])
      - `olfactory_sensitivity` (text)
      - `olfactory_triggers` (text[])
      - `olfactory_accommodations` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on sensory_profiles table
    - Users can only access their own sensory profiles
*/

CREATE TABLE IF NOT EXISTS sensory_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_profile_id uuid REFERENCES scout_profiles ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users NOT NULL,
  visual_sensitivity text DEFAULT 'typical',
  visual_triggers text[] DEFAULT '{}',
  visual_accommodations text[] DEFAULT '{}',
  auditory_sensitivity text DEFAULT 'typical',
  auditory_triggers text[] DEFAULT '{}',
  auditory_accommodations text[] DEFAULT '{}',
  tactile_sensitivity text DEFAULT 'typical',
  tactile_triggers text[] DEFAULT '{}',
  tactile_accommodations text[] DEFAULT '{}',
  vestibular_sensitivity text DEFAULT 'typical',
  vestibular_triggers text[] DEFAULT '{}',
  vestibular_accommodations text[] DEFAULT '{}',
  proprioceptive_sensitivity text DEFAULT 'typical',
  proprioceptive_triggers text[] DEFAULT '{}',
  proprioceptive_accommodations text[] DEFAULT '{}',
  gustatory_sensitivity text DEFAULT 'typical',
  gustatory_triggers text[] DEFAULT '{}',
  gustatory_accommodations text[] DEFAULT '{}',
  olfactory_sensitivity text DEFAULT 'typical',
  olfactory_triggers text[] DEFAULT '{}',
  olfactory_accommodations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sensory_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sensory profiles"
  ON sensory_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sensory profiles"
  ON sensory_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensory profiles"
  ON sensory_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensory profiles"
  ON sensory_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sensory_profiles_user_id ON sensory_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sensory_profiles_scout_profile_id ON sensory_profiles(scout_profile_id);
