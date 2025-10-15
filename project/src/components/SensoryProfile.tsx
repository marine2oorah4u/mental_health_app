import React, { useState, useEffect } from 'react';
import { Eye, Ear, Hand, Waves, Music, Droplet, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { SensoryProfile as ISensoryProfile } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const sensoryCategories = [
  {
    key: 'visual',
    title: 'Visual',
    icon: Eye,
    description: 'Light, colors, patterns, visual clutter',
    examples: {
      hyposensitive: 'Seeks bright lights, enjoys spinning objects, likes intense visual stimulation',
      hypersensitive: 'Bothered by fluorescent lights, overwhelmed by visual clutter, prefers dim lighting',
    },
  },
  {
    key: 'auditory',
    title: 'Auditory',
    icon: Ear,
    description: 'Sounds, noise levels, frequencies',
    examples: {
      hyposensitive: 'Seeks loud sounds, may not respond to name, enjoys noisy environments',
      hypersensitive: 'Covers ears frequently, bothered by background noise, dislikes loud gatherings',
    },
  },
  {
    key: 'tactile',
    title: 'Tactile',
    icon: Hand,
    description: 'Touch, textures, clothing, temperature',
    examples: {
      hyposensitive: 'Seeks deep pressure, may not notice injuries, craves physical contact',
      hypersensitive: 'Bothered by tags in clothing, dislikes messy activities, sensitive to light touch',
    },
  },
  {
    key: 'vestibular',
    title: 'Vestibular',
    icon: Waves,
    description: 'Balance, movement, spatial awareness',
    examples: {
      hyposensitive: 'Constantly moving, seeks spinning/swinging, never seems dizzy',
      hypersensitive: 'Avoids playground equipment, fearful of heights, dislikes sudden movements',
    },
  },
  {
    key: 'proprioceptive',
    title: 'Proprioceptive',
    icon: Music,
    description: 'Body awareness, muscle/joint input',
    examples: {
      hyposensitive: 'Seeks heavy work, crashes into things, applies too much pressure',
      hypersensitive: 'Avoids physical activities, uncomfortable with resistance, tires easily',
    },
  },
  {
    key: 'gustatory',
    title: 'Gustatory',
    icon: Droplet,
    description: 'Taste, food textures, flavors',
    examples: {
      hyposensitive: 'Seeks strong flavors, eats non-food items, likes spicy/intense tastes',
      hypersensitive: 'Very picky eater, bothered by mixed textures, prefers bland foods',
    },
  },
  {
    key: 'olfactory',
    title: 'Olfactory',
    icon: Droplet,
    description: 'Smells, scents, odors',
    examples: {
      hyposensitive: 'Seeks strong smells, may not notice unpleasant odors, smells objects',
      hypersensitive: 'Bothered by perfumes/lotions, sensitive to food smells, notices subtle odors',
    },
  },
];

interface SensoryProfileProps {
  scoutProfileId?: string;
}

export function SensoryProfile({ scoutProfileId }: SensoryProfileProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ISensoryProfile>({
    visual: { sensitivity: 'typical', triggers: [], seekingBehaviors: [], accommodations: [] },
    auditory: { sensitivity: 'typical', triggers: [], seekingBehaviors: [], accommodations: [] },
    tactile: { sensitivity: 'typical', triggers: [], seekingBehaviors: [], accommodations: [] },
    vestibular: {
      sensitivity: 'typical',
      triggers: [],
      seekingBehaviors: [],
      accommodations: [],
    },
    proprioceptive: {
      sensitivity: 'typical',
      triggers: [],
      seekingBehaviors: [],
      accommodations: [],
    },
    gustatory: { sensitivity: 'typical', triggers: [], seekingBehaviors: [], accommodations: [] },
    olfactory: { sensitivity: 'typical', triggers: [], seekingBehaviors: [], accommodations: [] },
  });

  const [expandedCategory, setExpandedCategory] = useState<string | null>('visual');
  const [savedProfileId, setSavedProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user && scoutProfileId) {
      loadSensoryProfile();
    }
  }, [user, scoutProfileId]);

  const loadSensoryProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('sensory_profiles')
        .select('*')
        .eq('scout_profile_id', scoutProfileId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSavedProfileId(data.id);
        setProfile({
          visual: {
            sensitivity: data.visual_sensitivity || 'typical',
            triggers: data.visual_triggers || [],
            seekingBehaviors: [],
            accommodations: data.visual_accommodations || [],
          },
          auditory: {
            sensitivity: data.auditory_sensitivity || 'typical',
            triggers: data.auditory_triggers || [],
            seekingBehaviors: [],
            accommodations: data.auditory_accommodations || [],
          },
          tactile: {
            sensitivity: data.tactile_sensitivity || 'typical',
            triggers: data.tactile_triggers || [],
            seekingBehaviors: [],
            accommodations: data.tactile_accommodations || [],
          },
          vestibular: {
            sensitivity: data.vestibular_sensitivity || 'typical',
            triggers: data.vestibular_triggers || [],
            seekingBehaviors: [],
            accommodations: data.vestibular_accommodations || [],
          },
          proprioceptive: {
            sensitivity: data.proprioceptive_sensitivity || 'typical',
            triggers: data.proprioceptive_triggers || [],
            seekingBehaviors: [],
            accommodations: data.proprioceptive_accommodations || [],
          },
          gustatory: {
            sensitivity: data.gustatory_sensitivity || 'typical',
            triggers: data.gustatory_triggers || [],
            seekingBehaviors: [],
            accommodations: data.gustatory_accommodations || [],
          },
          olfactory: {
            sensitivity: data.olfactory_sensitivity || 'typical',
            triggers: data.olfactory_triggers || [],
            seekingBehaviors: [],
            accommodations: data.olfactory_accommodations || [],
          },
        });
      }
    } catch (error) {
      console.error('Error loading sensory profile:', error);
    }
  };

  const saveSensoryProfile = async () => {
    if (!user) {
      alert('Please sign in to save your sensory profile');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const profileData = {
        user_id: user.id,
        scout_profile_id: scoutProfileId || null,
        visual_sensitivity: profile.visual.sensitivity,
        visual_triggers: profile.visual.triggers,
        visual_accommodations: profile.visual.accommodations,
        auditory_sensitivity: profile.auditory.sensitivity,
        auditory_triggers: profile.auditory.triggers,
        auditory_accommodations: profile.auditory.accommodations,
        tactile_sensitivity: profile.tactile.sensitivity,
        tactile_triggers: profile.tactile.triggers,
        tactile_accommodations: profile.tactile.accommodations,
        vestibular_sensitivity: profile.vestibular.sensitivity,
        vestibular_triggers: profile.vestibular.triggers,
        vestibular_accommodations: profile.vestibular.accommodations,
        proprioceptive_sensitivity: profile.proprioceptive.sensitivity,
        proprioceptive_triggers: profile.proprioceptive.triggers,
        proprioceptive_accommodations: profile.proprioceptive.accommodations,
        gustatory_sensitivity: profile.gustatory.sensitivity,
        gustatory_triggers: profile.gustatory.triggers,
        gustatory_accommodations: profile.gustatory.accommodations,
        olfactory_sensitivity: profile.olfactory.sensitivity,
        olfactory_triggers: profile.olfactory.triggers,
        olfactory_accommodations: profile.olfactory.accommodations,
      };

      if (savedProfileId) {
        const { error } = await supabase
          .from('sensory_profiles')
          .update(profileData)
          .eq('id', savedProfileId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('sensory_profiles')
          .insert(profileData)
          .select()
          .single();
        if (error) throw error;
        setSavedProfileId(data.id);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving sensory profile:', error);
      alert('Failed to save sensory profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = (
    category: keyof ISensoryProfile,
    field: string,
    value: string | string[]
  ) => {
    setProfile({
      ...profile,
      [category]: {
        ...profile[category],
        [field]: value,
      },
    });
  };

  const addItem = (category: keyof ISensoryProfile, field: string, value: string) => {
    const current = profile[category][field as keyof typeof profile[typeof category]] as string[];
    if (value.trim() && !current.includes(value.trim())) {
      updateCategory(category, field, [...current, value.trim()]);
    }
  };

  return (
    <div className="sensory-profile">
      <div className="alert-box alert-warning mb-6">
        <AlertTriangle size={24} />
        <div>
          <strong>Medical Disclaimer:</strong> This tool helps organize sensory information for
          Scouting activities but does not replace professional occupational therapy assessment.
          Consult with qualified therapists and healthcare providers for sensory processing evaluations
          and treatment plans.
        </div>
      </div>

      <div className="builder-header">
        <h2 className="section-title">Sensory Profile</h2>
        <p className="hero-description">
          Document your Scout's sensory sensitivities and preferences across all seven senses. This
          helps leaders understand how to accommodate sensory needs during activities.
        </p>
      </div>

      <div className="sensory-categories">
        {sensoryCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.key;
          const categoryData = profile[category.key as keyof ISensoryProfile];

          return (
            <div key={category.key} className="sensory-category">
              <button
                className="category-header"
                onClick={() => setExpandedCategory(isExpanded ? null : category.key)}
              >
                <div className="category-title">
                  <Icon size={24} />
                  <div>
                    <h3>{category.title}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>
                </div>
                <div className="category-sensitivity">
                  <span
                    className={`sensitivity-badge sensitivity-${categoryData.sensitivity}`}
                  >
                    {categoryData.sensitivity === 'hyposensitive' && 'Under-responsive'}
                    {categoryData.sensitivity === 'typical' && 'Typical'}
                    {categoryData.sensitivity === 'hypersensitive' && 'Over-responsive'}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="category-content">
                  <div className="form-group">
                    <label className="form-label">Sensitivity Level</label>
                    <div className="sensitivity-options">
                      <button
                        className={`sensitivity-option ${
                          categoryData.sensitivity === 'hyposensitive' ? 'active' : ''
                        }`}
                        onClick={() =>
                          updateCategory(
                            category.key as keyof ISensoryProfile,
                            'sensitivity',
                            'hyposensitive'
                          )
                        }
                      >
                        <div className="option-title">Under-responsive</div>
                        <div className="option-description">{category.examples.hyposensitive}</div>
                      </button>
                      <button
                        className={`sensitivity-option ${
                          categoryData.sensitivity === 'typical' ? 'active' : ''
                        }`}
                        onClick={() =>
                          updateCategory(
                            category.key as keyof ISensoryProfile,
                            'sensitivity',
                            'typical'
                          )
                        }
                      >
                        <div className="option-title">Typical</div>
                        <div className="option-description">
                          No significant sensory sensitivities
                        </div>
                      </button>
                      <button
                        className={`sensitivity-option ${
                          categoryData.sensitivity === 'hypersensitive' ? 'active' : ''
                        }`}
                        onClick={() =>
                          updateCategory(
                            category.key as keyof ISensoryProfile,
                            'sensitivity',
                            'hypersensitive'
                          )
                        }
                      >
                        <div className="option-title">Over-responsive</div>
                        <div className="option-description">{category.examples.hypersensitive}</div>
                      </button>
                    </div>
                  </div>

                  {categoryData.sensitivity !== 'typical' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">
                          Specific Triggers (what causes problems)
                        </label>
                        <textarea
                          className="textarea"
                          rows={2}
                          placeholder={`Example: ${
                            categoryData.sensitivity === 'hypersensitive'
                              ? 'Loud sirens, fluorescent lights, scratchy fabrics'
                              : 'May seek out these sensations'
                          }`}
                          value={categoryData.triggers.join(', ')}
                          onChange={(e) =>
                            updateCategory(
                              category.key as keyof ISensoryProfile,
                              'triggers',
                              e.target.value.split(',').map((t) => t.trim())
                            )
                          }
                        />
                      </div>

                      {categoryData.sensitivity === 'hyposensitive' && (
                        <div className="form-group">
                          <label className="form-label">Seeking Behaviors</label>
                          <textarea
                            className="textarea"
                            rows={2}
                            placeholder="What does your Scout do to get more of this input?"
                            value={categoryData.seekingBehaviors.join(', ')}
                            onChange={(e) =>
                              updateCategory(
                                category.key as keyof ISensoryProfile,
                                'seekingBehaviors',
                                e.target.value.split(',').map((t) => t.trim())
                              )
                            }
                          />
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">Accommodations Needed</label>
                        <textarea
                          className="textarea"
                          rows={2}
                          placeholder="What helps? (e.g., Headphones, fidgets, breaks, modified activities)"
                          value={categoryData.accommodations.join(', ')}
                          onChange={(e) =>
                            updateCategory(
                              category.key as keyof ISensoryProfile,
                              'accommodations',
                              e.target.value.split(',').map((t) => t.trim())
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="builder-actions">
        <button
          className="btn btn-primary"
          onClick={saveSensoryProfile}
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
              {saving ? 'Saving...' : 'Save Sensory Profile'}
            </>
          )}
        </button>
        <button className="btn btn-secondary">Share with Leaders</button>
      </div>
    </div>
  );
}
