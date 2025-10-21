/*
  # Update Companion Appearance for Animals

  1. Changes
    - Update companion_type to support only 'animal'
    - Update species to support cat, dog, bird, bunny
    - Remove orb and humanoid options

  2. Notes
    - Existing users will default to 'cat'
*/

-- Update companion_type check constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'companion_appearance_companion_type_check'
    AND table_name = 'companion_appearance'
  ) THEN
    ALTER TABLE companion_appearance DROP CONSTRAINT companion_appearance_companion_type_check;
  END IF;
END $$;

ALTER TABLE companion_appearance
ADD CONSTRAINT companion_appearance_companion_type_check
CHECK (companion_type = 'animal');

-- Update species check constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'companion_appearance_species_check'
    AND table_name = 'companion_appearance'
  ) THEN
    ALTER TABLE companion_appearance DROP CONSTRAINT companion_appearance_species_check;
  END IF;
END $$;

ALTER TABLE companion_appearance
ADD CONSTRAINT companion_appearance_species_check
CHECK (species IN ('cat', 'dog', 'bird', 'bunny'));

-- Update existing records to use animal type with cat as default
UPDATE companion_appearance
SET companion_type = 'animal',
    species = COALESCE(NULLIF(species, 'default'), 'cat')
WHERE companion_type != 'animal';

-- Set default values
ALTER TABLE companion_appearance
ALTER COLUMN companion_type SET DEFAULT 'animal';

ALTER TABLE companion_appearance
ALTER COLUMN species SET DEFAULT 'cat';
