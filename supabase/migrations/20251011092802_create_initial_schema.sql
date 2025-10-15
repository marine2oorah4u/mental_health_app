/*
  # Initial Mental Wellness App Database Schema

  1. New Tables
    - `profiles`
      - User profile information including preferences, points, and customization
      - Links to auth.users
    - `mood_logs`
      - Daily mood tracking with emotions and notes
    - `journal_entries`
      - Private journal entries
    - `accomplishment_posts`
      - Community accomplishment sharing with moderation
    - `post_reactions`
      - Emoji reactions to accomplishment posts
    - `achievements`
      - User achievement tracking
    - `meditation_sessions`
      - Meditation practice tracking
    - `breathing_sessions`
      - Breathing exercise tracking
    - `audio_favorites`
      - User's favorite audio tracks
    - `custom_coping_cards`
      - Personalized coping strategies
    - `moderation_queue`
      - Content moderation tracking
    - `educational_content`
      - Mental health education articles
    - `crisis_resources`
      - Regional crisis hotlines and resources
    - `spiritual_content`
      - Multi-faith spiritual content
    - `companion_items`
      - Shop items for companion customization

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
    - Public read access for educational content and resources
    - Moderation access for admin users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  points integer DEFAULT 0,
  companion_type text DEFAULT 'friendly_bear',
  companion_name text DEFAULT 'Buddy',
  companion_color text DEFAULT '#8B4513',
  companion_environment text DEFAULT 'peaceful_garden',
  theme_preference text DEFAULT 'calming_ocean',
  font_size text DEFAULT 'medium',
  language text DEFAULT 'en',
  spiritual_enabled boolean DEFAULT false,
  spiritual_tradition text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create mood_logs table
CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood logs"
  ON mood_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs"
  ON mood_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs"
  ON mood_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood logs"
  ON mood_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text,
  content text NOT NULL,
  entry_type text DEFAULT 'free_write',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries"
  ON journal_entries FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create accomplishment_posts table
CREATE TABLE IF NOT EXISTS accomplishment_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  username text,
  content text NOT NULL CHECK (char_length(content) <= 280),
  category text NOT NULL,
  photo_url text,
  moderation_status text DEFAULT 'pending',
  flagged_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accomplishment_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved posts"
  ON accomplishment_posts FOR SELECT
  TO authenticated
  USING (moderation_status = 'approved');

CREATE POLICY "Users can insert own posts"
  ON accomplishment_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON accomplishment_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON accomplishment_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES accomplishment_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions"
  ON post_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create meditation_sessions table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meditation_type text NOT NULL,
  duration integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meditation sessions"
  ON meditation_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create breathing_sessions table
CREATE TABLE IF NOT EXISTS breathing_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  breathing_pattern text NOT NULL,
  duration integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own breathing sessions"
  ON breathing_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create audio_favorites table
CREATE TABLE IF NOT EXISTS audio_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  audio_id text NOT NULL,
  audio_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, audio_id)
);

ALTER TABLE audio_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own audio favorites"
  ON audio_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create custom_coping_cards table
CREATE TABLE IF NOT EXISTS custom_coping_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_coping_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own coping cards"
  ON custom_coping_cards FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create moderation_queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES accomplishment_posts(id) ON DELETE CASCADE NOT NULL,
  reported_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can report posts"
  ON moderation_queue FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

-- Create educational_content table (public read)
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  difficulty_level text DEFAULT 'beginner',
  language text DEFAULT 'en',
  trigger_warning boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view educational content"
  ON educational_content FOR SELECT
  TO authenticated
  USING (true);

-- Create crisis_resources table (public read)
CREATE TABLE IF NOT EXISTS crisis_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  country_code text NOT NULL,
  resource_type text NOT NULL,
  name text NOT NULL,
  contact_info text NOT NULL,
  description text,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crisis_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crisis resources"
  ON crisis_resources FOR SELECT
  TO authenticated
  USING (true);

-- Create spiritual_content table (public read)
CREATE TABLE IF NOT EXISTS spiritual_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition text NOT NULL,
  content_type text NOT NULL,
  title text,
  content text NOT NULL,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE spiritual_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view spiritual content"
  ON spiritual_content FOR SELECT
  TO authenticated
  USING (true);

-- Create companion_items table (public read)
CREATE TABLE IF NOT EXISTS companion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL,
  name text NOT NULL,
  description text,
  cost integer NOT NULL,
  unlock_requirement text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companion_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companion items"
  ON companion_items FOR SELECT
  TO authenticated
  USING (true);

-- Create user_owned_items table
CREATE TABLE IF NOT EXISTS user_owned_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES companion_items(id) ON DELETE CASCADE NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE user_owned_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items"
  ON user_owned_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase items"
  ON user_owned_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS mood_logs_user_id_idx ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS mood_logs_created_at_idx ON mood_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS accomplishment_posts_created_at_idx ON accomplishment_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS accomplishment_posts_moderation_status_idx ON accomplishment_posts(moderation_status);
CREATE INDEX IF NOT EXISTS achievements_user_id_idx ON achievements(user_id);
CREATE INDEX IF NOT EXISTS crisis_resources_country_code_idx ON crisis_resources(country_code);
CREATE INDEX IF NOT EXISTS spiritual_content_tradition_idx ON spiritual_content(tradition);
