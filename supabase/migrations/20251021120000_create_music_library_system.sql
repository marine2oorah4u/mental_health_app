/*
  # Music Library System

  1. New Tables
    - `music_packs`
      - `id` (uuid, primary key)
      - `name` (text) - Pack name
      - `description` (text) - Pack description
      - `category` (text) - lofi, piano, nature, etc.
      - `track_count` (integer) - Number of tracks
      - `file_size_mb` (numeric) - Size in MB
      - `thumbnail_url` (text) - Cover art
      - `is_free` (boolean) - Free or premium
      - `price` (numeric) - Price if not free
      - `created_at` (timestamptz)

    - `music_tracks`
      - `id` (uuid, primary key)
      - `pack_id` (uuid, foreign key)
      - `title` (text) - Track title
      - `artist` (text) - Artist name
      - `duration_seconds` (integer) - Track length
      - `file_url` (text) - URL to audio file
      - `preview_url` (text) - Short preview URL
      - `order_index` (integer) - Track order in pack
      - `created_at` (timestamptz)

    - `user_downloaded_packs`
      - `user_id` (uuid, foreign key)
      - `pack_id` (uuid, foreign key)
      - `downloaded_at` (timestamptz)
      - Primary key on (user_id, pack_id)

    - `user_music_favorites`
      - `user_id` (uuid, foreign key)
      - `track_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - Primary key on (user_id, track_id)

  2. Security
    - Enable RLS on all tables
    - Music packs/tracks are viewable by all
    - Users can only modify their own downloads/favorites

  3. Seed Data
    - Add starter free pack with placeholder tracks
*/

-- Music Packs Table
CREATE TABLE IF NOT EXISTS music_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('lofi', 'piano', 'nature', 'ambient', 'chill', 'meditation')),
  track_count integer NOT NULL DEFAULT 0,
  file_size_mb numeric NOT NULL DEFAULT 0,
  thumbnail_url text,
  is_free boolean DEFAULT true,
  price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE music_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view music packs"
  ON music_packs FOR SELECT
  TO authenticated
  USING (true);

-- Music Tracks Table
CREATE TABLE IF NOT EXISTS music_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id uuid REFERENCES music_packs(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  artist text NOT NULL DEFAULT 'Unknown Artist',
  duration_seconds integer NOT NULL DEFAULT 180,
  file_url text NOT NULL,
  preview_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view music tracks"
  ON music_tracks FOR SELECT
  TO authenticated
  USING (true);

-- User Downloaded Packs Table
CREATE TABLE IF NOT EXISTS user_downloaded_packs (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack_id uuid REFERENCES music_packs(id) ON DELETE CASCADE NOT NULL,
  downloaded_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, pack_id)
);

ALTER TABLE user_downloaded_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloaded packs"
  ON user_downloaded_packs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can download packs"
  ON user_downloaded_packs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove downloaded packs"
  ON user_downloaded_packs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Music Favorites Table
CREATE TABLE IF NOT EXISTS user_music_favorites (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id uuid REFERENCES music_tracks(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, track_id)
);

ALTER TABLE user_music_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON user_music_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON user_music_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON user_music_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert starter free music packs
INSERT INTO music_packs (name, description, category, track_count, file_size_mb, is_free) VALUES
  ('Starter Lofi Pack', 'Free lofi beats to help you relax and focus', 'lofi', 5, 15, true),
  ('Nature Sounds', 'Calming nature sounds for meditation', 'nature', 6, 18, true),
  ('Piano Relaxation', 'Peaceful piano melodies', 'piano', 4, 12, true)
ON CONFLICT DO NOTHING;

-- Insert placeholder tracks (URLs point to freesound.org public domain sounds)
DO $$
DECLARE
  lofi_pack_id uuid;
  nature_pack_id uuid;
  piano_pack_id uuid;
BEGIN
  SELECT id INTO lofi_pack_id FROM music_packs WHERE name = 'Starter Lofi Pack' LIMIT 1;
  SELECT id INTO nature_pack_id FROM music_packs WHERE name = 'Nature Sounds' LIMIT 1;
  SELECT id INTO piano_pack_id FROM music_packs WHERE name = 'Piano Relaxation' LIMIT 1;

  -- Lofi tracks
  IF lofi_pack_id IS NOT NULL THEN
    INSERT INTO music_tracks (pack_id, title, artist, duration_seconds, file_url, order_index) VALUES
      (lofi_pack_id, 'Chill Vibes', 'Lofi Artist', 180, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 1),
      (lofi_pack_id, 'Afternoon Study', 'Lofi Artist', 200, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 2),
      (lofi_pack_id, 'Night Drive', 'Lofi Artist', 195, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 3),
      (lofi_pack_id, 'Coffee Shop', 'Lofi Artist', 175, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 4),
      (lofi_pack_id, 'Rainy Day', 'Lofi Artist', 210, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Nature tracks
  IF nature_pack_id IS NOT NULL THEN
    INSERT INTO music_tracks (pack_id, title, artist, duration_seconds, file_url, order_index) VALUES
      (nature_pack_id, 'Ocean Waves', 'Nature Sounds', 300, 'https://cdn.freesound.org/previews/535/535997_11935698-lq.mp3', 1),
      (nature_pack_id, 'Gentle Rain', 'Nature Sounds', 300, 'https://cdn.freesound.org/previews/416/416710_7193358-lq.mp3', 2),
      (nature_pack_id, 'Forest Birds', 'Nature Sounds', 240, 'https://cdn.freesound.org/previews/449/449066_5121236-lq.mp3', 3),
      (nature_pack_id, 'Flowing Stream', 'Nature Sounds', 280, 'https://cdn.freesound.org/previews/391/391660_7193358-lq.mp3', 4),
      (nature_pack_id, 'Crackling Fire', 'Nature Sounds', 320, 'https://cdn.freesound.org/previews/397/397359_7193358-lq.mp3', 5),
      (nature_pack_id, 'Wind Through Trees', 'Nature Sounds', 260, 'https://cdn.freesound.org/previews/391/391660_7193358-lq.mp3', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Piano tracks
  IF piano_pack_id IS NOT NULL THEN
    INSERT INTO music_tracks (pack_id, title, artist, duration_seconds, file_url, order_index) VALUES
      (piano_pack_id, 'Moonlight Sonata', 'Piano Artist', 240, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 1),
      (piano_pack_id, 'Peaceful Morning', 'Piano Artist', 220, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 2),
      (piano_pack_id, 'Soft Melody', 'Piano Artist', 200, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 3),
      (piano_pack_id, 'Evening Calm', 'Piano Artist', 230, 'https://cdn.freesound.org/previews/467/467812_9497060-lq.mp3', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
