import { useState } from 'react';
import { Target, Lightbulb } from 'lucide-react';

interface Zone {
  id: 'blue' | 'green' | 'yellow' | 'red';
  name: string;
  color: string;
  description: string;
  feelings: string[];
  strategies: string[];
}

const zones: Zone[] = [
  {
    id: 'blue',
    name: 'Blue Zone',
    color: '#3B82F6',
    description: 'Low energy, tired, sad, or sick',
    feelings: ['Tired', 'Sad', 'Sick', 'Bored', 'Moving slowly'],
    strategies: [
      'Drink cold water',
      'Take a movement break',
      'Listen to upbeat music',
      'Do jumping jacks',
      'Get fresh air',
      'Talk to a friend',
    ],
  },
  {
    id: 'green',
    name: 'Green Zone',
    color: '#10B981',
    description: 'Ready to learn, calm, and focused',
    feelings: ['Happy', 'Calm', 'Focused', 'Ready to learn', 'Feeling good'],
    strategies: [
      'Keep doing what you\'re doing!',
      'Stay hydrated',
      'Take breaks when needed',
      'Notice what\'s helping you',
      'Celebrate feeling good',
    ],
  },
  {
    id: 'yellow',
    name: 'Yellow Zone',
    color: '#F59E0B',
    description: 'Starting to lose control, frustrated, or silly',
    feelings: ['Frustrated', 'Worried', 'Silly', 'Excited', 'Wiggly', 'Anxious'],
    strategies: [
      'Take deep breaths',
      'Count to 10',
      'Use a fidget tool',
      'Ask for help',
      'Take a short break',
      'Use positive self-talk',
    ],
  },
  {
    id: 'red',
    name: 'Red Zone',
    color: '#EF4444',
    description: 'Out of control, angry, or terrified',
    feelings: ['Very angry', 'Terrified', 'Out of control', 'Explosive', 'Panicked'],
    strategies: [
      'Go to calm-down space',
      'Use breathing exercises',
      'Talk to a trusted adult',
      'Take a long break',
      'Use calming visuals',
      'Remove from situation if safe',
    ],
  },
];

interface ZoneEntry {
  zone: Zone;
  timestamp: Date;
  note: string;
}

export function ZonesOfRegulation() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<ZoneEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSaveCheckIn = () => {
    if (!selectedZone) return;

    const entry: ZoneEntry = {
      zone: selectedZone,
      timestamp: new Date(),
      note,
    };

    setHistory([entry, ...history]);
    setNote('');
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Target size={24} />
        <h2>Zones of Regulation</h2>
      </div>

      <div className="zones-intro">
        <p>
          Everyone moves through different zones throughout the day. There's no "bad" zone -
          they all give us important information! Choose the zone you're in right now.
        </p>
      </div>

      <div className="zones-grid">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className={`zone-button ${selectedZone?.id === zone.id ? 'selected' : ''}`}
            style={{
              '--zone-color': zone.color,
            } as any}
          >
            <div className="zone-name">{zone.name}</div>
            <div className="zone-description">{zone.description}</div>
          </button>
        ))}
      </div>

      {selectedZone && (
        <div className="zone-details" style={{ borderColor: selectedZone.color }}>
          <div className="zone-details-header" style={{ backgroundColor: selectedZone.color }}>
            <h3>{selectedZone.name}</h3>
            <p>{selectedZone.description}</p>
          </div>

          <div className="zone-section">
            <h4>You might be feeling:</h4>
            <div className="zone-feelings">
              {selectedZone.feelings.map((feeling, idx) => (
                <span key={idx} className="zone-tag">
                  {feeling}
                </span>
              ))}
            </div>
          </div>

          <div className="zone-section">
            <h4>
              <Lightbulb size={18} />
              Helpful strategies:
            </h4>
            <ul className="zone-strategies">
              {selectedZone.strategies.map((strategy, idx) => (
                <li key={idx}>{strategy}</li>
              ))}
            </ul>
          </div>

          <div className="zone-section">
            <label className="form-label">
              What's happening? (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I'm in this zone because..."
              className="form-textarea"
              rows={2}
            />
          </div>

          <button onClick={handleSaveCheckIn} className="btn btn-primary btn-large">
            Save Check-In
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="zone-history-section">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-secondary"
          >
            {showHistory ? 'Hide' : 'Show'} History ({history.length})
          </button>

          {showHistory && (
            <div className="zone-history-list">
              {history.slice(0, 10).map((entry, idx) => (
                <div
                  key={idx}
                  className="zone-history-item"
                  style={{ borderLeftColor: entry.zone.color }}
                >
                  <div className="zone-history-zone">{entry.zone.name}</div>
                  <div className="zone-history-time">
                    {entry.timestamp.toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {entry.note && <div className="zone-history-note">{entry.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="tool-info">
        <h3>About Zones of Regulation</h3>
        <ul>
          <li>All zones are okay - they give us important information</li>
          <li>Green zone is best for learning and activities</li>
          <li>We can use strategies to move between zones</li>
          <li>Recognizing your zone helps you know what you need</li>
          <li>Perfect for emotional regulation and self-awareness</li>
        </ul>
      </div>
    </div>
  );
}
