/*
  # Add Organization Column and Clear Fake Awards

  1. Changes
    - Add `organization` column to awards table to distinguish BSA vs non-BSA awards
    - Clear all existing fake award data
    - Keep table structure intact for real awards to be added

  2. Notes
    - Organization values will be: 'BSA' or 'External Organization'
    - This allows users to filter awards by organization type
*/

-- Add organization column
ALTER TABLE awards 
ADD COLUMN IF NOT EXISTS organization text NOT NULL DEFAULT 'BSA';

-- Add comment for clarity
COMMENT ON COLUMN awards.organization IS 'The organization that grants this award (e.g., BSA, Els for Autism, etc.)';

-- Clear all fake awards data
DELETE FROM awards;