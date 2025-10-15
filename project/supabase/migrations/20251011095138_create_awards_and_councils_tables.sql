/*
  Awards and Council Contacts Tables

  New Tables Created:
  
  1. awards - Scouting America disability inclusion awards
     - id (uuid, primary key)
     - name, designation, description
     - eligibility, requirements, application_process
     - level (council/national/regional)
     - category (unit/individual_youth/individual_adult/council)
     - is_active, created_at, updated_at

  2. award_forms - Downloadable forms for awards
     - id (uuid, primary key), award_id (foreign key)
     - form_name, form_type, description
     - file_url, is_required, order_index
     - created_at

  3. council_contacts - Special needs coordinators by council
     - id (uuid, primary key)
     - council_name, state, region
     - coordinator_name, email, phone
     - website, inclusion_page_url, notes
     - last_verified, created_at, updated_at

  4. resources_directory - Community resource finder
     - id (uuid, primary key)
     - name, description, category
     - address, city, state, zip_code
     - phone, email, website
     - disability_types (array)
     - is_verified, submitted_by
     - created_at, updated_at

  Security:
    - Enable RLS on all tables
    - Public read access (information is public-facing)
    - Insert/update/delete restricted to authenticated users only
*/

-- Create awards table
CREATE TABLE IF NOT EXISTS awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  description text NOT NULL,
  eligibility text NOT NULL,
  requirements text NOT NULL,
  application_process text NOT NULL,
  level text NOT NULL CHECK (level IN ('council', 'national', 'regional')),
  category text NOT NULL CHECK (category IN ('unit', 'individual_youth', 'individual_adult', 'council')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create award_forms table
CREATE TABLE IF NOT EXISTS award_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id uuid NOT NULL REFERENCES awards(id) ON DELETE CASCADE,
  form_name text NOT NULL,
  form_type text NOT NULL CHECK (form_type IN ('application', 'checklist', 'instructions', 'support_doc')),
  description text NOT NULL,
  file_url text,
  is_required boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create council_contacts table
CREATE TABLE IF NOT EXISTS council_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  council_name text NOT NULL,
  state text NOT NULL,
  region text,
  coordinator_name text NOT NULL,
  email text,
  phone text,
  website text,
  inclusion_page_url text,
  notes text,
  last_verified timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resources_directory table
CREATE TABLE IF NOT EXISTS resources_directory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  address text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  phone text,
  email text,
  website text,
  disability_types text[],
  is_verified boolean DEFAULT false,
  submitted_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources_directory ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Anyone can view awards"
  ON awards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view award forms"
  ON award_forms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view council contacts"
  ON council_contacts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view resources"
  ON resources_directory FOR SELECT
  USING (true);

-- Authenticated users can manage data (admins only in practice)
CREATE POLICY "Authenticated users can insert awards"
  ON awards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update awards"
  ON awards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete awards"
  ON awards FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert award forms"
  ON award_forms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update award forms"
  ON award_forms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete award forms"
  ON award_forms FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert council contacts"
  ON council_contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update council contacts"
  ON council_contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete council contacts"
  ON council_contacts FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert resources"
  ON resources_directory FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resources"
  ON resources_directory FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete resources"
  ON resources_directory FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_award_forms_award_id ON award_forms(award_id);
CREATE INDEX IF NOT EXISTS idx_council_contacts_state ON council_contacts(state);
CREATE INDEX IF NOT EXISTS idx_resources_zip_code ON resources_directory(zip_code);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources_directory(category);
CREATE INDEX IF NOT EXISTS idx_resources_state ON resources_directory(state);