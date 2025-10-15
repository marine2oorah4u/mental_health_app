/*
  # Add Sample Awards Data with Images

  1. Sample Data
    - Add recognizable Scouting awards with images and detailed information
    - Include Unit Excellence, Distinguished Persons, and other common awards
    - Add image URLs from Pexels for award ceremony scenes
    
  2. Purpose
    - Provide users with example awards to browse
    - Demonstrate the awards system with realistic data
    - Show how awards can recognize inclusive Scouting practices
*/

-- Insert sample awards data
INSERT INTO awards (name, designation, description, eligibility, requirements, application_process, level, category, is_active, image_url, nomination_url) VALUES

-- National Awards
('Unit of Excellence Award', 'Recognizes outstanding unit programming', E'The Unit of Excellence Award recognizes Cub Scout packs, Scouts BSA troops, and Venturing crews that demonstrate exceptional commitment to quality programming, advancement, outdoor activities, and inclusive practices.\n\nThis award celebrates units that go above and beyond in creating welcoming environments where all Scouts can thrive, regardless of ability or background.', 
'Open to all registered Cub Scout packs, Scouts BSA troops, and Venturing crews in good standing with at least 12 months of active operation.', 
E'Units must demonstrate excellence across multiple areas:\n• Active youth membership growth\n• Strong advancement rates\n• Regular outdoor activities and campouts\n• Youth leadership development\n• Community service projects\n• Inclusive practices for Scouts with disabilities\n• Trained adult leadership\n• Financial responsibility\n\nUnits must meet at least 80% of the requirements in their program category.', 
E'1. Review the Unit of Excellence criteria for your program (Cub Scouts, Scouts BSA, or Venturing)\n2. Complete the self-assessment form\n3. Gather documentation of activities and achievements\n4. Submit application to your local council by the deadline (typically December)\n5. Council reviews and forwards qualifying units to national\n6. Awards are announced in early spring', 
'national', 'unit', true, 
'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600', 
null),

('Disability Awareness and Inclusion Award', 'For units championing accessibility', E'This award honors Cub Scout packs, Scouts BSA troops, and Venturing crews that actively work to make Scouting accessible and welcoming for youth with disabilities and special needs.\n\nRecipients demonstrate commitment to inclusion through adapted activities, accommodations, training, and creating a culture where every Scout belongs.', 
'Open to all registered units (packs, troops, crews) that have made significant efforts toward disability inclusion within the past 12 months.', 
E'Units must demonstrate:\n• At least one Scout with a documented disability actively participating\n• Modified activities or reasonable accommodations provided\n• Adult leaders completed disability awareness training\n• Inclusive recruitment and retention practices\n• Collaboration with families and specialists\n• Documentation of successful inclusion strategies\n• Positive impact on Scouts with disabilities\n\nProvide specific examples of accommodations, adaptations, and outcomes.', 
E'1. Complete the online application form\n2. Provide a written narrative (1-2 pages) describing your unit\'s inclusion efforts\n3. Include photos or documentation of adapted activities\n4. Submit letters of support from families of Scouts with disabilities\n5. Have your unit commissioner or district executive verify the information\n6. Submit to your council\'s special needs committee by the deadline\n7. Council forwards nominations to regional committee\n8. Recipients announced at council recognition events', 
'national', 'unit', true, 
'https://images.pexels.com/photos/7282009/pexels-photo-7282009.jpeg?auto=compress&cs=tinysrgb&w=600', 
null),

('Silver Beaver Award', 'Council-level distinguished service', E'The Silver Beaver Award is Scouting\'s highest council-level recognition for registered adult volunteers. It honors individuals who have provided exceptional service to youth in their council.\n\nRecipients may include those who have made outstanding contributions to disability inclusion, adaptive programming, or removing barriers for Scouts with special needs.', 
'Registered adult Scouters who have provided noteworthy service to youth at the council level for at least 5 years.', 
E'Nominees must demonstrate:\n• Distinguished service over an extended period\n• Significant impact on the council and its programs\n• Service beyond their primary role\n• Character, leadership, and dedication\n• Commitment to Scouting\'s mission and values\n\nService specifically related to disability inclusion and accessibility is highly valued.', 
E'1. Nomination by a registered Scouter (not self-nomination)\n2. Complete detailed nomination form with specific examples\n3. Provide comprehensive documentation of service\n4. Include letters of support from those impacted\n5. Submit to council advancement committee by deadline\n6. Council committee reviews and selects recipients\n7. Limited number awarded annually per council\n8. Presented at council recognition event', 
'council', 'individual_adult', true, 
'https://images.pexels.com/photos/8613092/pexels-photo-8613092.jpeg?auto=compress&cs=tinysrgb&w=600', 
null),

('Heroism Award', 'For saving or attempting to save a life', E'The Heroism Award recognizes youth or adults who demonstrate unusual heroism and skill in saving or attempting to save a life at the risk of their own.\n\nThis award celebrates the brave actions of Scouts and Scouters, including those with disabilities who perform acts of heroism, demonstrating that courage knows no boundaries.', 
'Any registered youth member or adult leader who performs an act of heroism.', 
E'The individual must:\n• Demonstrate unusual heroism and resourcefulness\n• Save or attempt to save a life at risk to their own\n• Use Scout skills and training appropriately\n• Act decisively in an emergency situation\n\nThe act must be thoroughly documented with witness statements and official reports.', 
E'1. Document the incident in detail immediately after it occurs\n2. Gather witness statements and official reports (police, fire, medical)\n3. Complete the official Heroism Award application\n4. Include newspaper articles or media coverage if available\n5. Submit through your council to national within 90 days of incident\n6. National committee reviews and approves\n7. Award presented at appropriate ceremony', 
'national', 'individual_youth', true, 
'https://images.pexels.com/photos/7551674/pexels-photo-7551674.jpeg?auto=compress&cs=tinysrgb&w=600', 
null),

('Inclusive Excellence Recognition', 'For leaders who champion accessibility', E'This recognition honors individual adult leaders who have made exceptional contributions to creating inclusive Scouting environments for youth with disabilities.\n\nRecipients demonstrate dedication to learning, adapting, advocating, and implementing best practices in disability inclusion.', 
'Registered adult Scouters serving in any capacity who have shown outstanding commitment to inclusion over at least 2 years.', 
E'Nominees must show:\n• Completed disability awareness and inclusion training\n• Consistently adapted activities for Scouts with disabilities\n• Mentored other leaders in inclusive practices\n• Advocated for accessibility in unit and council programs\n• Built strong partnerships with families and specialists\n• Demonstrated measurable impact on Scouts with special needs\n\nProvide specific examples with documented outcomes.', 
E'1. Nomination by unit leader, commissioner, or council volunteer\n2. Complete nomination form with detailed narrative\n3. Include documentation of training and activities\n4. Provide letters from families and professionals\n5. Submit photos/videos of inclusive programming\n6. Council special needs committee reviews\n7. Recipients recognized at council events\n8. May be submitted for regional consideration', 
'council', 'individual_adult', true, 
'https://images.pexels.com/photos/8613258/pexels-photo-8613258.jpeg?auto=compress&cs=tinysrgb&w=600', 
null);

-- Note: Image URLs from Pexels showing award ceremonies, recognition events, and Scout activities
-- These are free stock photos that represent the spirit of recognition and achievement