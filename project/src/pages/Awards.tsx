import React, { useState, useEffect } from 'react';
import { Award, Download, Search, Filter, ExternalLink, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Award {
  id: string;
  name: string;
  designation: string;
  description: string;
  eligibility: string;
  requirements: string;
  application_process: string;
  level: 'council' | 'national' | 'regional';
  category: 'unit' | 'individual_youth' | 'individual_adult' | 'council';
  is_active: boolean;
  image_url: string | null;
  nomination_url: string | null;
}

interface AwardForm {
  id: string;
  award_id: string;
  form_name: string;
  form_type: string;
  description: string;
  file_url: string | null;
  is_required: boolean;
  order_index: number;
}

export function Awards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [awardForms, setAwardForms] = useState<AwardForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAwards();
  }, []);

  useEffect(() => {
    if (selectedAward) {
      loadAwardForms(selectedAward.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedAward]);

  const loadAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAwards(data || []);
    } catch (error) {
      console.error('Error loading awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAwardForms = async (awardId: string) => {
    try {
      const { data, error } = await supabase
        .from('award_forms')
        .select('*')
        .eq('award_id', awardId)
        .order('order_index');

      if (error) throw error;
      setAwardForms(data || []);
    } catch (error) {
      console.error('Error loading award forms:', error);
      setAwardForms([]);
    }
  };

  const filteredAwards = awards.filter((award) => {
    const matchesSearch =
      award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || award.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || award.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'national', label: 'National' },
    { id: 'regional', label: 'Regional' },
    { id: 'council', label: 'Council' },
  ];

  const categories = [
    { id: 'all', label: 'All Types' },
    { id: 'unit', label: 'Unit Awards' },
    { id: 'individual_youth', label: 'Youth Awards' },
    { id: 'individual_adult', label: 'Adult Awards' },
    { id: 'council', label: 'Council Awards' },
  ];

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      unit: 'Unit Award',
      individual_youth: 'Youth Award',
      individual_adult: 'Adult Award',
      council: 'Council Award',
    };
    return map[category] || category;
  };

  const getLevelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      national: 'badge-primary',
      regional: 'badge-secondary',
      council: 'badge-accent',
    };
    return colors[level] || 'badge-default';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="hero-section">
          <p>Loading awards...</p>
        </div>
      </div>
    );
  }

  if (selectedAward) {
    return (
      <div className="page-container">
        <button
          onClick={() => setSelectedAward(null)}
          className="btn btn-secondary mb-4"
        >
          ← Back to Awards
        </button>

        <div className="hero-section">
          <div className="hero-content">
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${getLevelBadgeColor(selectedAward.level)}`}>
                {selectedAward.level.toUpperCase()}
              </span>
              <span className="badge badge-default">
                {getCategoryLabel(selectedAward.category)}
              </span>
            </div>
            <h1 className="hero-title">{selectedAward.name}</h1>
            <p className="text-xl text-muted">{selectedAward.designation}</p>
          </div>
        </div>

        <div className="section">
          {selectedAward.image_url && (
            <div className="flex justify-center mb-6">
              <img
                src={selectedAward.image_url}
                alt={selectedAward.name}
                className="max-w-xs rounded-lg shadow-lg"
              />
            </div>
          )}

          {selectedAward.nomination_url && (
            <div className="mb-6">
              <a
                href={selectedAward.nomination_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Download size={20} />
                Download Nomination Form
              </a>
            </div>
          )}

          <div className="info-card">
            <h3 className="info-card-title">About This Award</h3>
            <div className="prose max-w-none">
              <p className="info-card-text whitespace-pre-line">{selectedAward.description}</p>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card-title">Eligibility</h3>
            <div className="prose max-w-none">
              <p className="info-card-text whitespace-pre-line">{selectedAward.eligibility}</p>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card-title">Requirements</h3>
            <div className="prose max-w-none">
              <p className="info-card-text whitespace-pre-line">{selectedAward.requirements}</p>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card-title">Application Process</h3>
            <div className="prose max-w-none">
              <p className="info-card-text whitespace-pre-line">{selectedAward.application_process}</p>
            </div>
          </div>

          {awardForms.length > 0 && (
            <div className="info-card">
              <h3 className="info-card-title">Required Forms & Documents</h3>
              <div className="space-y-3">
                {awardForms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-start justify-between p-4 bg-surface rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{form.form_name}</h4>
                        {form.is_required && (
                          <span className="text-xs text-error font-medium">REQUIRED</span>
                        )}
                      </div>
                      <p className="text-sm text-muted">{form.description}</p>
                      <span className="text-xs text-muted capitalize">
                        {form.form_type.replace('_', ' ')}
                      </span>
                    </div>
                    {form.file_url && (
                      <button className="btn btn-primary btn-small">
                        <Download size={16} />
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">Recognition & Awards</span>
            <br />
            For Inclusive Scouting
          </h1>
          <p className="hero-description">
            Celebrate units, leaders, and youth who champion disability inclusion and make Scouting
            accessible for all. Browse awards, download applications, and learn how to recognize
            outstanding inclusive practices.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search awards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex gap-2">
            <Filter size={20} className="text-muted" />
            <span className="text-sm font-semibold">Level:</span>
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`filter-button ${selectedLevel === level.id ? 'active' : ''}`}
              >
                {level.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm font-semibold">Type:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAwards.map((award) => (
            <div
              key={award.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAward(award)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getLevelBadgeColor(award.level)}`}>
                      {award.level}
                    </span>
                    <span className="badge badge-default text-xs">
                      {getCategoryLabel(award.category)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{award.name}</h3>
                  <p className="text-sm text-muted mb-2">{award.designation}</p>
                  <p className="text-sm line-clamp-2">{award.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAwards.length === 0 && (
          <div className="empty-state">
            <Award size={48} />
            <h3>No awards found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <div className="section">
        <div className="info-card">
          <h3 className="info-card-title">About Recognition Programs</h3>
          <p className="info-card-text">
            These awards recognize the dedication of units, leaders, youth, and councils who work to
            make Scouting accessible and inclusive for everyone. Awards help highlight best
            practices, celebrate successes, and inspire others to create welcoming environments for
            Scouts with disabilities and special needs.
          </p>
          <p className="info-card-text">
            <strong>Note:</strong> Award requirements and processes are provided for informational
            purposes. Always verify current requirements with your local council or check official
            Scouting America resources.
          </p>
        </div>
      </div>
    </div>
  );
}
