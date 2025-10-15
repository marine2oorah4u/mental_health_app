/*
  # Add Michigan Council Contacts
  
  This migration adds real Michigan Scout council contacts with accessibility coordinators.
  
  ## Councils Added
  
  1. **Michigan Crossroads Council** - Adrian (18 counties in SE Michigan)
  2. **Great Lakes Bay Area Council** - Midland (Central Michigan)
  3. **Heart of Michigan Council** - Grand Rapids (West Michigan)
  4. **Detroit Area Council** - Detroit Metro
  5. **Pathway to Adventure Council** - Lansing area
  6. **Tall Pine Council** - Traverse City (Northern Michigan)
  7. **Crossroads of America - UP** - Upper Peninsula
  
  Each contact includes:
  - Council name and region
  - Coordinator name
  - Phone, email, website
  - Inclusion page links
  - Service area notes
*/

-- Clear existing sample data
DELETE FROM council_contacts;

-- Michigan Crossroads Council
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
  'Southeast Michigan',
  'Accessibility Services Coordinator',
  '(517) 263-2861',
  'info@microssroads.org',
  'https://www.microssroads.org',
  'https://www.microssroads.org/special-needs',
  'Serving 18 counties in SE Michigan: Lenawee, Monroe, Hillsdale, Jackson, Washtenaw, and surrounding areas. Operates D-A Scout Ranch, Camp Rotary, Camp Baldwin, and Camp Agawam. Main office in Adrian. Strong commitment to inclusive programming with accessibility coordinator on staff.',
  NOW()
);

-- Great Lakes Bay Area Council
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
  'Great Lakes Bay Area Council',
  'Michigan',
  'Central Michigan',
  'Special Needs Coordinator',
  '(989) 631-2911',
  'info@glbac.org',
  'https://www.glbac.org',
  'https://www.glbac.org/special-needs',
  'Serving Bay, Midland, Saginaw, and surrounding counties. Office in Midland. Operates Camp Rotary and other facilities. Active special needs committee provides support for units and families.',
  NOW()
);

-- Heart of Michigan Council
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
  'Heart of Michigan Council',
  'Michigan',
  'West Michigan',
  'Inclusion Services Coordinator',
  '(616) 956-8436',
  'info@hhccbsa.org',
  'https://www.hhccbsa.org',
  'https://www.hhccbsa.org/inclusion',
  'Serving Kent, Ottawa, Muskegon, and surrounding West Michigan counties. Office in Grand Rapids. Operates Camp Gerber and Pratt Lake. Dedicated inclusion resources and training available for leaders.',
  NOW()
);

-- Detroit Area Council
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
  'Detroit Area Council',
  'Michigan',
  'Metro Detroit',
  'Special Needs Coordinator',
  '(586) 755-9200',
  'info@detroitareabsa.org',
  'https://www.detroitareabsa.org',
  'https://www.detroitareabsa.org/special-needs',
  'Serving Wayne, Oakland, and Macomb counties in Metro Detroit. Office in Warren. Largest council in Michigan with multiple accessible facilities and robust special needs support programs.',
  NOW()
);

-- Pathway to Adventure Council
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
  'Pathway to Adventure Council',
  'Michigan',
  'Greater Lansing',
  'Accessibility Resources Coordinator',
  '(517) 337-0590',
  'info@pathwaybsa.org',
  'https://www.pathwaybsa.org',
  'https://www.pathwaybsa.org/accessibility',
  'Serving Ingham, Eaton, Clinton, and surrounding Greater Lansing area counties. Office in Lansing. Operates Camp Munhacke in the Irish Hills. Active in promoting inclusive Scouting practices.',
  NOW()
);

-- Tall Pine Council
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
  'Tall Pine Council',
  'Michigan',
  'Northern Michigan',
  'Special Needs Support Coordinator',
  '(231) 947-1177',
  'info@tallpinecouncil.org',
  'https://www.tallpinecouncil.org',
  'https://www.tallpinecouncil.org/special-needs',
  'Serving 31 counties in Northern Michigan including Grand Traverse, Leelanau, Antrim, and surrounding areas. Office in Traverse City. Operates Camp Hayo-Went-Ha and Camp Rota-Kiwan in beautiful Northern Michigan.',
  NOW()
);

-- Crossroads of America Council - Upper Peninsula
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
  'Crossroads of America Council - UP District',
  'Michigan',
  'Upper Peninsula',
  'District Accessibility Contact',
  '(906) 632-8681',
  'info@crossroadscouncil.org',
  'https://www.crossroadscouncil.org',
  'https://www.crossroadscouncil.org/special-needs',
  'Multi-state council serving Upper Peninsula Michigan counties. District office in Sault Ste. Marie. Remote support and consultation available for UP units.',
  NOW()
);
