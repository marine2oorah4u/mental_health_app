/*
  # Virtual Room & Decoration System

  1. New Tables
    - `decoration_catalog`
      - `id` (uuid, primary key)
      - `name` (text) - Display name
      - `emoji` (text) - Emoji representation
      - `category` (text) - furniture, plants, art, toys, floor, wall
      - `size` (integer) - Grid size (1, 2, or 4 for 1x1, 2x2, 2x2)
      - `unlock_requirement` (text) - achievement_id or 'default'
      - `rarity` (text) - common, rare, legendary
      - `created_at` (timestamptz)

    - `user_room_layout`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `decoration_id` (uuid, foreign key)
      - `position_x` (integer) - Grid X position (0-7)
      - `position_y` (integer) - Grid Y position (0-7)
      - `is_visible` (boolean) - Show/hide decoration
      - `created_at` (timestamptz)

    - `user_unlocked_decorations`
      - `user_id` (uuid, foreign key)
      - `decoration_id` (uuid, foreign key)
      - `unlocked_at` (timestamptz)
      - Primary key on (user_id, decoration_id)

  2. Security
    - Enable RLS on all tables
    - Users can only modify their own room layouts
    - Decoration catalog is read-only for all users
    - Users can only see their own unlocked decorations

  3. Seed Data
    - Add starter decorations available to everyone
*/

-- Decoration Catalog Table
CREATE TABLE IF NOT EXISTS decoration_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  category text NOT NULL CHECK (category IN ('furniture', 'plants', 'art', 'toys', 'floor', 'wall', 'lighting')),
  size integer NOT NULL DEFAULT 1 CHECK (size IN (1, 2, 4)),
  unlock_requirement text DEFAULT 'default',
  rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'legendary')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE decoration_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view decoration catalog"
  ON decoration_catalog FOR SELECT
  TO authenticated
  USING (true);

-- User Room Layout Table
CREATE TABLE IF NOT EXISTS user_room_layout (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  decoration_id uuid REFERENCES decoration_catalog(id) ON DELETE CASCADE NOT NULL,
  position_x integer NOT NULL CHECK (position_x >= 0 AND position_x < 8),
  position_y integer NOT NULL CHECK (position_y >= 0 AND position_y < 8),
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_room_layout ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own room layout"
  ON user_room_layout FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own room decorations"
  ON user_room_layout FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own room decorations"
  ON user_room_layout FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own room decorations"
  ON user_room_layout FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Unlocked Decorations Table
CREATE TABLE IF NOT EXISTS user_unlocked_decorations (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  decoration_id uuid REFERENCES decoration_catalog(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, decoration_id)
);

ALTER TABLE user_unlocked_decorations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlocked decorations"
  ON user_unlocked_decorations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock decorations"
  ON user_unlocked_decorations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert starter decorations (available to everyone)
INSERT INTO decoration_catalog (name, emoji, category, size, unlock_requirement, rarity) VALUES
  -- Furniture (common)
  ('Small Plant', '🪴', 'plants', 1, 'default', 'common'),
  ('Cushion', '🛋️', 'furniture', 1, 'default', 'common'),
  ('Book Stack', '📚', 'furniture', 1, 'default', 'common'),
  ('Coffee Cup', '☕', 'furniture', 1, 'default', 'common'),

  -- Plants (common)
  ('Cactus', '🌵', 'plants', 1, 'default', 'common'),
  ('Flower Pot', '🌸', 'plants', 1, 'default', 'common'),
  ('Sunflower', '🌻', 'plants', 1, 'default', 'common'),

  -- Toys (common)
  ('Ball', '⚽', 'toys', 1, 'default', 'common'),
  ('Teddy Bear', '🧸', 'toys', 1, 'default', 'common'),
  ('Toy Car', '🚗', 'toys', 1, 'default', 'common'),

  -- Art/Decor (common)
  ('Picture Frame', '🖼️', 'art', 1, 'default', 'common'),
  ('Clock', '🕐', 'art', 1, 'default', 'common'),
  ('Candle', '🕯️', 'lighting', 1, 'default', 'common'),

  -- Rare items
  ('Large Bookshelf', '📖', 'furniture', 2, 'default', 'rare'),
  ('Comfy Chair', '🪑', 'furniture', 2, 'default', 'rare'),
  ('Floor Lamp', '💡', 'lighting', 1, 'default', 'rare'),
  ('Musical Note', '🎵', 'art', 1, 'default', 'rare'),

  -- Legendary items
  ('Treasure Chest', '🎁', 'furniture', 2, 'default', 'legendary'),
  ('Rainbow', '🌈', 'art', 4, 'default', 'legendary'),
  ('Star', '⭐', 'lighting', 1, 'default', 'legendary'),

  -- More Common items
  ('Pillow', '🛏️', 'furniture', 1, 'default', 'common'),
  ('Laptop', '💻', 'furniture', 1, 'default', 'common'),
  ('Tea Cup', '🍵', 'furniture', 1, 'default', 'common'),
  ('Umbrella', '☂️', 'furniture', 1, 'default', 'common'),
  ('Basketball', '🏀', 'toys', 1, 'default', 'common'),
  ('Dice', '🎲', 'toys', 1, 'default', 'common'),
  ('Balloon', '🎈', 'toys', 1, 'default', 'common'),
  ('Camera', '📷', 'furniture', 1, 'default', 'common'),
  ('Telescope', '🔭', 'furniture', 1, 'default', 'common'),
  ('Globe', '🌍', 'furniture', 1, 'default', 'common'),

  -- Food items (common)
  ('Cookie', '🍪', 'furniture', 1, 'default', 'common'),
  ('Cake Slice', '🍰', 'furniture', 1, 'default', 'common'),
  ('Pizza', '🍕', 'furniture', 1, 'default', 'common'),
  ('Apple', '🍎', 'furniture', 1, 'default', 'common'),

  -- More Plants (common)
  ('Tree', '🌳', 'plants', 2, 'default', 'common'),
  ('Herb Pot', '🌿', 'plants', 1, 'default', 'common'),
  ('Tulip', '🌷', 'plants', 1, 'default', 'common'),
  ('Cherry Blossom', '🌸', 'plants', 1, 'default', 'common'),

  -- More Rare items
  ('Crystal Ball', '🔮', 'art', 1, 'default', 'rare'),
  ('Magic Wand', '🪄', 'toys', 1, 'default', 'rare'),
  ('Crown', '👑', 'art', 1, 'default', 'rare'),
  ('Gem', '💎', 'art', 1, 'default', 'rare'),
  ('Headphones', '🎧', 'furniture', 1, 'default', 'rare'),
  ('Microphone', '🎤', 'furniture', 1, 'default', 'rare'),
  ('Guitar', '🎸', 'furniture', 2, 'default', 'rare'),
  ('Drum', '🥁', 'furniture', 1, 'default', 'rare'),

  -- Seasonal/Special (rare)
  ('Jack-o-Lantern', '🎃', 'art', 1, 'default', 'rare'),
  ('Christmas Tree', '🎄', 'plants', 2, 'default', 'rare'),
  ('Snowman', '⛄', 'art', 1, 'default', 'rare'),
  ('Fireworks', '🎆', 'art', 1, 'default', 'rare'),

  -- More Legendary
  ('Rocket', '🚀', 'furniture', 2, 'default', 'legendary'),
  ('UFO', '🛸', 'furniture', 2, 'default', 'legendary'),
  ('Dragon', '🐉', 'toys', 2, 'default', 'legendary'),
  ('Unicorn', '🦄', 'toys', 1, 'default', 'legendary'),
  ('Trophy', '🏆', 'art', 1, 'default', 'legendary'),
  ('Crown Jewels', '💍', 'art', 1, 'default', 'legendary')
ON CONFLICT DO NOTHING;

-- Function to auto-unlock default decorations for new users
CREATE OR REPLACE FUNCTION unlock_default_decorations_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_unlocked_decorations (user_id, decoration_id)
  SELECT NEW.id, id
  FROM decoration_catalog
  WHERE unlock_requirement = 'default'
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-unlock decorations when user profile is created
DROP TRIGGER IF EXISTS auto_unlock_default_decorations ON profiles;
CREATE TRIGGER auto_unlock_default_decorations
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION unlock_default_decorations_for_user();
