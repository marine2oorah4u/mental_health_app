/*
  # Accessible Locations and Reviews System

  1. New Tables
    - `accessible_locations`
      - `id` (uuid, primary key)
      - `name` (text) - Location name
      - `type` (text) - camp, service_center, meeting_location, outdoor_area
      - `address` (text) - Street address
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `description` (text) - General description
      - `contact_phone` (text)
      - `contact_email` (text)
      - `website` (text)
      - `submitted_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_verified` (boolean) - Admin verified location

    - `location_accessibility_features`
      - `id` (uuid, primary key)
      - `location_id` (uuid, foreign key)
      - `feature_category` (text) - mobility, sensory, vision, hearing, cognitive
      - `feature_name` (text) - wheelchair_ramp, accessible_restroom, etc.
      - `is_available` (boolean)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `location_reviews`
      - `id` (uuid, primary key)
      - `location_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer) - 1-5 stars
      - `accessibility_rating` (integer) - 1-5 stars for accessibility
      - `review_text` (text)
      - `disability_type` (text) - What disability was this review for
      - `visit_date` (date)
      - `helpful_count` (integer) - How many found this helpful
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `location_photos`
      - `id` (uuid, primary key)
      - `location_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `photo_url` (text) - URL to photo
      - `caption` (text)
      - `photo_type` (text) - entrance, restroom, parking, facility, other
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read verified locations
    - Authenticated users can submit locations and reviews
    - Users can only edit their own submissions
*/

-- Create accessible_locations table
CREATE TABLE IF NOT EXISTS accessible_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('camp', 'service_center', 'meeting_location', 'outdoor_area')),
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL DEFAULT 'MI',
  zip_code text,
  latitude decimal(10, 7),
  longitude decimal(10, 7),
  description text,
  contact_phone text,
  contact_email text,
  website text,
  submitted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false
);

-- Create location_accessibility_features table
CREATE TABLE IF NOT EXISTS location_accessibility_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES accessible_locations(id) ON DELETE CASCADE NOT NULL,
  feature_category text NOT NULL CHECK (feature_category IN ('mobility', 'sensory', 'vision', 'hearing', 'cognitive')),
  feature_name text NOT NULL,
  is_available boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create location_reviews table
CREATE TABLE IF NOT EXISTS location_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES accessible_locations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  accessibility_rating integer CHECK (accessibility_rating >= 1 AND accessibility_rating <= 5),
  review_text text,
  disability_type text,
  visit_date date,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create location_photos table
CREATE TABLE IF NOT EXISTS location_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES accessible_locations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url text NOT NULL,
  caption text,
  photo_type text CHECK (photo_type IN ('entrance', 'restroom', 'parking', 'facility', 'other')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE accessible_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_accessibility_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_photos ENABLE ROW LEVEL SECURITY;

-- Policies for accessible_locations
CREATE POLICY "Anyone can view verified locations"
  ON accessible_locations FOR SELECT
  USING (is_verified = true OR auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can submit locations"
  ON accessible_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own locations"
  ON accessible_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by)
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can delete their own locations"
  ON accessible_locations FOR DELETE
  TO authenticated
  USING (auth.uid() = submitted_by);

-- Policies for location_accessibility_features
CREATE POLICY "Anyone can view accessibility features"
  ON location_accessibility_features FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add accessibility features"
  ON location_accessibility_features FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for location_reviews
CREATE POLICY "Anyone can view reviews"
  ON location_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reviews"
  ON location_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON location_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON location_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for location_photos
CREATE POLICY "Anyone can view photos"
  ON location_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add photos"
  ON location_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON location_photos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_locations_verified ON accessible_locations(is_verified);
CREATE INDEX IF NOT EXISTS idx_locations_type ON accessible_locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_state ON accessible_locations(state);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON accessible_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_features_location ON location_accessibility_features(location_id);
CREATE INDEX IF NOT EXISTS idx_reviews_location ON location_reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_photos_location ON location_photos(location_id);