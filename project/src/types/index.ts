// Core Types for Scout Inclusion Platform

export type UserRole = 'admin' | 'moderator' | 'leader' | 'parent' | 'scout';

export type DisabilityType =
  | 'autism'
  | 'adhd'
  | 'anxiety'
  | 'intellectual'
  | 'down-syndrome'
  | 'speech-language'
  | 'deaf-hoh'
  | 'blind-low-vision'
  | 'sensory-processing'
  | 'learning-disability'
  | 'diabetes'
  | 'allergies'
  | 'asthma'
  | 'epilepsy'
  | 'cerebral-palsy'
  | 'ptsd-trauma'
  | 'other';

export type Theme = 'campfire' | 'forest' | 'twilight' | 'classic';
export type ColorMode = 'light' | 'dark' | 'system';

export interface UserSettings {
  theme: Theme;
  colorMode: ColorMode;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  language: string;
}

export interface Council {
  id: string;
  name: string;
  location: string;
  website: string;
  specialNeedsPage?: string;
  country: string;
}

export interface Contact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  organization: string;
  website?: string;
}

export interface CalmPlan {
  id: string;
  scoutId: string;
  disabilityTypes: DisabilityType[];
  triggers: string[];
  calmStrategies: string[];
  emergencyContacts: Contact[];
  medications?: {
    name: string;
    dosage: string;
    timing: string;
    purpose: string;
  }[];
  dietaryNeeds?: string[];
  communicationPreferences: string[];
  sensoryNeeds: string[];
  buddyPreferences?: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'form' | 'guide' | 'contact' | 'article' | 'video';
  url: string;
  organization: string;
  disabilityTypes?: DisabilityType[];
  isPrintable: boolean;
  tags: string[];
}

export interface CalmLog {
  id: string;
  scoutId: string;
  date: string;
  type: 'meltdown' | 'calm-break' | 'success' | 'challenge';
  trigger?: string;
  strategyUsed?: string;
  effectiveness: 1 | 2 | 3 | 4 | 5;
  notes: string;
  duration?: number; // minutes
}

export interface AlternateRequirement {
  id: string;
  scoutId: string;
  requirementType: 'rank' | 'merit-badge' | 'leadership';
  originalRequirement: string;
  alternateApproach: string;
  approvedBy: string;
  approvalDate: string;
  documentation: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface AutismProfile {
  id: string;
  scoutId: string;
  communicationLevel: 'nonverbal' | 'limited-verbal' | 'verbal' | 'highly-verbal';
  supportLevel: 'level-1' | 'level-2' | 'level-3';
  strengths: string[];
  challenges: string[];
  specialInterests: string[];
  sensoryProfile: SensoryProfile;
  socialSupports: string[];
  learningStyle: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SensoryProfile {
  visual: SensoryPreference;
  auditory: SensoryPreference;
  tactile: SensoryPreference;
  vestibular: SensoryPreference;
  proprioceptive: SensoryPreference;
  gustatory: SensoryPreference;
  olfactory: SensoryPreference;
}

export interface SensoryPreference {
  sensitivity: 'hyposensitive' | 'typical' | 'hypersensitive';
  triggers: string[];
  seekingBehaviors: string[];
  accommodations: string[];
}

export interface VisualSchedule {
  id: string;
  scoutId: string;
  title: string;
  type: 'meeting' | 'campout' | 'event' | 'custom';
  items: ScheduleItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleItem {
  id: string;
  time?: string;
  title: string;
  description: string;
  duration?: number;
  icon?: string;
  imageUrl?: string;
  completed: boolean;
  order: number;
}

export interface MeltdownLog {
  id: string;
  scoutId: string;
  date: string;
  time: string;
  duration: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  location: string;
  triggers: string[];
  warningSigns: string[];
  interventionsUsed: string[];
  effectiveness: 1 | 2 | 3 | 4 | 5;
  recoveryTime: number;
  notes: string;
  followUpNeeded: boolean;
}

export interface CommunicationCard {
  id: string;
  scoutId: string;
  category: 'needs' | 'feelings' | 'activities' | 'people' | 'custom';
  text: string;
  imageUrl?: string;
  icon?: string;
  order: number;
}

export interface SocialStory {
  id: string;
  title: string;
  description: string;
  situation: string;
  disabilityTypes: DisabilityType[];
  pages: SocialStoryPage[];
  ageRange: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface SocialStoryPage {
  id: string;
  order: number;
  text: string;
  imageUrl?: string;
  notes?: string;
}
