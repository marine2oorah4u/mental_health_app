import React, { useState, useEffect } from 'react';
import {
  Heart,
  AlertTriangle,
  Smile,
  Phone,
  Pill,
  Users,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Printer,
} from 'lucide-react';
import { CalmPlan } from '../types';
import { TipsPanel } from './TipsPanel';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CalmPlanBuilderProps {
  scoutProfileId?: string;
}

export function CalmPlanBuilder({ scoutProfileId }: CalmPlanBuilderProps) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Partial<CalmPlan>>({
    triggers: [],
    calmStrategies: [],
    emergencyContacts: [],
    medications: [],
    dietaryNeeds: [],
    communicationPreferences: [],
    sensoryNeeds: [],
    buddyPreferences: [],
    notes: '',
  });
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user && scoutProfileId) {
      loadCalmPlan();
    }
  }, [user, scoutProfileId]);

  const loadCalmPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('calm_plans')
        .select('*')
        .eq('scout_profile_id', scoutProfileId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSavedPlanId(data.id);
        setPlan({
          triggers: data.triggers || [],
          calmStrategies: data.calm_strategies || [],
          communicationPreferences: data.communication_preferences || [],
          sensoryNeeds: data.sensory_needs || [],
          buddyPreferences: data.buddy_preferences || [],
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Error loading calm plan:', error);
    }
  };

  const saveCalmPlan = async () => {
    if (!user) {
      alert('Please sign in to save your calm plan');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const planData = {
        user_id: user.id,
        scout_profile_id: scoutProfileId || null,
        triggers: plan.triggers || [],
        calm_strategies: plan.calmStrategies || [],
        communication_preferences: plan.communicationPreferences || [],
        sensory_needs: plan.sensoryNeeds || [],
        buddy_preferences: plan.buddyPreferences || [],
        notes: plan.notes || '',
      };

      if (savedPlanId) {
        const { error } = await supabase
          .from('calm_plans')
          .update(planData)
          .eq('id', savedPlanId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('calm_plans')
          .insert(planData)
          .select()
          .single();
        if (error) throw error;
        setSavedPlanId(data.id);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving calm plan:', error);
      alert('Failed to save calm plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const [newTrigger, setNewTrigger] = useState('');
  const [newStrategy, setNewStrategy] = useState('');

  const commonTriggers = [
    'Loud noises',
    'Crowded spaces',
    'Unexpected changes',
    'Strong smells',
    'Bright lights',
    'Physical touch',
    'Time pressure',
    'Transitions between activities',
  ];

  const commonStrategies = [
    'Deep breathing exercises',
    'Quiet break area',
    'Fidget tools',
    'Headphones/ear protection',
    'Visual timer',
    'Weighted blanket/vest',
    'Physical movement',
    'Listen to music',
    'Draw or write',
    'Talk to trusted adult',
  ];

  const addTrigger = (trigger: string) => {
    if (trigger && !plan.triggers?.includes(trigger)) {
      setPlan({
        ...plan,
        triggers: [...(plan.triggers || []), trigger],
      });
      setNewTrigger('');
    }
  };

  const removeTrigger = (trigger: string) => {
    setPlan({
      ...plan,
      triggers: plan.triggers?.filter((t) => t !== trigger),
    });
  };

  const addStrategy = (strategy: string) => {
    if (strategy && !plan.calmStrategies?.includes(strategy)) {
      setPlan({
        ...plan,
        calmStrategies: [...(plan.calmStrategies || []), strategy],
      });
      setNewStrategy('');
    }
  };

  const removeStrategy = (strategy: string) => {
    setPlan({
      ...plan,
      calmStrategies: plan.calmStrategies?.filter((s) => s !== strategy),
    });
  };

  return (
    <div className="calm-plan-builder">
      <div className="alert-box alert-warning mb-6">
        <AlertTriangle size={24} />
        <div>
          <strong>Medical Disclaimer:</strong> This tool is for organizational purposes only and does
          not replace professional medical advice, diagnosis, or treatment. Always consult with
          qualified healthcare providers, therapists, and specialists about your child's specific needs.
          In emergencies, call 911 immediately.
        </div>
      </div>

      <div className="builder-header">
        <h2 className="section-title">Calm Plan Builder</h2>
        <p className="hero-description">
          Create a personalized calm-down plan to help your Scout regulate emotions and prevent
          meltdowns. Share this with leaders to ensure consistent support.
        </p>
      </div>

      <div className="builder-sections">
        <section className="builder-section">
          <div className="section-header">
            <AlertTriangle size={24} className="section-icon" />
            <h3 className="subsection-title">Triggers & Warning Signs</h3>
          </div>
          <p className="section-description">
            What situations, sensations, or changes tend to cause stress or overwhelm?
          </p>

          <div className="quick-add">
            <h4 className="quick-add-title">Common Triggers:</h4>
            <div className="tag-list">
              {commonTriggers.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => addTrigger(trigger)}
                  className={`tag ${plan.triggers?.includes(trigger) ? 'tag-selected' : ''}`}
                  disabled={plan.triggers?.includes(trigger)}
                >
                  <Plus size={16} />
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTrigger(newTrigger)}
              placeholder="Add custom trigger..."
              className="text-input"
            />
            <button onClick={() => addTrigger(newTrigger)} className="btn-icon">
              <Plus size={20} />
            </button>
          </div>

          {plan.triggers && plan.triggers.length > 0 && (
            <div className="selected-items">
              <h4 className="selected-title">Selected Triggers:</h4>
              <div className="chip-list">
                {plan.triggers.map((trigger) => (
                  <div key={trigger} className="chip">
                    <span>{trigger}</span>
                    <button onClick={() => removeTrigger(trigger)} className="chip-remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="builder-section">
          <div className="section-header">
            <Smile size={24} className="section-icon" />
            <h3 className="subsection-title">Calm-Down Strategies</h3>
          </div>
          <p className="section-description">
            What helps your Scout calm down when feeling overwhelmed or upset?
          </p>

          <div className="quick-add">
            <h4 className="quick-add-title">Common Strategies:</h4>
            <div className="tag-list">
              {commonStrategies.map((strategy) => (
                <button
                  key={strategy}
                  onClick={() => addStrategy(strategy)}
                  className={`tag ${plan.calmStrategies?.includes(strategy) ? 'tag-selected' : ''}`}
                  disabled={plan.calmStrategies?.includes(strategy)}
                >
                  <Plus size={16} />
                  {strategy}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addStrategy(newStrategy)}
              placeholder="Add custom strategy..."
              className="text-input"
            />
            <button onClick={() => addStrategy(newStrategy)} className="btn-icon">
              <Plus size={20} />
            </button>
          </div>

          {plan.calmStrategies && plan.calmStrategies.length > 0 && (
            <div className="selected-items">
              <h4 className="selected-title">Selected Strategies:</h4>
              <div className="chip-list">
                {plan.calmStrategies.map((strategy) => (
                  <div key={strategy} className="chip">
                    <span>{strategy}</span>
                    <button onClick={() => removeStrategy(strategy)} className="chip-remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="builder-section">
          <div className="section-header">
            <Heart size={24} className="section-icon" />
            <h3 className="subsection-title">Communication & Sensory Needs</h3>
          </div>

          <div className="form-group">
            <label className="form-label">How does your Scout communicate when upset?</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Example: Uses short phrases, points, becomes nonverbal, etc."
              onChange={(e) =>
                setPlan({
                  ...plan,
                  communicationPreferences: [e.target.value],
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sensory accommodations needed:</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Example: Needs headphones for loud activities, prefers loose clothing, etc."
              onChange={(e) =>
                setPlan({
                  ...plan,
                  sensoryNeeds: [e.target.value],
                })
              }
            />
          </div>
        </section>

        <section className="builder-section">
          <div className="section-header">
            <Users size={24} className="section-icon" />
            <h3 className="subsection-title">Support & Contacts</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Buddy preferences:</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Which Scouts work well as buddies? Any to avoid pairing with?"
              onChange={(e) =>
                setPlan({
                  ...plan,
                  buddyPreferences: [e.target.value],
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional notes for leaders:</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Any other important information leaders should know..."
              value={plan.notes}
              onChange={(e) =>
                setPlan({
                  ...plan,
                  notes: e.target.value,
                })
              }
            />
          </div>
        </section>
      </div>

      <div className="builder-actions">
        <button
          className="btn btn-primary"
          onClick={saveCalmPlan}
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
              {saving ? 'Saving...' : 'Save Calm Plan'}
            </>
          )}
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={20} />
          Print Plan
        </button>
      </div>

      <TipsPanel category="calm-plan" context="builder-start" />
    </div>
  );
}
