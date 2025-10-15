import React, { useState } from 'react';
import {
  Gamepad2,
  Users,
  Zap,
  Brain,
  Heart,
  TreePine,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
  Star,
} from 'lucide-react';
import { TipsPanel } from '../components/TipsPanel';
import { activities, Activity } from '../data/activities';

interface GamesActivitiesProps {
  onPreview?: (activity: Activity) => void;
}

export function GamesActivities({ onPreview }: GamesActivitiesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [showBestMatch, setShowBestMatch] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [showNeedsModal, setShowNeedsModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Activities', icon: Gamepad2 },
    { id: 'icebreaker', label: 'Icebreakers', icon: Users },
    { id: 'energizer', label: 'Energizers', icon: Zap },
    { id: 'calm-down', label: 'Calm Activities', icon: Heart },
    { id: 'team-building', label: 'Team Building', icon: Award },
    { id: 'skill', label: 'Skill Building', icon: Brain },
    { id: 'outdoor', label: 'Outdoor', icon: TreePine },
  ];

  const specialNeeds = [
    { id: 'Autism', label: 'Autism' },
    { id: 'ADHD', label: 'ADHD' },
    { id: 'Anxiety', label: 'Anxiety' },
    { id: 'Sensory', label: 'Sensory Processing' },
    { id: 'Learning', label: 'Learning Disabilities' },
    { id: 'Down', label: 'Down Syndrome' },
    { id: 'Mobility', label: 'Mobility' },
    { id: 'Vision', label: 'Vision/Hearing' },
    { id: 'Nonverbal', label: 'Nonverbal/Communication' },
    { id: 'Universal', label: 'Universal Design' },
  ];

  const filteredActivities = activities.filter((activity) => {
    const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory;

    if (selectedNeeds.length === 0) {
      return categoryMatch;
    }

    if (showBestMatch) {
      return categoryMatch && selectedNeeds.some(need => activity.primarySupportFor.includes(need));
    } else {
      return categoryMatch && selectedNeeds.some(need =>
        activity.primarySupportFor.includes(need) ||
        activity.disabilitySupport.some(support =>
          support.toLowerCase().includes(need.toLowerCase())
        )
      );
    }
  });

  const toggleExpanded = (id: string) => {
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  const getActivityCount = (needId: string) => {
    return activities.filter(a => a.primarySupportFor.includes(needId)).length;
  };

  const toggleNeed = (needId: string) => {
    setSelectedNeeds(prev =>
      prev.includes(needId)
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const clearAllNeeds = () => {
    setSelectedNeeds([]);
    setShowBestMatch(false);
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">Inclusive Games</span>
            <br />& Activities
          </h1>
          <p className="hero-description">
            Activities designed specifically for different special needs, plus adapted games that work for everyone.
            Filter by special need to find activities that work best for your Scouts.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="filters-container">
          <div className="filter-group">
            <h3 className="filter-group-title">Activity Type</h3>
            <div className="category-filters">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">Filter by Special Need</h3>
            <button
              className="special-needs-trigger"
              onClick={() => setShowNeedsModal(true)}
            >
              <Filter size={18} />
              <span className="trigger-text">
                {selectedNeeds.length === 0
                  ? 'All Special Needs'
                  : selectedNeeds.length === 1
                  ? specialNeeds.find(n => n.id === selectedNeeds[0])?.label
                  : `${selectedNeeds.length} selected`}
              </span>
              <span className="trigger-count">
                {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
              </span>
              <ChevronDown size={18} />
            </button>

            {selectedNeeds.length > 0 && (
              <label className="toggle-filter-label-inline">
                <input
                  type="checkbox"
                  checked={showBestMatch}
                  onChange={(e) => setShowBestMatch(e.target.checked)}
                  className="toggle-checkbox"
                />
                <span className="toggle-text">
                  <Star size={14} /> Best Match Only
                </span>
              </label>
            )}
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <Heart size={48} />
            <h3>No activities found</h3>
            <p>Try adjusting your filters or selecting a different category.</p>
          </div>
        ) : (
          <div className="activities-list">
            {filteredActivities.map((activity) => {
              const isExpanded = expandedActivity === activity.id;
              const isSpecificallyDesigned = selectedNeeds.length > 0 && selectedNeeds.some(need => activity.primarySupportFor.includes(need));

              return (
                <div key={activity.id} className="activity-card-large">
                  <button
                    className="activity-card-header"
                    onClick={() => toggleExpanded(activity.id)}
                  >
                    <div className="activity-card-info">
                      <div className="activity-title-row">
                        <h3 className="activity-card-title">{activity.title}</h3>
                        {isSpecificallyDesigned && (
                          <span className="best-match-badge" title="Designed specifically for this need">
                            <Star size={16} /> Best Match
                          </span>
                        )}
                      </div>
                      <p className="activity-card-description">{activity.description}</p>
                      <div className="activity-meta">
                        <span className="meta-item">
                          <Clock size={14} /> {activity.duration}
                        </span>
                        <span className="meta-item">
                          <Users size={14} /> {activity.groupSize}
                        </span>
                        <span className={`activity-badge activity-badge-${activity.category}`}>
                          {activity.category.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="activity-tags">
                        <span className="tag-label">Best for:</span>
                        {activity.primarySupportFor.map((need, i) => (
                          <span key={i} className="activity-tag">{need}</span>
                        ))}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>

                  {isExpanded && (
                    <div className="activity-card-content">
                      <div className="activity-section">
                        <h4 className="activity-section-title">Materials Needed</h4>
                        <ul className="activity-list">
                          {activity.materials.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="activity-section">
                        <h4 className="activity-section-title">Instructions</h4>
                        <ol className="activity-list activity-list-numbered">
                          {activity.instructions.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="activity-section activity-section-highlight">
                        <h4 className="activity-section-title">Adaptations for All Abilities</h4>
                        <ul className="activity-list">
                          {activity.adaptations.map((adapt, i) => (
                            <li key={i}>{adapt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="activity-section activity-section-support">
                        <h4 className="activity-section-title">Special Needs Support Strategies</h4>
                        <ul className="activity-list">
                          {activity.disabilitySupport.map((support, i) => (
                            <li key={i}>{support}</li>
                          ))}
                        </ul>
                      </div>

                      {onPreview && (
                        <div className="activity-preview-action">
                          <button
                            onClick={() => onPreview(activity)}
                            className="btn btn-primary"
                          >
                            <Eye size={20} />
                            View Full Details & Print
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TipsPanel category="activities" context="viewing" />

      {showNeedsModal && (
        <div className="modal-overlay" onClick={() => setShowNeedsModal(false)}>
          <div className="modal-content special-needs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Filter size={24} />
                Select Special Needs
              </h2>
              <div className="modal-header-actions">
                {selectedNeeds.length > 0 && (
                  <button
                    className="btn-text"
                    onClick={clearAllNeeds}
                  >
                    Clear All
                  </button>
                )}
                <button
                  className="modal-close"
                  onClick={() => setShowNeedsModal(false)}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="special-needs-grid">
                {specialNeeds.map((need) => {
                  const count = getActivityCount(need.id);
                  const isSelected = selectedNeeds.includes(need.id);
                  return (
                    <button
                      key={need.id}
                      onClick={() => toggleNeed(need.id)}
                      className={`need-option ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="need-option-header">
                        <span className="need-option-label">{need.label}</span>
                        <span className="need-option-count">{count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setShowNeedsModal(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
