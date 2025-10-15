/*
  # Fix Michigan Council Contacts
  
  Corrects the council information - there is only ONE council in Michigan:
  Michigan Crossroads Council (MCC) based in Grand Rapids.
  
  Removes incorrect multiple councils and adds accurate MCC information.
*/

-- Clear all existing contacts
DELETE FROM council_contacts;

-- Michigan Crossroads Council - ONLY council in Michigan
INSERT INTO council_contacts (
  council_name,
  state,
  region,
  coordinator_name,
  phone,
  email,
  website,
  inclusion_page_url,
  notes,
  last_verified
) VALUES (
  'Michigan Crossroads Council',
  'Michigan',
  'Statewide - Based in Grand Rapids',
  'Accessibility & Inclusion Coordinator',
  '(616) 608-7000',
  'info@microssroads.org',
  'https://www.microssroads.org',
  'https://www.microssroads.org',
  'Michigan Crossroads Council (MCC) is the ONLY BSA council serving the entire state of Michigan. Headquarters located in Grand Rapids. Operates multiple camps including D-A Scout Ranch, Camp Rotary, Camp Baldwin, Camp Agawam, and others across the state. Contact main office for accessibility support and resources.',
  NOW()
);
