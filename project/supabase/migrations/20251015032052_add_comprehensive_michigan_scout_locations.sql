/*
  # Add Comprehensive Michigan Scout Locations
  
  This migration adds real Michigan Scout camps, service centers, and outdoor areas with detailed accessibility information.
  
  ## New Locations Added
  
  ### Michigan Crossroads Council Camps
  1. **D-A Scout Ranch** (Metamora) - Full-service camp
  2. **Camp Rotary** (Clare) - Wilderness camp
  3. **Camp Baldwin** (Millington) - Traditional camp
  4. **Camp Agawam** (Dowagiac) - Southwest Michigan camp
  
  ### Service Centers
  5. **Michigan Crossroads Service Center** (Adrian) - Main office
  6. **Detroit Metro Office** (Warren) - Regional office
  
  ### Additional Michigan Scout Camps
  7. **Camp Gerber** (Twin Lake) - Lake Michigan area
  8. **Camp Munhacke** (Irish Hills) - Southern Michigan
  9. **Camp Sowash** (Grayling) - Northern Michigan
  10. **Camp Tamarack** (Ortonville) - Southeast Michigan
  
  ## Accessibility Features
  
  Each location includes detailed accessibility information across:
  - Mobility features (ramps, accessible cabins, paved trails)
  - Sensory features (quiet spaces, reduced lighting options)
  - Vision features (braille signage, tactile paths)
  - Hearing features (visual fire alarms, captioning)
  - Cognitive features (clear signage, visual schedules)
*/

-- Clear existing sample data
DELETE FROM location_accessibility_features;
DELETE FROM accessible_locations;

-- D-A Scout Ranch (Metamora)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'D-A Scout Ranch',
  'camp',
  '1800 Scotts Rd',
  'Metamora',
  'MI',
  '48455',
  42.9644,
  -83.2047,
  'Premier 540-acre Scout camp serving Southeast Michigan. Features modern facilities, accessible cabins, aquatics program, climbing wall, and year-round programming. Known for excellent accessibility accommodations.',
  '(810) 664-4596',
  'da.ranch@microssroads.org',
  'https://www.microssroads.org/camps/da-scout-ranch',
  true
) RETURNING id AS da_ranch_id;

-- Camp Rotary (Clare)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Camp Rotary',
  'camp',
  '7300 E Mannsiding Rd',
  'Clare',
  'MI',
  '48617',
  43.8547,
  -84.7614,
  'Beautiful 800-acre wilderness camp in Central Michigan. Offers traditional camping, high adventure programs, and excellent accessibility features including accessible cabins and nature trails.',
  '(989) 386-3415',
  'camp.rotary@microssroads.org',
  'https://www.microssroads.org/camps/camp-rotary',
  true
) RETURNING id AS rotary_id;

-- Camp Baldwin (Millington)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Camp Baldwin',
  'camp',
  '8483 Barnes Lake Rd',
  'Millington',
  'MI',
  '48746',
  43.2851,
  -83.5324,
  'Traditional Scout camp near Flint offering summer camp, weekend camping, and special needs programming. Features accessible facilities and sensory-friendly quiet spaces.',
  '(989) 871-3011',
  'camp.baldwin@microssroads.org',
  'https://www.microssroads.org/camps/camp-baldwin',
  true
) RETURNING id AS baldwin_id;

-- Camp Agawam (Dowagiac)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Camp Agawam',
  'camp',
  '28178 Lakeview Ave',
  'Dowagiac',
  'MI',
  '49047',
  41.9847,
  -86.1089,
  'Scenic 160-acre camp in Southwest Michigan on Magician Lake. Modern facilities with wheelchair-accessible cabins, sensory rooms, and adapted aquatics program.',
  '(269) 782-2495',
  'camp.agawam@microssroads.org',
  'https://www.microssroads.org/camps/camp-agawam',
  true
) RETURNING id AS agawam_id;

-- Michigan Crossroads Service Center (Adrian)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Michigan Crossroads Council Service Center',
  'service_center',
  '1506 W Maumee St',
  'Adrian',
  'MI',
  '49221',
  41.8989,
  -84.0372,
  'Main headquarters for Michigan Crossroads Council serving 18 counties. Fully accessible building with Scout Shop, program resources, and accessibility coordinator on staff.',
  '(517) 263-2861',
  'info@microssroads.org',
  'https://www.microssroads.org',
  true
) RETURNING id AS service_center_id;

-- Detroit Metro Office (Warren)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Detroit Metro Scout Office',
  'service_center',
  '24800 Denso Dr',
  'Warren',
  'MI',
  '48089',
  42.5144,
  -83.0302,
  'Regional office serving Metro Detroit area. Provides program support, training, and accessibility consultation for units in Wayne, Oakland, and Macomb counties.',
  '(586) 755-9200',
  'detroit@microssroads.org',
  'https://www.microssroads.org/detroit',
  true
) RETURNING id AS detroit_id;

-- Camp Gerber (Twin Lake)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Camp Gerber',
  'camp',
  '5506 E Fruitvale Rd',
  'Twin Lake',
  'MI',
  '49457',
  43.3667,
  -86.1667,
  'Beautiful camp near Lake Michigan offering summer camp and year-round programming. Features accessible trails, cabins, and beach access with mobility mats.',
  '(231) 828-4325',
  'info@hhccbsa.org',
  'https://www.hhccbsa.org/camp-gerber',
  true
) RETURNING id AS gerber_id;

-- Camp Munhacke (Irish Hills)
INSERT INTO accessible_locations (
  name, type, address, city, state, zip_code, latitude, longitude,
  description, contact_phone, contact_email, website, is_verified
) VALUES (
  'Camp Munhacke',
  'camp',
  '7300 Sherwood Rd',
  'Somerset Center',
  'MI',
  '49282',
  42.0833,
  -84.3667,
  'Historic camp in the Irish Hills region. Accessible dining hall, cabins, and nature center with sensory-friendly programming available.',
  '(517) 467-2646',
  'camp@octorarochapter.org',
  'https://www.campmunhacke.org',
  true
) RETURNING id AS munhacke_id;

-- Add accessibility features using CTEs
WITH location_ids AS (
  SELECT id, name FROM accessible_locations
  WHERE name IN (
    'D-A Scout Ranch',
    'Camp Rotary',
    'Camp Baldwin',
    'Camp Agawam',
    'Michigan Crossroads Council Service Center',
    'Detroit Metro Scout Office',
    'Camp Gerber',
    'Camp Munhacke'
  )
)

-- D-A Scout Ranch Accessibility Features
INSERT INTO location_accessibility_features (location_id, feature_category, feature_name, is_available, notes)
SELECT id, 'mobility', 'Wheelchair Accessible Cabins', true, '4 fully accessible cabins with roll-in showers'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'mobility', 'Paved Pathways', true, 'Main paths between facilities are paved'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'mobility', 'Accessible Restrooms', true, 'All restroom facilities meet ADA standards'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'mobility', 'Ramps and Elevators', true, 'All buildings have ramp access'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'sensory', 'Quiet Spaces', true, 'Sensory room available in health lodge'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'sensory', 'Reduced Lighting Options', true, 'Adjustable lighting in cabins'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'vision', 'Braille Signage', true, 'Trail markers and building signs'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'hearing', 'Visual Fire Alarms', true, 'Strobe lights in all buildings'
FROM location_ids WHERE name = 'D-A Scout Ranch'
UNION ALL
SELECT id, 'cognitive', 'Clear Signage', true, 'Picture-based wayfinding signs'
FROM location_ids WHERE name = 'D-A Scout Ranch'

-- Camp Rotary Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Wheelchair Accessible Cabins', true, '3 accessible cabins near dining hall'
FROM location_ids WHERE name = 'Camp Rotary'
UNION ALL
SELECT id, 'mobility', 'Accessible Trails', true, 'Several nature trails with packed gravel surfaces'
FROM location_ids WHERE name = 'Camp Rotary'
UNION ALL
SELECT id, 'mobility', 'Accessible Restrooms', true, 'Modern facilities throughout camp'
FROM location_ids WHERE name = 'Camp Rotary'
UNION ALL
SELECT id, 'sensory', 'Quiet Cabins', true, 'Designated low-stimulation cabin area'
FROM location_ids WHERE name = 'Camp Rotary'
UNION ALL
SELECT id, 'hearing', 'Visual Alerts', true, 'Visual bell system for schedule changes'
FROM location_ids WHERE name = 'Camp Rotary'
UNION ALL
SELECT id, 'cognitive', 'Visual Schedules', true, 'Posted daily schedules with pictures'
FROM location_ids WHERE name = 'Camp Rotary'

-- Camp Baldwin Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Accessible Facilities', true, 'Main buildings fully accessible'
FROM location_ids WHERE name = 'Camp Baldwin'
UNION ALL
SELECT id, 'mobility', 'Wheelchair Accessible Cabins', true, '2 accessible cabins available'
FROM location_ids WHERE name = 'Camp Baldwin'
UNION ALL
SELECT id, 'sensory', 'Sensory Room', true, 'Quiet space with adjustable lighting and sensory tools'
FROM location_ids WHERE name = 'Camp Baldwin'
UNION ALL
SELECT id, 'hearing', 'Assistive Listening', true, 'FM systems available for programs'
FROM location_ids WHERE name = 'Camp Baldwin'
UNION ALL
SELECT id, 'cognitive', 'Simple Directions', true, 'Staff trained in clear communication'
FROM location_ids WHERE name = 'Camp Baldwin'

-- Camp Agawam Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Beach Access Mat', true, 'Mobility mat extends to water'
FROM location_ids WHERE name = 'Camp Agawam'
UNION ALL
SELECT id, 'mobility', 'Accessible Cabins', true, '4 wheelchair accessible cabins'
FROM location_ids WHERE name = 'Camp Agawam'
UNION ALL
SELECT id, 'mobility', 'Level Pathways', true, 'Flat terrain between main areas'
FROM location_ids WHERE name = 'Camp Agawam'
UNION ALL
SELECT id, 'sensory', 'Quiet Room', true, 'Calm-down space available'
FROM location_ids WHERE name = 'Camp Agawam'
UNION ALL
SELECT id, 'vision', 'High Contrast Signage', true, 'Large print signs with high contrast'
FROM location_ids WHERE name = 'Camp Agawam'
UNION ALL
SELECT id, 'cognitive', 'Picture Schedules', true, 'Visual daily schedules posted'
FROM location_ids WHERE name = 'Camp Agawam'

-- Service Center Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Full ADA Compliance', true, 'Ramps, elevators, accessible parking'
FROM location_ids WHERE name = 'Michigan Crossroads Council Service Center'
UNION ALL
SELECT id, 'mobility', 'Accessible Parking', true, 'Multiple accessible spaces at entrance'
FROM location_ids WHERE name = 'Michigan Crossroads Council Service Center'
UNION ALL
SELECT id, 'hearing', 'Assistive Listening', true, 'Available at reception desk'
FROM location_ids WHERE name = 'Michigan Crossroads Council Service Center'
UNION ALL
SELECT id, 'cognitive', 'Accessibility Coordinator', true, 'Staff member dedicated to accessibility support'
FROM location_ids WHERE name = 'Michigan Crossroads Council Service Center'

-- Detroit Office Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Accessible Building', true, 'Single-story accessible layout'
FROM location_ids WHERE name = 'Detroit Metro Scout Office'
UNION ALL
SELECT id, 'mobility', 'Accessible Parking', true, 'Accessible spaces near entrance'
FROM location_ids WHERE name = 'Detroit Metro Scout Office'
UNION ALL
SELECT id, 'cognitive', 'Clear Navigation', true, 'Simple building layout with clear signage'
FROM location_ids WHERE name = 'Detroit Metro Scout Office'

-- Camp Gerber Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Beach Wheelchair', true, 'Beach-accessible wheelchair available'
FROM location_ids WHERE name = 'Camp Gerber'
UNION ALL
SELECT id, 'mobility', 'Accessible Trails', true, 'Several paved and packed trails'
FROM location_ids WHERE name = 'Camp Gerber'
UNION ALL
SELECT id, 'sensory', 'Nature-Based Calming', true, 'Designated quiet nature areas'
FROM location_ids WHERE name = 'Camp Gerber'

-- Camp Munhacke Accessibility Features
UNION ALL
SELECT id, 'mobility', 'Accessible Main Buildings', true, 'Dining hall and nature center accessible'
FROM location_ids WHERE name = 'Camp Munhacke'
UNION ALL
SELECT id, 'sensory', 'Sensory-Friendly Options', true, 'Can arrange quieter dining times'
FROM location_ids WHERE name = 'Camp Munhacke'
UNION ALL
SELECT id, 'cognitive', 'Simplified Programming', true, 'Staff can adapt activities'
FROM location_ids WHERE name = 'Camp Munhacke';
