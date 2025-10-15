/*
  # AI Companion Conversation Memory

  ## New Tables
  
  ### `companion_conversations`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `message` (text) - User message
  - `response` (text) - Companion response
  - `sentiment` (text) - Detected sentiment: positive, negative, neutral, anxious, sad
  - `topics` (text[]) - Extracted topics for learning
  - `created_at` (timestamptz) - Message timestamp

  ### `companion_user_preferences`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users, unique
  - `preferred_coping_strategies` (text[]) - Array of strategies user responds well to
  - `common_concerns` (text[]) - Common topics user discusses
  - `preferred_tone` (text) - supportive, motivational, gentle
  - `last_topics` (jsonb) - Recent conversation topics with timestamps
  - `interaction_count` (integer) - Total conversations
  - `created_at` (timestamptz) - First interaction
  - `updated_at` (timestamptz) - Last update

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Auto-cleanup old conversations (keep last 50)

  ## Notes
  - Stores minimal context for personalization
  - No sensitive personal information stored
  - Focus on therapeutic patterns, not deep personal history
*/

-- Create companion_conversations table
CREATE TABLE IF NOT EXISTS companion_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  response text NOT NULL,
  sentiment text CHECK (sentiment IN ('positive', 'negative', 'neutral', 'anxious', 'sad', 'stressed', 'hopeful')),
  topics text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companion_conversations ENABLE ROW LEVEL SECURITY;

-- Users can insert their own conversations
CREATE POLICY "Users can create conversations"
  ON companion_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON companion_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON companion_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create companion_user_preferences table
CREATE TABLE IF NOT EXISTS companion_user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_coping_strategies text[] DEFAULT '{}',
  common_concerns text[] DEFAULT '{}',
  preferred_tone text DEFAULT 'supportive' CHECK (preferred_tone IN ('supportive', 'motivational', 'gentle', 'direct')),
  last_topics jsonb DEFAULT '[]'::jsonb,
  interaction_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companion_user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can insert their preferences
CREATE POLICY "Users can create preferences"
  ON companion_user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their preferences
CREATE POLICY "Users can view own preferences"
  ON companion_user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their preferences
CREATE POLICY "Users can update own preferences"
  ON companion_user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companion_conversations_user_id ON companion_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_companion_conversations_created_at ON companion_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companion_user_preferences_user_id ON companion_user_preferences(user_id);

-- Function to auto-cleanup old conversations (keep last 50 per user)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS trigger AS $$
BEGIN
  DELETE FROM companion_conversations
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id FROM companion_conversations
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    LIMIT 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-cleanup
DROP TRIGGER IF EXISTS trigger_cleanup_conversations ON companion_conversations;
CREATE TRIGGER trigger_cleanup_conversations
  AFTER INSERT ON companion_conversations
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_conversations();
