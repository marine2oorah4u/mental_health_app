/*
  # Clear Council Contacts Sample Data

  1. Purpose
    - Remove all sample/outdated council contact data
    - Michigan now only has Michigan Crossroads Council (Gerald R Ford and Detroit Area no longer exist)
    - Allow admin to add accurate council contacts later
    - Will display "Coming Soon" message when empty

  2. Action
    - Delete all existing council contact records
*/

-- Delete all council contact records
DELETE FROM council_contacts;