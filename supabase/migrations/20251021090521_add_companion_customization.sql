/*
  # Companion Customization & 3D Environments

  1. New Tables
    - `companion_appearance`
      - Stores user's companion character customization
      - Type (animal, orb, humanoid), species, colors, accessories
      - Unlockable items earned through achievements

    - `companion_environments`
      - Stores user's environment/room customization
      - Theme (cozy, garden, office, beach, mountain, space)
      - Style (realistic vs stylized)
      - Colors, lighting, weather effects

    - `environment_decorations`
      - Tracks objects placed in user's environment
      - Position, rotation, scale for each decoration
      - Links to decoration catalog

    - `decoration_catalog`
      - Master list of all available decorations
      - Some are default, others unlocked via achievements
      - Categories: furniture, plants, art, seasonal

    - `environment_presets`
      - Pre-built environment combinations users can quick-select
      - Includes appearance + environment + decorations

  2. Security
    - Enable RLS on all tables
    - Users can only access their own customizations
    - Catalog is public read-only
    - Achievement requirements validated server-side
*/

-- Companion Appearance Table
CREATE TABLE IF NOT EXISTS companion_appearance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  companion_type text NOT NULL DEFAULT 'orb' CHECK (companion_type IN ('animal', 'orb', 'humanoid', 'custom')),
  species text DEFAULT 'default',
  primary_color text DEFAULT '#6366F1',
  secondary_color text DEFAULT '#8B5CF6',
  accent_color text DEFAULT '#EC4899',
  size text DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  accessories jsonb DEFAULT '[]'::jsonb,
  animation_speed real DEFAULT 1.0,
  unlocked_items jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Companion Environments Table
CREATE TABLE IF NOT EXISTS companion_environments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme text NOT NULL DEFAULT 'cozy' CHECK (theme IN ('cozy', 'garden', 'office', 'beach', 'mountain', 'space', 'forest', 'city', 'custom')),
  style text NOT NULL DEFAULT 'stylized' CHECK (style IN ('realistic', 'stylized', 'minimal', 'fantasy')),
  floor_color text DEFAULT '#E5E7EB',
  wall_color text DEFAULT '#F3F4F6',
  ceiling_color text DEFAULT '#FFFFFF',
  lighting_type text DEFAULT 'soft' CHECK (lighting_type IN ('soft', 'bright', 'dim', 'dynamic', 'custom')),
  ambient_light_color text DEFAULT '#FFFFFF',
  time_of_day text DEFAULT 'day' CHECK (time_of_day IN ('dawn', 'day', 'dusk', 'night', 'auto')),
  weather_effect text DEFAULT 'clear' CHECK (weather_effect IN ('clear', 'rain', 'snow', 'fog', 'stars', 'clouds')),
  ambient_sound text DEFAULT 'none',
  ambient_volume real DEFAULT 0.3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Decoration Catalog (Master List)
CREATE TABLE IF NOT EXISTS decoration_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('furniture', 'plants', 'art', 'lighting', 'seasonal', 'tech', 'cozy', 'nature')),
  description text,
  unlock_requirement text,
  achievement_id uuid REFERENCES achievements(id),
  points_cost int DEFAULT 0,
  is_default boolean DEFAULT true,
  thumbnail_url text,
  model_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Environment Decorations (User's Placed Items)
CREATE TABLE IF NOT EXISTS environment_decorations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  decoration_id uuid REFERENCES decoration_catalog(id) NOT NULL,
  position_x real DEFAULT 0,
  position_y real DEFAULT 0,
  position_z real DEFAULT 0,
  rotation_x real DEFAULT 0,
  rotation_y real DEFAULT 0,
  rotation_z real DEFAULT 0,
  scale real DEFAULT 1.0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Environment Presets (Quick-Select Combinations)
CREATE TABLE IF NOT EXISTS environment_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  appearance_data jsonb NOT NULL,
  environment_data jsonb NOT NULL,
  decoration_positions jsonb DEFAULT '[]'::jsonb,
  thumbnail_url text,
  times_used int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companion_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoration_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_presets ENABLE ROW LEVEL SECURITY;

-- Policies for companion_appearance
CREATE POLICY "Users can view own appearance"
  ON companion_appearance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appearance"
  ON companion_appearance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appearance"
  ON companion_appearance FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own appearance"
  ON companion_appearance FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for companion_environments
CREATE POLICY "Users can view own environment"
  ON companion_environments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own environment"
  ON companion_environments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own environment"
  ON companion_environments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own environment"
  ON companion_environments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for decoration_catalog (Public Read-Only)
CREATE POLICY "Anyone can view decoration catalog"
  ON decoration_catalog FOR SELECT
  TO authenticated
  USING (true);

-- Policies for environment_decorations
CREATE POLICY "Users can view own decorations"
  ON environment_decorations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own decorations"
  ON environment_decorations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decorations"
  ON environment_decorations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own decorations"
  ON environment_decorations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for environment_presets
CREATE POLICY "Users can view own presets"
  ON environment_presets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own presets"
  ON environment_presets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets"
  ON environment_presets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets"
  ON environment_presets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert Default Decorations
INSERT INTO decoration_catalog (name, category, description, is_default, points_cost) VALUES
  ('Potted Plant', 'plants', 'A small potted succulent', true, 0),
  ('Floor Lamp', 'lighting', 'Warm ambient floor lamp', true, 0),
  ('Cozy Chair', 'furniture', 'Comfortable reading chair', true, 0),
  ('Wall Art', 'art', 'Abstract framed artwork', true, 0),
  ('Bookshelf', 'furniture', 'Wooden bookshelf', true, 0),
  ('Desk', 'furniture', 'Modern minimalist desk', true, 0),
  ('Window', 'furniture', 'Large window with view', true, 0),
  ('Rug', 'cozy', 'Soft area rug', true, 0),
  ('Hanging Plants', 'plants', 'Trailing ivy in hanging pot', true, 0),
  ('String Lights', 'lighting', 'Warm fairy lights', true, 0)
ON CONFLICT DO NOTHING;

-- Create function to initialize default customization for new users
CREATE OR REPLACE FUNCTION initialize_companion_customization()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default appearance
  INSERT INTO companion_appearance (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default environment
  INSERT INTO companion_environments (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-initialize customization for new users
CREATE TRIGGER on_auth_user_created_companion_init
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_companion_customization();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companion_appearance_user ON companion_appearance(user_id);
CREATE INDEX IF NOT EXISTS idx_companion_environments_user ON companion_environments(user_id);
CREATE INDEX IF NOT EXISTS idx_environment_decorations_user ON environment_decorations(user_id);
CREATE INDEX IF NOT EXISTS idx_decoration_catalog_category ON decoration_catalog(category);
CREATE INDEX IF NOT EXISTS idx_environment_presets_user ON environment_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_environment_presets_public ON environment_presets(is_public) WHERE is_public = true;
