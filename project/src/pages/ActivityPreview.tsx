import React from 'react';
import {
  ArrowLeft,
  Clock,
  Users,
  Printer,
  Share2,
  Image as ImageIcon,
  Package,
  ListOrdered,
  Wrench,
  Heart,
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  groupSize: string;
  materials: string[];
  instructions: string[];
  adaptations: string[];
  disabilitySupport: string[];
  heroImageUrl?: string;
}

interface ActivityPreviewProps {
  activity: Activity;
  onBack: () => void;
}

export function ActivityPreview({ activity, onBack }: ActivityPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: activity.description,
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      icebreaker: 'bg-blue-100 text-blue-800',
      'team-building': 'bg-green-100 text-green-800',
      energizer: 'bg-yellow-100 text-yellow-800',
      'calm-down': 'bg-purple-100 text-purple-800',
      skill: 'bg-orange-100 text-orange-800',
      outdoor: 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="preview-page">
      <div className="preview-header no-print">
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={20} />
          Back to Activities
        </button>

        <div className="preview-actions">
          <button onClick={handleShare} className="btn btn-secondary btn-small">
            <Share2 size={16} />
            Share
          </button>
          <button onClick={handlePrint} className="btn btn-primary btn-small">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="preview-content">
        {activity.heroImageUrl && (
          <div className="preview-hero-image">
            <img src={activity.heroImageUrl} alt={activity.title} />
          </div>
        )}

        <div className="preview-title-section">
          <h1 className="preview-title">{activity.title}</h1>
          <p className="preview-description">{activity.description}</p>

          <div className="preview-meta">
            <span className={`preview-badge ${getCategoryColor(activity.category)}`}>
              {activity.category.replace('-', ' ')}
            </span>
            <span className="preview-meta-item">
              <Clock size={18} />
              {activity.duration}
            </span>
            <span className="preview-meta-item">
              <Users size={18} />
              {activity.groupSize}
            </span>
          </div>
        </div>

        <div className="preview-sections">
          <section className="preview-section">
            <div className="preview-section-header">
              <Package size={24} className="preview-section-icon" />
              <h2 className="preview-section-title">Materials Needed</h2>
            </div>
            <ul className="preview-list">
              {activity.materials.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="preview-section">
            <div className="preview-section-header">
              <ListOrdered size={24} className="preview-section-icon" />
              <h2 className="preview-section-title">Instructions</h2>
            </div>
            <ol className="preview-list preview-list-ordered">
              {activity.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="preview-section preview-section-highlight">
            <div className="preview-section-header">
              <Wrench size={24} className="preview-section-icon" />
              <h2 className="preview-section-title">Adaptations for All Abilities</h2>
            </div>
            <p className="preview-section-description">
              These modifications ensure every Scout can participate meaningfully:
            </p>
            <ul className="preview-list">
              {activity.adaptations.map((adapt, i) => (
                <li key={i}>{adapt}</li>
              ))}
            </ul>
          </section>

          <section className="preview-section preview-section-support">
            <div className="preview-section-header">
              <Heart size={24} className="preview-section-icon" />
              <h2 className="preview-section-title">Disability-Specific Support</h2>
            </div>
            <p className="preview-section-description">
              Targeted strategies for specific needs:
            </p>
            <ul className="preview-list">
              {activity.disabilitySupport.map((support, i) => (
                <li key={i}>{support}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="preview-footer">
          <div className="preview-tip">
            <strong>Leader Tip:</strong> Before running this activity, review the adaptations section
            and prepare any special materials needed. Brief your volunteers on how to support Scouts
            with different needs.
          </div>
        </div>
      </div>
    </div>
  );
}
