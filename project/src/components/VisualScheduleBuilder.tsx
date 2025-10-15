import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  Image as ImageIcon,
  CheckCircle,
  Printer,
} from 'lucide-react';
import { VisualSchedule, ScheduleItem } from '../types';
import { TipsPanel } from './TipsPanel';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const commonActivities = [
  { title: 'Arrive & Check-in', icon: '👋', duration: 10 },
  { title: 'Opening Ceremony', icon: '🏕️', duration: 15 },
  { title: 'Skill Instruction', icon: '📚', duration: 30 },
  { title: 'Game Time', icon: '⚽', duration: 20 },
  { title: 'Break / Snack', icon: '🍎', duration: 15 },
  { title: 'Outdoor Activity', icon: '🌲', duration: 45 },
  { title: 'Clean Up', icon: '🧹', duration: 10 },
  { title: 'Closing & Departure', icon: '👋', duration: 15 },
];

interface VisualScheduleBuilderProps {
  scoutProfileId?: string;
}

export function VisualScheduleBuilder({ scoutProfileId }: VisualScheduleBuilderProps) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Partial<VisualSchedule>>({
    title: '',
    type: 'meeting',
    items: [],
    notes: '',
  });
  const [savedScheduleId, setSavedScheduleId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ScheduleItem> | null>(null);

  useEffect(() => {
    if (user && scoutProfileId) {
      loadSchedule();
    }
  }, [user, scoutProfileId]);

  const loadSchedule = async () => {
    try {
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('visual_schedules')
        .select('*')
        .eq('scout_profile_id', scoutProfileId)
        .maybeSingle();

      if (scheduleError) throw scheduleError;

      if (scheduleData) {
        setSavedScheduleId(scheduleData.id);

        const { data: itemsData, error: itemsError } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('schedule_id', scheduleData.id)
          .order('order_position');

        if (itemsError) throw itemsError;

        setSchedule({
          title: scheduleData.title,
          type: scheduleData.type,
          notes: scheduleData.notes || '',
          items: itemsData || [],
        });
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const saveSchedule = async () => {
    if (!user) {
      alert('Please sign in to save your schedule');
      return;
    }

    if (!schedule.title) {
      alert('Please enter a title for your schedule');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      let scheduleId = savedScheduleId;

      if (scheduleId) {
        const { error } = await supabase
          .from('visual_schedules')
          .update({
            title: schedule.title,
            type: schedule.type,
            notes: schedule.notes,
          })
          .eq('id', scheduleId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('visual_schedules')
          .insert({
            user_id: user.id,
            scout_profile_id: scoutProfileId || null,
            title: schedule.title,
            type: schedule.type,
            notes: schedule.notes,
          })
          .select()
          .single();
        if (error) throw error;
        scheduleId = data.id;
        setSavedScheduleId(scheduleId);
      }

      await supabase.from('schedule_items').delete().eq('schedule_id', scheduleId);

      if (schedule.items && schedule.items.length > 0) {
        const itemsToInsert = schedule.items.map((item) => ({
          schedule_id: scheduleId,
          title: item.title,
          description: item.description || '',
          time_slot: item.timeSlot || null,
          duration: item.duration || 0,
          icon: item.icon,
          image_url: item.imageUrl || null,
          order_position: item.order,
          completed: false,
        }));

        const { error } = await supabase.from('schedule_items').insert(itemsToInsert);
        if (error) throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (activity: typeof commonActivities[0]) => {
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}`,
      title: activity.title,
      description: '',
      duration: activity.duration,
      icon: activity.icon,
      completed: false,
      order: schedule.items?.length || 0,
    };

    setSchedule({
      ...schedule,
      items: [...(schedule.items || []), newItem],
    });
  };

  const removeItem = (id: string) => {
    setSchedule({
      ...schedule,
      items: schedule.items?.filter((item) => item.id !== id),
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!schedule.items) return;

    const newItems = [...schedule.items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newItems.length) return;

    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    newItems.forEach((item, i) => {
      item.order = i;
    });

    setSchedule({
      ...schedule,
      items: newItems,
    });
  };

  const updateItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedule({
      ...schedule,
      items: schedule.items?.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  return (
    <div className="visual-schedule-builder">
      <div className="builder-header">
        <h2 className="section-title">Visual Schedule Builder</h2>
        <p className="hero-description">
          Create picture schedules to help Scouts know what to expect and reduce anxiety about
          transitions. Visual schedules are especially helpful for Scouts with autism, ADHD, or
          anxiety.
        </p>
      </div>

      <div className="schedule-setup">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Schedule Title</label>
            <input
              type="text"
              className="text-input"
              placeholder="Example: Den Meeting, Campout Saturday, Eagle Project"
              value={schedule.title}
              onChange={(e) =>
                setSchedule({
                  ...schedule,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="select-input"
              value={schedule.type}
              onChange={(e) =>
                setSchedule({
                  ...schedule,
                  type: e.target.value as any,
                })
              }
            >
              <option value="meeting">Regular Meeting</option>
              <option value="campout">Campout</option>
              <option value="event">Special Event</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      <div className="builder-sections">
        <section className="builder-section">
          <h3 className="subsection-title">Add Activities</h3>
          <p className="section-description">
            Choose from common Scouting activities or create your own
          </p>

          <div className="activity-grid">
            {commonActivities.map((activity, index) => (
              <button key={index} onClick={() => addItem(activity)} className="activity-card">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-title">{activity.title}</div>
                <div className="activity-duration">
                  <Clock size={14} /> {activity.duration} min
                </div>
                <div className="activity-add">
                  <Plus size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {schedule.items && schedule.items.length > 0 && (
          <section className="builder-section">
            <h3 className="subsection-title">
              Schedule ({schedule.items.length}{' '}
              {schedule.items.length === 1 ? 'activity' : 'activities'})
            </h3>

            <div className="schedule-items">
              {schedule.items.map((item, index) => (
                <div key={item.id} className="schedule-item">
                  <div className="item-icon">{item.icon}</div>

                  <div className="item-details">
                    <div className="item-header">
                      <input
                        type="text"
                        className="item-title-input"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      />
                      <div className="item-duration">
                        <Clock size={14} />
                        <input
                          type="number"
                          className="duration-input"
                          value={item.duration}
                          onChange={(e) =>
                            updateItem(item.id, { duration: parseInt(e.target.value) })
                          }
                        />
                        min
                      </div>
                    </div>

                    <input
                      type="text"
                      className="item-description-input"
                      placeholder="Add details (optional)..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    />
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="btn-icon-small"
                      title="Move up"
                    >
                      <MoveUp size={16} />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === schedule.items!.length - 1}
                      className="btn-icon-small"
                      title="Move down"
                    >
                      <MoveDown size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn-icon-small btn-danger"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="schedule-summary">
              <strong>Total Duration:</strong>{' '}
              {schedule.items.reduce((sum, item) => sum + (item.duration || 0), 0)} minutes
            </div>
          </section>
        )}

        <section className="builder-section">
          <h3 className="subsection-title">Additional Notes</h3>
          <textarea
            className="textarea"
            rows={3}
            placeholder="Any special instructions or notes about this schedule..."
            value={schedule.notes}
            onChange={(e) =>
              setSchedule({
                ...schedule,
                notes: e.target.value,
              })
            }
          />
        </section>
      </div>

      <div className="builder-actions">
        <button
          className="btn btn-primary"
          onClick={saveSchedule}
          disabled={saving}
        >
          {saveSuccess ? (
            <>
              <CheckCircle size={20} />
              Saved!
            </>
          ) : (
            <>
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Schedule'}
            </>
          )}
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={20} />
          Print Schedule
        </button>
      </div>

      <TipsPanel category="visual-schedule" context="builder-start" />
    </div>
  );
}
