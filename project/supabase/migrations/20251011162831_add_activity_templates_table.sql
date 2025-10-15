/*
  # Add Activity Templates Table

  1. New Table
    - activity_templates - Pre-built templates for meetings and campouts
      - id, template_name, template_type (meeting/campout)
      - description, template_data (jsonb)
      - is_public, created_by
      - created_at

  2. Security
    - Enable RLS
    - Anyone can view public templates
    - Users can create and manage their own templates

  3. Sample Data
    - Add helpful starter templates for common activities
*/

-- Create activity_templates table
CREATE TABLE IF NOT EXISTS activity_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  template_type text NOT NULL CHECK (template_type IN ('meeting', 'campout')),
  description text NOT NULL,
  template_data jsonb NOT NULL DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view public templates"
  ON activity_templates FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create templates"
  ON activity_templates FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own templates"
  ON activity_templates FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON activity_templates FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_templates_type ON activity_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_activity_templates_public ON activity_templates(is_public);

-- Insert sample templates
INSERT INTO activity_templates (template_name, template_type, description, template_data, is_public) VALUES
('First Meeting - Getting to Know You', 'meeting', 'A structured first meeting focusing on introductions and comfort', '{"duration": 90, "agenda": [{"time": "6:30 PM", "activity": "Opening Ceremony", "duration": 10}, {"time": "6:40 PM", "activity": "Name Games with Visual Aids", "duration": 20}, {"time": "7:00 PM", "activity": "Tour of Meeting Space", "duration": 15}, {"time": "7:15 PM", "activity": "Break Time", "duration": 10}, {"time": "7:25 PM", "activity": "Patrol Formation", "duration": 20}, {"time": "7:45 PM", "activity": "Closing & Next Meeting Preview", "duration": 15}], "accommodations": "Visual schedule posted. Quiet break space available. Name tags for all."}', true),
('Outdoor Skills Meeting', 'meeting', 'Hands-on outdoor skills with sensory considerations', '{"duration": 90, "agenda": [{"time": "6:30 PM", "activity": "Opening & Safety Review", "duration": 10}, {"time": "6:40 PM", "activity": "Knot Tying Stations", "duration": 30}, {"time": "7:10 PM", "activity": "Sensory Break", "duration": 10}, {"time": "7:20 PM", "activity": "Fire Building Demo", "duration": 25}, {"time": "7:45 PM", "activity": "Cleanup & Closing", "duration": 15}], "accommodations": "Multiple learning stations. Extra fidget tools. Step-by-step visual instructions."}', true),
('Weekend Family Campout', 'campout', 'Inclusive family camping with structured activities', '{"location": "Local Council Camp", "checklist": {"medical": true, "dietary": true, "accessible_paths": true, "quiet_space": true, "visual_schedule": true}, "notes": "Family-focused with shorter activities. Quiet hours enforced. Alternative indoor space available."}', true),
('Summer Adventure Camp', 'campout', 'Week-long camp with comprehensive accommodations', '{"location": "Summer Camp", "checklist": {"medication_plan": true, "dietary_plan": true, "accessible_facilities": true, "sensory_breaks": true, "buddy_system": true, "staff_training": true}, "notes": "Full week program. Daily sensory breaks scheduled. Communication plan with families. Advance tours available."}', true);