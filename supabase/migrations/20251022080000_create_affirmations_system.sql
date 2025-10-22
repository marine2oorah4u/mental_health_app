/*
  # Create Affirmations System

  ## New Tables

  ### `affirmations`
  Library of positive affirmations
  - `id` (uuid, primary key)
  - `text` (text) - The affirmation text
  - `category` (text) - Category: 'self_love', 'strength', 'peace', 'gratitude', 'motivation'
  - `is_active` (boolean) - Whether it's currently used
  - `created_at` (timestamptz)

  ### `user_affirmations`
  Tracks which affirmations users have seen/favorited
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `affirmation_id` (uuid, foreign key to affirmations)
  - `is_favorite` (boolean) - User marked as favorite
  - `last_seen_at` (timestamptz) - When they last saw it
  - `seen_count` (integer) - How many times they've seen it

  ## Security
  - Enable RLS on user_affirmations (not on affirmations - read-only for all)
  - Users can only read/write their own affirmation preferences

  ## Initial Data
  - Seed with 50+ positive affirmations
*/

-- Create affirmations table
CREATE TABLE IF NOT EXISTS affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  category text NOT NULL CHECK (category IN ('self_love', 'strength', 'peace', 'gratitude', 'motivation', 'healing')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_affirmations table
CREATE TABLE IF NOT EXISTS user_affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affirmation_id uuid NOT NULL REFERENCES affirmations(id) ON DELETE CASCADE,
  is_favorite boolean DEFAULT false,
  last_seen_at timestamptz DEFAULT now(),
  seen_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, affirmation_id)
);

-- Enable RLS
ALTER TABLE user_affirmations ENABLE ROW LEVEL SECURITY;

-- Policies for user_affirmations
CREATE POLICY "Users can view own affirmation preferences"
  ON user_affirmations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affirmation preferences"
  ON user_affirmations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affirmation preferences"
  ON user_affirmations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_affirmations_user ON user_affirmations(user_id);
CREATE INDEX IF NOT EXISTS idx_affirmations_category ON affirmations(category, is_active);

-- Seed affirmations
INSERT INTO affirmations (text, category) VALUES
  -- Self Love
  ('I am worthy of love and belonging exactly as I am', 'self_love'),
  ('I choose to see the beauty within myself today', 'self_love'),
  ('My feelings are valid and I honor them', 'self_love'),
  ('I am enough, just as I am in this moment', 'self_love'),
  ('I treat myself with the same kindness I offer others', 'self_love'),
  ('I am deserving of rest and gentleness', 'self_love'),
  ('My worth is not determined by my productivity', 'self_love'),
  ('I celebrate my progress, no matter how small', 'self_love'),

  -- Strength
  ('I have survived every challenge that came before this one', 'strength'),
  ('My resilience grows stronger with each passing day', 'strength'),
  ('I trust in my ability to navigate difficult emotions', 'strength'),
  ('Every small step forward is an act of courage', 'strength'),
  ('I am stronger than my struggles', 'strength'),
  ('I have the power to create positive change in my life', 'strength'),
  ('My challenges do not define me', 'strength'),
  ('I am capable of handling whatever comes my way', 'strength'),

  -- Peace
  ('I release what I cannot control and find peace', 'peace'),
  ('I choose calm over chaos in this moment', 'peace'),
  ('Peace begins with a single breath', 'peace'),
  ('I deserve moments of stillness and quiet', 'peace'),
  ('I let go of worries that do not serve me', 'peace'),
  ('My mind can find rest even in uncertainty', 'peace'),
  ('I create space for peace in my daily life', 'peace'),
  ('Tranquility is always available to me', 'peace'),

  -- Gratitude
  ('I am grateful for this moment of presence', 'gratitude'),
  ('Small joys make life worth living', 'gratitude'),
  ('I appreciate the people who support me', 'gratitude'),
  ('Today, I notice the good around me', 'gratitude'),
  ('I am thankful for my journey, including the hard parts', 'gratitude'),
  ('Gratitude opens my heart to more goodness', 'gratitude'),
  ('I find beauty in ordinary moments', 'gratitude'),
  ('My life is full of things worth celebrating', 'gratitude'),

  -- Motivation
  ('Today is full of possibility', 'motivation'),
  ('I take things one step at a time', 'motivation'),
  ('Progress, not perfection, is my goal', 'motivation'),
  ('I show up for myself, even on hard days', 'motivation'),
  ('My effort matters, regardless of the outcome', 'motivation'),
  ('I am moving forward at my own pace', 'motivation'),
  ('Each new day is a chance to begin again', 'motivation'),
  ('I believe in my ability to grow and change', 'motivation'),

  -- Healing
  ('Healing is not linear, and that is okay', 'healing'),
  ('I give myself permission to heal at my own pace', 'healing'),
  ('My scars are proof of my strength', 'healing'),
  ('I am gentle with myself as I grow', 'healing'),
  ('Time and patience are part of my healing journey', 'healing'),
  ('I trust the process of becoming whole', 'healing'),
  ('My past does not dictate my future', 'healing'),
  ('I am allowed to outgrow versions of myself', 'healing'),
  ('Every day, I am healing in ways I cannot see', 'healing'),
  ('I honor both my pain and my resilience', 'healing')
ON CONFLICT DO NOTHING;
