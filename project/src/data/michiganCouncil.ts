// Michigan Crossroads Council Information
import { Council, Contact, Resource } from '../types';

export const michiganCrossroadsCouncil: Council = {
  id: 'michigan-crossroads',
  name: 'Michigan Crossroads Council',
  location: 'Michigan',
  website: 'https://michiganscouting.org',
  specialNeedsPage: 'https://michiganscouting.org/unit-resources/scouts-with-special-needs/',
  country: 'USA',
};

export const michiganContacts: Contact[] = [
  {
    name: 'Special Needs Committee',
    role: 'Committee',
    organization: 'Michigan Crossroads Council',
    website: 'https://michiganscouting.org/unit-resources/scouts-with-special-needs/',
  },
  {
    name: 'Council Service Center',
    role: 'General Support',
    email: 'info@michiganscouting.org',
    phone: '(734) 677-5208',
    organization: 'Michigan Crossroads Council',
    website: 'https://michiganscouting.org',
  },
];

export const michiganResources: Resource[] = [
  {
    id: 'michigan-special-needs',
    title: 'Scouts with Special Needs Resources',
    description: 'Michigan Crossroads Council special needs support page',
    category: 'article',
    url: 'https://michiganscouting.org/unit-resources/scouts-with-special-needs/',
    organization: 'Michigan Crossroads Council',
    isPrintable: false,
    tags: ['local', 'michigan', 'special-needs', 'resources'],
  },
];
