import React, { useState, useEffect } from 'react';
import { Save, FileText, Plus, Trash2 } from 'lucide-react';
import {
  createMeetingPlan,
  updateMeetingPlan,
  createAgendaItem,
  getAgendaItems,
  getMeetingPlans,
  MeetingPlan,
  MeetingAgendaItem,
} from '../services/planningService';

export function MeetingPlanner() {
  const [meetingDate, setMeetingDate] = useState('');
  const [duration, setDuration] = useState(90);
  const [attendance, setAttendance] = useState('');
  const [accommodations, setAccommodations] = useState('');
  const [agendaItems, setAgendaItems] = useState<Array<{time: string; activity: string; duration: number}>>([
    { time: '6:30 PM', activity: 'Opening Ceremony', duration: 10 },
  ]);
  const [savedPlans, setSavedPlans] = useState<MeetingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const plans = await getMeetingPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { time: '', activity: '', duration: 15 }]);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, field: string, value: any) => {
    const updated = [...agendaItems];
    updated[index] = { ...updated[index], [field]: value };
    setAgendaItems(updated);
  };

  const handleSave = async () => {
    if (!meetingDate) {
      setMessage('Please select a meeting date');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const plan = await createMeetingPlan({
        meeting_date: meetingDate,
        duration_minutes: duration,
        expected_attendance: attendance ? parseInt(attendance) : null,
        accommodation_notes: accommodations || null,
      });

      for (let i = 0; i < agendaItems.length; i++) {
        const item = agendaItems[i];
        if (item.activity) {
          await createAgendaItem({
            meeting_plan_id: plan.id,
            time: item.time || '',
            activity_name: item.activity,
            duration_minutes: item.duration,
            notes: null,
            order_index: i,
          });
        }
      }

      setMessage('Meeting plan saved successfully!');
      await loadSavedPlans();

      // Reset form
      setMeetingDate('');
      setDuration(90);
      setAttendance('');
      setAccommodations('');
      setAgendaItems([{ time: '6:30 PM', activity: 'Opening Ceremony', duration: 10 }]);
    } catch (error: any) {
      console.error('Error saving plan:', error);
      setMessage(error.message || 'Error saving plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      <h2 className="planner-title">Meeting Planner</h2>
      <p className="planner-description">
        Build a structured meeting plan with timing, activities, and accommodations.
      </p>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="planner-form">
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-field-group">
            <div className="form-field">
              <label>Meeting Date</label>
              <input
                type="date"
                className="text-input"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Duration (minutes)</label>
              <input
                type="number"
                className="text-input"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 90)}
              />
            </div>
            <div className="form-field">
              <label>Expected Attendance</label>
              <input
                type="number"
                className="text-input"
                placeholder="Number of Scouts"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="form-section-title">Meeting Agenda</h3>
            <button onClick={addAgendaItem} className="btn btn-secondary btn-small">
              <Plus size={16} />
              Add Activity
            </button>
          </div>
          <div className="agenda-builder space-y-3">
            {agendaItems.map((item, index) => (
              <div key={index} className="agenda-item">
                <div className="agenda-time">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Time"
                    value={item.time}
                    onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
                  />
                </div>
                <div className="agenda-details">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Activity name"
                    value={item.activity}
                    onChange={(e) => updateAgendaItem(index, 'activity', e.target.value)}
                  />
                  <input
                    type="number"
                    className="text-input"
                    placeholder="Duration (min)"
                    value={item.duration}
                    onChange={(e) => updateAgendaItem(index, 'duration', parseInt(e.target.value) || 0)}
                  />
                </div>
                {agendaItems.length > 1 && (
                  <button
                    onClick={() => removeAgendaItem(index)}
                    className="btn btn-error btn-small"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Accommodation Notes</h3>
          <textarea
            className="textarea"
            rows={4}
            placeholder="List any specific accommodations needed (quiet space for breaks, fidget tools available, visual schedule posted, etc.)"
            value={accommodations}
            onChange={(e) => setAccommodations(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Meeting Plan'}
          </button>
        </div>
      </div>

      {savedPlans.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title">Saved Meeting Plans</h3>
          <div className="grid gap-4">
            {savedPlans.map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{plan.meeting_date}</h4>
                    <p className="text-sm text-muted">
                      {plan.duration_minutes} minutes
                      {plan.expected_attendance && ` • ${plan.expected_attendance} Scouts`}
                    </p>
                  </div>
                  <FileText size={20} className="text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
