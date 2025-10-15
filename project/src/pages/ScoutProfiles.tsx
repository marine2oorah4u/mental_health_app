import React, { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ScoutProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  disability_types: string[];
  communication_level: string | null;
  support_level: string | null;
  strengths: string[];
  challenges: string[];
  special_interests: string[];
}

export function ScoutProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ScoutProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScoutProfile>>({});

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('scout_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (profile: ScoutProfile | null) => {
    if (profile) {
      setEditing(profile.id);
      setEditForm(profile);
    } else {
      setEditing('new');
      setEditForm({
        first_name: '',
        last_name: '',
        date_of_birth: null,
        disability_types: [],
        communication_level: null,
        support_level: null,
        strengths: [],
        challenges: [],
        special_interests: [],
      });
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      if (editing === 'new') {
        const { error } = await supabase.from('scout_profiles').insert({
          ...editForm,
          user_id: user.id,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('scout_profiles')
          .update(editForm)
          .eq('id', editing);
        if (error) throw error;
      }

      await loadProfiles();
      cancelEdit();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const deleteProfile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const { error } = await supabase.from('scout_profiles').delete().eq('id', id);
      if (error) throw error;
      await loadProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Scout Profiles</h1>
          <p className="hero-description">
            Manage your Scout profiles to personalize calm plans, schedules, and support tools.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title">Your Scouts</h2>
          <button onClick={() => startEdit(null)} className="btn btn-primary">
            <Plus size={20} />
            Add Scout Profile
          </button>
        </div>

        {editing && (
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4">
              {editing === 'new' ? 'New Scout Profile' : 'Edit Profile'}
            </h3>

            <div className="space-y-4">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="text-input"
                    value={editForm.first_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="text-input"
                    value={editForm.last_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="text-input"
                  value={editForm.date_of_birth || ''}
                  onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Disability Types (comma-separated)</label>
                <input
                  type="text"
                  className="text-input"
                  value={editForm.disability_types?.join(', ') || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      disability_types: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  placeholder="e.g., Autism, ADHD, Anxiety"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Communication Level</label>
                <select
                  className="text-input"
                  value={editForm.communication_level || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, communication_level: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option value="verbal">Verbal</option>
                  <option value="limited_verbal">Limited Verbal</option>
                  <option value="non_verbal">Non-Verbal</option>
                  <option value="aac">Uses AAC Device</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Support Level</label>
                <select
                  className="text-input"
                  value={editForm.support_level || ''}
                  onChange={(e) => setEditForm({ ...editForm, support_level: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="minimal">Minimal Support</option>
                  <option value="moderate">Moderate Support</option>
                  <option value="substantial">Substantial Support</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Strengths (comma-separated)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={editForm.strengths?.join(', ') || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      strengths: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  placeholder="e.g., Great at following routines, loves animals, strong memory"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Challenges (comma-separated)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={editForm.challenges?.join(', ') || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      challenges: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  placeholder="e.g., Difficulty with transitions, sensitive to loud noises"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Interests (comma-separated)</label>
                <input
                  type="text"
                  className="text-input"
                  value={editForm.special_interests?.join(', ') || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      special_interests: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  placeholder="e.g., Dinosaurs, trains, space"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={saveProfile} className="btn btn-primary">
                  <Save size={20} />
                  Save Profile
                </button>
                <button onClick={cancelEdit} className="btn btn-secondary">
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {profiles.length === 0 ? (
          <div className="empty-state">
            <User size={48} />
            <h3>No scout profiles yet</h3>
            <p>Add a profile to start creating personalized support plans</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    {profile.date_of_birth && (
                      <p className="text-sm text-muted">
                        Born: {new Date(profile.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(profile)}
                      className="btn-icon-small"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteProfile(profile.id)}
                      className="btn-icon-small btn-danger"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {profile.disability_types.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-2">
                      {profile.disability_types.map((type, idx) => (
                        <span key={idx} className="badge badge-primary">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.communication_level && (
                  <p className="text-sm text-muted">
                    Communication: {profile.communication_level.replace('_', ' ')}
                  </p>
                )}

                {profile.support_level && (
                  <p className="text-sm text-muted">Support Level: {profile.support_level}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
