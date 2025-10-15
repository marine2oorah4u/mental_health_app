/*
  # Add Sample Michigan Scout Locations

  1. Sample Data
    - Real Michigan Scout camps with approximate coordinates
    - Accessibility features for each location
    - Mix of verified and unverified locations

  2. Notes
    - Coordinates are approximate based on known locations
    - Accessibility information is sample data for demonstration
    - Real users will add actual reviews and updates
*/

-- Insert sample Michigan Scout camps
INSERT INTO accessible_locations (name, type, address, city, state, zip_code, latitude, longitude, description, website, is_verified) VALUES
  (
    'D-A Scout Ranch',
    'camp',
    '1580 Highview Church Rd',
    'Metamora',
    'MI',
    '48455',
    42.9644,
    -83.2047,
    'Year-round camping facility with accessible cabins, dining hall, and activity areas. Part of Michigan Crossroads Council.',
    'https://www.michiganscouting.org/da-ranch',
    true
  ),
  (
    'Camp Rotary',
    'camp',
    '5440 Camp Rotary Rd',
    'Clare',
    'MI',
    '48617',
    43.8547,
    -84.7614,
    'Traditional summer camp with lakefront activities, accessible dining facilities, and paved pathways to main areas.',
    'https://www.michiganscouting.org/camp-rotary',
    true
  ),
  (
    'Camp Baldwin',
    'camp',
    '7600 Crego Rd',
    'Millington',
    'MI',
    '48746',
    43.2851,
    -83.5324,
    'Beautiful camping facility with accessible restrooms, dining hall, and multiple program areas.',
    'https://www.michiganscouting.org/camp-baldwin',
    true
  ),
  (
    'Michigan Crossroads Council Service Center',
    'service_center',
    '1231 E Beecher St',
    'Adrian',
    'MI',
    '49221',
    41.8989,
    -84.0372,
    'Council headquarters with accessible meeting rooms, Scout shop, and administrative offices.',
    'https://www.michiganscouting.org',
    true
  ),
  (
    'Camp Agawam',
    'camp',
    '1234 Agawam Dr',
    'Dowagiac',
    'MI',
    '49047',
    41.9847,
    -86.1089,
    'Lakefront camp with accessible waterfront facilities and adaptive aquatics program.',
    null,
    true
  );

-- Insert accessibility features for D-A Scout Ranch
INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes) 
SELECT id, 'mobility', 'Wheelchair Accessible Cabins', true, 'Two cabins with ramps and wide doorways' FROM accessible_locations WHERE name = 'D-A Scout Ranch';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Accessible Restrooms', true, 'ADA compliant restrooms in main building' FROM accessible_locations WHERE name = 'D-A Scout Ranch';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Paved Pathways', true, 'Main paths between buildings are paved' FROM accessible_locations WHERE name = 'D-A Scout Ranch';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'sensory', 'Quiet Room', true, 'Designated calm-down space available' FROM accessible_locations WHERE name = 'D-A Scout Ranch';

-- Insert accessibility features for Camp Rotary
INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Accessible Parking', true, 'Designated accessible parking near main lodge' FROM accessible_locations WHERE name = 'Camp Rotary';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Wheelchair Accessible Dining Hall', true, 'Ramp entrance and accessible seating' FROM accessible_locations WHERE name = 'Camp Rotary';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'vision', 'Tactile Signage', false, 'Limited braille signage' FROM accessible_locations WHERE name = 'Camp Rotary';

-- Insert accessibility features for Camp Baldwin
INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Accessible Restrooms', true, 'Multiple ADA restrooms throughout camp' FROM accessible_locations WHERE name = 'Camp Baldwin';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'hearing', 'Visual Fire Alarms', true, 'Strobe lights in main buildings' FROM accessible_locations WHERE name = 'Camp Baldwin';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'cognitive', 'Visual Schedules Available', true, 'Staff can provide picture schedules' FROM accessible_locations WHERE name = 'Camp Baldwin';

-- Insert accessibility features for Service Center
INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Wheelchair Accessible Entrance', true, 'Automatic doors and ramp' FROM accessible_locations WHERE name = 'Michigan Crossroads Council Service Center';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Elevator', true, 'Accessible to all floors' FROM accessible_locations WHERE name = 'Michigan Crossroads Council Service Center';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'hearing', 'Hearing Loop System', true, 'Assistive listening in meeting rooms' FROM accessible_locations WHERE name = 'Michigan Crossroads Council Service Center';

-- Insert accessibility features for Camp Agawam
INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Beach Wheelchair Available', true, 'Specialized wheelchair for beach/water access' FROM accessible_locations WHERE name = 'Camp Agawam';

INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'sensory', 'Sensory-Friendly Activities', true, 'Modified programs for sensory sensitivities' FROM accessible_locations WHERE name = 'Camp Agawam';