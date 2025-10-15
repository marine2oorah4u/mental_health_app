/*
  # Create Favorite Locations Table

  1. New Tables
    - `favorite_locations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `location_id` (uuid, foreign key to accessible_locations)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `favorite_locations` table
    - Add policy for users to manage their own favorites
  
  3. Constraints
    - Unique constraint on (user_id, location_id) to prevent duplicates
*/

-- Create favorite_locations table
CREATE TABLE IF NOT EXISTS favorite_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_id uuid REFERENCES accessible_locations(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Enable RLS
ALTER TABLE favorite_locations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorite_locations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can add favorites
CREATE POLICY "Users can add favorites"
  ON favorite_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove favorites
CREATE POLICY "Users can remove favorites"
  ON favorite_locations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorite_locations_user_id ON favorite_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_locations_location_id ON favorite_locations(location_id);