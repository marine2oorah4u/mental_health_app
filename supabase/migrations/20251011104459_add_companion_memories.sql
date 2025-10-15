/*
  # AI Companion Memories & Profile

  ## New Tables
  
  ### `companion_memories`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `memory_type` (text) - Type: fact, preference, goal, concern, achievement
  - `key` (text) - Memory key (e.g., "name", "job", "hobby", "struggle")
  - `value` (text) - Memory value
  - `context` (text) - Additional context
  - `importance` (integer) - 1-5 priority level
  - `created_at` (timestamptz) - When memory was created
  - `last_referenced` (timestamptz) - Last time memory was used
  - `reference_count` (integer) - How often it's been referenced

  ### `companion_conversation_state`
  - `user_id` (uuid, primary key) - References auth.users
  - `onboarding_completed` (boolean) - Has intro conversation finished
  - `current_stage` (text) - greeting, learning_name, learning_about, ongoing
  - `last_question_asked` (text) - Track conversation flow
  - `pending_memory_key` (text) - What we're learning about
  - `conversation_depth` (integer) - How many turns in current topic
  - `updated_at` (timestamptz) - Last update

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
*/

-- Create companion_memories table
CREATE TABLE IF NOT EXISTS companion_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  memory_type text NOT NULL CHECK (memory_type IN ('fact', 'preference', 'goal', 'concern', 'achievement', 'interest')),
  key text NOT NULL,
  value text NOT NULL,
  context text,
  importance integer DEFAULT 3 CHECK (importance >= 1 AND importance <= 5),
  created_at timestamptz DEFAULT now(),
  last_referenced timestamptz DEFAULT now(),
  reference_count integer DEFAULT 0
);

ALTER TABLE companion_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own memories"
  ON companion_memories FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create companion_conversation_state table
CREATE TABLE IF NOT EXISTS companion_conversation_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_completed boolean DEFAULT false,
  current_stage text DEFAULT 'greeting',
  last_question_asked text,
  pending_memory_key text,
  conversation_depth integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companion_conversation_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversation state"
  ON companion_conversation_state FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companion_memories_user_id ON companion_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_companion_memories_type ON companion_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_companion_memories_key ON companion_memories(key);
CREATE INDEX IF NOT EXISTS idx_companion_memories_importance ON companion_memories(importance DESC);
