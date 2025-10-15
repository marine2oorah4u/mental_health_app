/*
  # Enhance Location Review System
  
  Adds missing features for the review system:
  - Accessibility updates table
  - Helpful votes table
  - Enhanced columns for reviews
  - Better moderation and verification
  
  ## Changes
  
  1. Add missing columns to location_reviews
  2. Create location_accessibility_updates table
  3. Create review_helpful_votes table
  4. Add RLS policies
  5. Add triggers and functions
*/

-- Add missing columns to location_reviews if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'title') THEN
    ALTER TABLE location_reviews ADD COLUMN title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'is_verified') THEN
    ALTER TABLE location_reviews ADD COLUMN is_verified BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'is_flagged') THEN
    ALTER TABLE location_reviews ADD COLUMN is_flagged BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'mobility_rating') THEN
    ALTER TABLE location_reviews ADD COLUMN mobility_rating INTEGER CHECK (mobility_rating >= 1 AND mobility_rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'sensory_rating') THEN
    ALTER TABLE location_reviews ADD COLUMN sensory_rating INTEGER CHECK (sensory_rating >= 1 AND sensory_rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'vision_rating') THEN
    ALTER TABLE location_reviews ADD COLUMN vision_rating INTEGER CHECK (vision_rating >= 1 AND vision_rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'hearing_rating') THEN
    ALTER TABLE location_reviews ADD COLUMN hearing_rating INTEGER CHECK (hearing_rating >= 1 AND hearing_rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_reviews' AND column_name = 'cognitive_rating') THEN
    ALTER TABLE location_reviews ADD COLUMN cognitive_rating INTEGER CHECK (cognitive_rating >= 1 AND cognitive_rating <= 5);
  END IF;
END $$;

-- Add missing columns to location_photos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_photos' AND column_name = 'is_verified') THEN
    ALTER TABLE location_photos ADD COLUMN is_verified BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_photos' AND column_name = 'is_flagged') THEN
    ALTER TABLE location_photos ADD COLUMN is_flagged BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'location_photos' AND column_name = 'accessibility_category') THEN
    ALTER TABLE location_photos ADD COLUMN accessibility_category TEXT;
  END IF;
END $$;

-- Create location_accessibility_updates table
CREATE TABLE IF NOT EXISTS location_accessibility_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES accessible_locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  feature_category TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  is_available BOOLEAN NOT NULL,
  notes TEXT,
  
  status TEXT DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create review_helpful_votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES location_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(review_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE location_accessibility_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view verified reviews" ON location_reviews;
  DROP POLICY IF EXISTS "Authenticated users can create reviews" ON location_reviews;
  DROP POLICY IF EXISTS "Users can update own reviews" ON location_reviews;
  DROP POLICY IF EXISTS "Users can delete own reviews" ON location_reviews;
  
  DROP POLICY IF EXISTS "Anyone can view verified photos" ON location_photos;
  DROP POLICY IF EXISTS "Authenticated users can upload photos" ON location_photos;
  DROP POLICY IF EXISTS "Users can update own photos" ON location_photos;
  DROP POLICY IF EXISTS "Users can delete own photos" ON location_photos;
END $$;

-- Location Reviews Policies
CREATE POLICY "Anyone can view verified reviews"
  ON location_reviews FOR SELECT
  USING (is_verified = true OR is_verified IS NULL);

CREATE POLICY "Authenticated users can create reviews"
  ON location_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON location_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON location_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Location Photos Policies
CREATE POLICY "Anyone can view verified photos"
  ON location_photos FOR SELECT
  USING (is_verified = true OR is_verified IS NULL);

CREATE POLICY "Authenticated users can upload photos"
  ON location_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos"
  ON location_photos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos"
  ON location_photos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Accessibility Updates Policies
CREATE POLICY "Anyone can view approved updates"
  ON location_accessibility_updates FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Authenticated users can submit updates"
  ON location_accessibility_updates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own updates"
  ON location_accessibility_updates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Helpful Votes Policies
CREATE POLICY "Anyone can view helpful votes"
  ON review_helpful_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote helpful"
  ON review_helpful_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
  ON review_helpful_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE location_reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE location_reviews
    SET helpful_count = GREATEST(helpful_count - 1, 0)
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_review_helpful_count_trigger ON review_helpful_votes;
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_location_reviews_location_id ON location_reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_location_reviews_verified ON location_reviews(is_verified);
CREATE INDEX IF NOT EXISTS idx_location_photos_location_id ON location_photos(location_id);
CREATE INDEX IF NOT EXISTS idx_location_accessibility_updates_location ON location_accessibility_updates(location_id);
CREATE INDEX IF NOT EXISTS idx_location_accessibility_updates_status ON location_accessibility_updates(status);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_user ON review_helpful_votes(user_id);
