/*
  # Create Community Feed Tables

  1. New Tables
    - `accomplishment_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `username` (text)
      - `content` (text, max 280 chars)
      - `category` (text)
      - `moderation_status` (text)
      - `created_at` (timestamptz)
    
    - `post_reactions`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `reaction_type` (text: heart, thumbs_up, sparkles)
      - `created_at` (timestamptz)
    
    - `moderation_queue`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `reported_by` (uuid, foreign key)
      - `reason` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- accomplishment_posts table
CREATE TABLE IF NOT EXISTS accomplishment_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  category TEXT NOT NULL CHECK (category IN ('Health', 'Personal', 'Work', 'Relationships', 'Self-Care', 'Other')),
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE accomplishment_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved posts"
  ON accomplishment_posts FOR SELECT
  USING (moderation_status = 'approved');

CREATE POLICY "Users can create own posts"
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

-- post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES accomplishment_posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'thumbs_up', 'sparkles')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- moderation_queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES accomplishment_posts ON DELETE CASCADE NOT NULL,
  reported_by UUID REFERENCES auth.users NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can report posts"
  ON moderation_queue FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view own reports"
  ON moderation_queue FOR SELECT
  TO authenticated
  USING (auth.uid() = reported_by);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_accomplishment_posts_status ON accomplishment_posts(moderation_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_achievement_feed_created ON achievement_feed(created_at DESC);
