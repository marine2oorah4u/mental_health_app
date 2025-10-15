import { useState } from 'react';
import { Heart, Save, TrendingUp } from 'lucide-react';

interface Feeling {
  id: string;
  emoji: string;
  label: string;
  color: string;
  intensity: number;
}

const feelings: Feeling[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FCD34D', intensity: 5 },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: '#FB923C', intensity: 5 },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#A3E635', intensity: 3 },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#94A3B8', intensity: 3 },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#C4B5FD', intensity: 2 },
  { id: 'worried', emoji: '😟', label: 'Worried', color: '#FDBA74', intensity: 4 },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: '#FCA5A5', intensity: 4 },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#93C5FD', intensity: 4 },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#F87171', intensity: 5 },
  { id: 'confused', emoji: '😕', label: 'Confused', color: '#D8B4FE', intensity: 3 },
  { id: 'proud', emoji: '😎', label: 'Proud', color: '#34D399', intensity: 5 },
  { id: 'silly', emoji: '🤪', label: 'Silly', color: '#FDE047', intensity: 4 },
];

interface CheckInEntry {
  feeling: Feeling;
  intensity: number;
  note: string;
  timestamp: Date;
}

export function FeelingsCheckIn() {
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!selectedFeeling) return;

    const entry: CheckInEntry = {
      feeling: selectedFeeling,
      intensity,
      note,
      timestamp: new Date(),
    };

    setEntries([entry, ...entries]);
    setShowSuccess(true);

    // Reset form
    setTimeout(() => {
      setSelectedFeeling(null);
      setIntensity(3);
      setNote('');
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Heart size={24} />
        <h2>Feelings Check-In</h2>
      </div>

      <div className="feelings-intro">
        <p>How are you feeling right now? It's okay to have any feeling!</p>
      </div>

      <div className="feelings-grid">
        {feelings.map((feeling) => (
          <button
            key={feeling.id}
            onClick={() => setSelectedFeeling(feeling)}
            className={`feeling-button ${selectedFeeling?.id === feeling.id ? 'selected' : ''}`}
            style={{
              '--feeling-color': feeling.color,
            } as any}
          >
            <div className="feeling-emoji">{feeling.emoji}</div>
            <div className="feeling-label">{feeling.label}</div>
          </button>
        ))}
      </div>

      {selectedFeeling && (
        <div className="feelings-details">
          <div className="feelings-selected">
            <div className="feelings-selected-emoji">{selectedFeeling.emoji}</div>
            <h3>I'm feeling {selectedFeeling.label}</h3>
          </div>

          <div className="form-group">
            <label className="form-label">
              How {selectedFeeling.label.toLowerCase()}? (1 = a little, 5 = very)
            </label>
            <div className="intensity-selector">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`intensity-button ${intensity === level ? 'active' : ''}`}
                  style={{
                    '--intensity-color': selectedFeeling.color,
                  } as any}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Want to share why? (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I'm feeling this way because..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <button onClick={handleSave} className="btn btn-primary btn-large">
            <Save size={20} />
            Save Check-In
          </button>

          {showSuccess && (
            <div className="success-message">
              ✓ Thank you for checking in!
            </div>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <div className="feelings-history">
          <h3>
            <TrendingUp size={20} />
            Your Recent Check-Ins
          </h3>
          <div className="feelings-timeline">
            {entries.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="feelings-entry">
                <div className="feelings-entry-emoji">{entry.feeling.emoji}</div>
                <div className="feelings-entry-content">
                  <div className="feelings-entry-header">
                    <strong>{entry.feeling.label}</strong>
                    <span className="feelings-entry-intensity">
                      {'•'.repeat(entry.intensity)}
                    </span>
                  </div>
                  {entry.note && (
                    <div className="feelings-entry-note">{entry.note}</div>
                  )}
                  <div className="feelings-entry-time">
                    {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tool-info">
        <h3>Why Check In?</h3>
        <ul>
          <li>Helps you recognize and name your feelings</li>
          <li>Leaders can better support you when they know how you feel</li>
          <li>Tracking feelings helps you notice patterns</li>
          <li>All feelings are okay and important!</li>
        </ul>
      </div>
    </div>
  );
}
