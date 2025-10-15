import { supabase } from '../lib/supabase';

export interface MeetingPlan {
  id: string;
  user_id: string;
  meeting_date: string;
  duration_minutes: number;
  expected_attendance: number | null;
  accommodation_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetingAgendaItem {
  id: string;
  meeting_plan_id: string;
  time: string;
  activity_name: string;
  duration_minutes: number | null;
  notes: string | null;
  order_index: number;
  created_at: string;
}

export interface CampoutPlan {
  id: string;
  user_id: string;
  campout_name: string;
  location: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampoutChecklistItem {
  id: string;
  campout_plan_id: string;
  category: string;
  item_text: string;
  is_checked: boolean;
  order_index: number;
  created_at: string;
}

export interface ActivityTemplate {
  id: string;
  template_name: string;
  template_type: 'meeting' | 'campout';
  description: string;
  template_data: any;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
}

// Meeting Plans
export async function createMeetingPlan(data: Omit<MeetingPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('meeting_plans')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateMeetingPlan(id: string, data: Partial<MeetingPlan>) {
  const { data: result, error } = await supabase
    .from('meeting_plans')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteMeetingPlan(id: string) {
  const { error } = await supabase
    .from('meeting_plans')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getMeetingPlans() {
  const { data, error } = await supabase
    .from('meeting_plans')
    .select('*')
    .order('meeting_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getMeetingPlan(id: string) {
  const { data, error } = await supabase
    .from('meeting_plans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Meeting Agenda Items
export async function createAgendaItem(data: Omit<MeetingAgendaItem, 'id' | 'created_at'>) {
  const { data: result, error } = await supabase
    .from('meeting_agenda_items')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateAgendaItem(id: string, data: Partial<MeetingAgendaItem>) {
  const { data: result, error } = await supabase
    .from('meeting_agenda_items')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteAgendaItem(id: string) {
  const { error } = await supabase
    .from('meeting_agenda_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAgendaItems(meetingPlanId: string) {
  const { data, error } = await supabase
    .from('meeting_agenda_items')
    .select('*')
    .eq('meeting_plan_id', meetingPlanId)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

// Campout Plans
export async function createCampoutPlan(data: Omit<CampoutPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('campout_plans')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateCampoutPlan(id: string, data: Partial<CampoutPlan>) {
  const { data: result, error } = await supabase
    .from('campout_plans')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteCampoutPlan(id: string) {
  const { error } = await supabase
    .from('campout_plans')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCampoutPlans() {
  const { data, error } = await supabase
    .from('campout_plans')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCampoutPlan(id: string) {
  const { data, error } = await supabase
    .from('campout_plans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Campout Checklist Items
export async function createChecklistItem(data: Omit<CampoutChecklistItem, 'id' | 'created_at'>) {
  const { data: result, error } = await supabase
    .from('campout_checklist_items')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateChecklistItem(id: string, data: Partial<CampoutChecklistItem>) {
  const { data: result, error } = await supabase
    .from('campout_checklist_items')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteChecklistItem(id: string) {
  const { error } = await supabase
    .from('campout_checklist_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getChecklistItems(campoutPlanId: string) {
  const { data, error } = await supabase
    .from('campout_checklist_items')
    .select('*')
    .eq('campout_plan_id', campoutPlanId)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

// Activity Templates
export async function getTemplates(type?: 'meeting' | 'campout') {
  let query = supabase
    .from('activity_templates')
    .select('*')
    .eq('is_public', true);

  if (type) {
    query = query.eq('template_type', type);
  }

  const { data, error } = await query.order('template_name');

  if (error) throw error;
  return data || [];
}

export async function createTemplate(data: Omit<ActivityTemplate, 'id' | 'created_at'>) {
  const { data: result, error } = await supabase
    .from('activity_templates')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}
