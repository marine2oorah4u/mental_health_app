import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  Zap,
  CheckCircle,
  Save,
} from 'lucide-react';
import { MeltdownLog } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MeltdownTrackerProps {
  scoutProfileId?: string;
}

export function MeltdownTracker({ scoutProfileId }: MeltdownTrackerProps) {
  const { user } = useAuth();
  const [log, setLog] = useState<Partial<MeltdownLog>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    intensity: 3,
    triggers: [],
    warningSigns: [],
    interventionsUsed: [],
    effectiveness: 3,
    followUpNeeded: false,
  });

  const [customTrigger, setCustomTrigger] = useState('');
  const [customWarning, setCustomWarning] = useState('');
  const [customIntervention, setCustomIntervention] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const saveLog = async () => {
    if (!user) {
      alert('Please sign in to save your log entry');
      return;
    }

    if (!log.date || !log.time) {
      alert('Please enter date and time');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const logData = {
        user_id: user.id,
        scout_profile_id: scoutProfileId || null,
        date: log.date!,
        time: log.time!,
        duration: log.duration || 0,
        intensity: log.intensity || 3,
        location: log.location || '',
        triggers: log.triggers || [],
        warning_signs: log.warningSigns || [],
        interventions_used: log.interventionsUsed || [],
        effectiveness: log.effectiveness || 3,
        recovery_time: log.recoveryTime || 0,
        notes: log.notes || '',
        follow_up_needed: log.followUpNeeded || false,
      };

      const { error } = await supabase.from('meltdown_logs').insert(logData);
      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setLog({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          intensity: 3,
          triggers: [],
          warningSigns: [],
          interventionsUsed: [],
          effectiveness: 3,
          followUpNeeded: false,
        });
      }, 2000);
    } catch (error) {
      console.error('Error saving meltdown log:', error);
      alert('Failed to save log entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const commonTriggers = [
    'Loud noises',
    'Crowded space',
    'Unexpected change',
    'Transition between activities',
    'Too much stimulation',
    'Time pressure',
    'Unfamiliar people',
    'Physical discomfort',
    'Hunger/thirst',
    'Fatigue',
  ];

  const commonWarningSigns = [
    'Increased stimming',
    'Hand flapping',
    'Pacing',
    'Verbal repetition',
    'Covering ears',
    'Rocking',
    'Withdrawing',
    'Increased volume',
    'Agitation',
    'Difficulty focusing',
  ];

  const commonInterventions = [
    'Quiet break area',
    'Deep breathing',
    'Weighted blanket',
    'Fidget tools',
    'Headphones',
    'Physical movement',
    'Sensory break',
    'Change of scenery',
    'Reduced demands',
    'One-on-one support',
  ];

  const toggleArrayItem = (
    array: string[] | undefined,
    item: string,
    key: keyof MeltdownLog
  ) => {
    const current = array || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    setLog({ ...log, [key]: updated });
  };

  const addCustomItem = (
    item: string,
    key: keyof MeltdownLog,
    clearFn: (value: string) => void
  ) => {
    if (item.trim()) {
      const current = (log[key] as string[]) || [];
      setLog({ ...log, [key]: [...current, item.trim()] });
      clearFn('');
    }
  };

  return (
    <div className="meltdown-tracker">
      <div className="alert-box alert-warning mb-6">
        <AlertCircle size={24} />
        <div>
          <strong>Medical Disclaimer:</strong> This tracking tool is for informational and organizational
          purposes only. It does not replace professional assessment or treatment. Consult with qualified
          healthcare providers about concerning patterns or behaviors. In emergencies, call 911 immediately.
        </div>
      </div>

      <div className="builder-header">
        <h2 className="section-title">Meltdown Tracker</h2>
        <p className="hero-description">
          Track meltdowns and overwhelming moments to identify patterns, triggers, and effective
          interventions. This data helps you and leaders provide better support over time.
        </p>
      </div>

      <div className="builder-sections">
        <section className="builder-section">
          <h3 className="subsection-title">When & Where</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} /> Date
              </label>
              <input
                type="date"
                className="text-input"
                value={log.date}
                onChange={(e) => setLog({ ...log, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} /> Time
              </label>
              <input
                type="time"
                className="text-input"
                value={log.time}
                onChange={(e) => setLog({ ...log, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} /> Location
            </label>
            <input
              type="text"
              className="text-input"
              placeholder="Where did this occur? (e.g., Meeting room, Campfire area, Parking lot)"
              value={log.location}
              onChange={(e) => setLog({ ...log, location: e.target.value })}
            />
          </div>
        </section>

        <section className="builder-section">
          <h3 className="subsection-title">Intensity & Duration</h3>

          <div className="form-group">
            <label className="form-label">Intensity Level: {log.intensity}/5</label>
            <div className="intensity-scale">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setLog({ ...log, intensity: level as any })}
                  className={`intensity-button intensity-${level} ${
                    log.intensity === level ? 'active' : ''
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="intensity-labels">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="text-input"
                placeholder="How long did it last?"
                value={log.duration || ''}
                onChange={(e) => setLog({ ...log, duration: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recovery Time (minutes)</label>
              <input
                type="number"
                className="text-input"
                placeholder="Time to fully calm down"
                value={log.recoveryTime || ''}
                onChange={(e) => setLog({ ...log, recoveryTime: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </section>

        <section className="builder-section">
          <div className="section-header">
            <Zap size={24} className="section-icon" />
            <h3 className="subsection-title">Triggers</h3>
          </div>
          <p className="section-description">What seemed to cause or contribute to the meltdown?</p>

          <div className="tag-list">
            {commonTriggers.map((trigger) => (
              <button
                key={trigger}
                onClick={() => toggleArrayItem(log.triggers, trigger, 'triggers')}
                className={`tag ${log.triggers?.includes(trigger) ? 'tag-selected' : ''}`}
              >
                {trigger}
              </button>
            ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="text-input"
              placeholder="Add custom trigger..."
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && addCustomItem(customTrigger, 'triggers', setCustomTrigger)
              }
            />
          </div>
        </section>

        <section className="builder-section">
          <div className="section-header">
            <AlertCircle size={24} className="section-icon" />
            <h3 className="subsection-title">Warning Signs</h3>
          </div>
          <p className="section-description">
            What behaviors did you notice before the meltdown escalated?
          </p>

          <div className="tag-list">
            {commonWarningSigns.map((sign) => (
              <button
                key={sign}
                onClick={() => toggleArrayItem(log.warningSigns, sign, 'warningSigns')}
                className={`tag ${log.warningSigns?.includes(sign) ? 'tag-selected' : ''}`}
              >
                {sign}
              </button>
            ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="text-input"
              placeholder="Add custom warning sign..."
              value={customWarning}
              onChange={(e) => setCustomWarning(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' &&
                addCustomItem(customWarning, 'warningSigns', setCustomWarning)
              }
            />
          </div>
        </section>

        <section className="builder-section">
          <div className="section-header">
            <CheckCircle size={24} className="section-icon" />
            <h3 className="subsection-title">Interventions Used</h3>
          </div>
          <p className="section-description">What strategies did you try?</p>

          <div className="tag-list">
            {commonInterventions.map((intervention) => (
              <button
                key={intervention}
                onClick={() =>
                  toggleArrayItem(log.interventionsUsed, intervention, 'interventionsUsed')
                }
                className={`tag ${log.interventionsUsed?.includes(intervention) ? 'tag-selected' : ''}`}
              >
                {intervention}
              </button>
            ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="text-input"
              placeholder="Add custom intervention..."
              value={customIntervention}
              onChange={(e) => setCustomIntervention(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' &&
                addCustomItem(customIntervention, 'interventionsUsed', setCustomIntervention)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Overall Effectiveness: {log.effectiveness}/5</label>
            <div className="effectiveness-scale">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setLog({ ...log, effectiveness: level as any })}
                  className={`effectiveness-button ${log.effectiveness === level ? 'active' : ''}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="effectiveness-labels">
              <span>Not helpful</span>
              <span>Somewhat helpful</span>
              <span>Very helpful</span>
            </div>
          </div>
        </section>

        <section className="builder-section">
          <h3 className="subsection-title">Additional Notes</h3>

          <div className="form-group">
            <textarea
              className="textarea"
              rows={4}
              placeholder="Any other details, context, or observations..."
              value={log.notes}
              onChange={(e) => setLog({ ...log, notes: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={log.followUpNeeded}
                onChange={(e) => setLog({ ...log, followUpNeeded: e.target.checked })}
              />
              <span>Follow-up needed (check with doctor, therapist, or adjust calm plan)</span>
            </label>
          </div>
        </section>
      </div>

      <div className="builder-actions">
        <button
          className="btn btn-primary"
          onClick={saveLog}
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
              {saving ? 'Saving...' : 'Save Log Entry'}
            </>
          )}
        </button>
        <button className="btn btn-secondary">
          <TrendingUp size={20} />
          View Patterns
        </button>
      </div>
    </div>
  );
}
