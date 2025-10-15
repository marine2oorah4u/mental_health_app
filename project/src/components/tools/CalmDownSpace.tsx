import { useState } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';

interface CalmActivity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  visual: string;
}

const activities: CalmActivity[] = [
  {
    id: 'bubbles',
    name: 'Floating Bubbles',
    emoji: '🫧',
    description: 'Watch peaceful bubbles float by',
    color: '#93C5FD',
    visual: 'bubbles',
  },
  {
    id: 'stars',
    name: 'Starry Night',
    emoji: '⭐',
    description: 'Gaze at twinkling stars',
    color: '#1E293B',
    visual: 'stars',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Watch gentle waves',
    color: '#06B6D4',
    visual: 'waves',
  },
  {
    id: 'forest',
    name: 'Forest Path',
    emoji: '🌲',
    description: 'Walk through peaceful woods',
    color: '#84CC16',
    visual: 'forest',
  },
];

export function CalmDownSpace() {
  const [selectedActivity, setSelectedActivity] = useState<CalmActivity | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleClose = () => {
    setSelectedActivity(null);
    setSoundEnabled(false);
  };

  if (selectedActivity) {
    return (
      <div
        className="calm-space-fullscreen"
        style={{ backgroundColor: selectedActivity.color }}
      >
        <div className="calm-space-header">
          <div className="calm-space-title">
            <span>{selectedActivity.emoji}</span>
            {selectedActivity.name}
          </div>
          <div className="calm-space-controls">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="calm-control-button"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={handleClose} className="calm-control-button">
              ✕
            </button>
          </div>
        </div>

        <div className="calm-space-visual">
          {selectedActivity.visual === 'bubbles' && (
            <div className="bubbles-container">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="bubble"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${8 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>
          )}

          {selectedActivity.visual === 'stars' && (
            <div className="stars-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          )}

          {selectedActivity.visual === 'waves' && (
            <div className="waves-container">
              <div className="wave wave-1" />
              <div className="wave wave-2" />
              <div className="wave wave-3" />
            </div>
          )}

          {selectedActivity.visual === 'forest' && (
            <div className="forest-container">
              <div className="forest-text">
                {selectedActivity.emoji.repeat(20)}
              </div>
            </div>
          )}
        </div>

        <div className="calm-space-footer">
          <p className="calm-instruction">Take deep breaths. You're safe. Take all the time you need.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Sparkles size={24} />
        <h2>Calm-Down Space</h2>
      </div>

      <div className="calm-intro">
        <p>
          Feeling overwhelmed? Choose a calming activity to help you feel better.
          These spaces are peaceful and quiet - just for you.
        </p>
      </div>

      <div className="calm-activities-grid">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => setSelectedActivity(activity)}
            className="calm-activity-button"
            style={{
              backgroundColor: activity.color,
            }}
          >
            <div className="calm-activity-emoji">{activity.emoji}</div>
            <div className="calm-activity-name">{activity.name}</div>
            <div className="calm-activity-desc">{activity.description}</div>
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>When to Use:</h3>
        <ul>
          <li>When you feel overwhelmed or anxious</li>
          <li>After a difficult or stressful activity</li>
          <li>When you need a quiet break</li>
          <li>To prevent meltdowns before they happen</li>
          <li>Anytime you need to calm down and reset</li>
        </ul>
      </div>
    </div>
  );
}
