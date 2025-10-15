import { useState } from 'react';
import { Hand, Plus, Star } from 'lucide-react';

interface Fidget {
  id: string;
  name: string;
  type: string;
  rating: number;
  notes: string;
}

const fidgetOptions = [
  { name: 'Fidget Spinner', type: 'spinning', icon: '🌀' },
  { name: 'Stress Ball', type: 'squeezing', icon: '⚽' },
  { name: 'Putty/Slime', type: 'molding', icon: '🫧' },
  { name: 'Fidget Cube', type: 'clicking', icon: '🎲' },
  { name: 'Tangle Toy', type: 'twisting', icon: '🔗' },
  { name: 'Pop It', type: 'popping', icon: '⭕' },
  { name: 'Worry Stone', type: 'rubbing', icon: '🪨' },
  { name: 'Stretchy String', type: 'pulling', icon: '🧵' },
  { name: 'Marble Mesh', type: 'squeezing', icon: '🔮' },
  { name: 'Chewelry', type: 'chewing', icon: '📿' },
];

export function FidgetToolkit() {
  const [myFidgets, setMyFidgets] = useState<Fidget[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const addFidget = (option: typeof fidgetOptions[0]) => {
    const fidget: Fidget = {
      id: Date.now().toString(),
      name: option.name,
      type: option.type,
      rating: 0,
      notes: '',
    };
    setMyFidgets(prev => [...prev, fidget]);
    setShowAdd(false);
  };

  const updateRating = (id: string, rating: number) => {
    setMyFidgets(prev => prev.map(f => f.id === id ? { ...f, rating } : f));
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Hand size={24} />
        <h2>Fidget Toolkit Tracker</h2>
      </div>

      <div className="fidget-intro">
        <p>Track which fidget tools work best for you. Rate each one to remember your favorites!</p>
      </div>

      <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary" style={{marginBottom: 'var(--space-lg)'}}>
        <Plus size={20} />
        Add Fidget Tool
      </button>

      {showAdd && (
        <div className="fidget-options">
          <h3>Choose a fidget to add:</h3>
          <div className="fidget-grid">
            {fidgetOptions.map(opt => (
              <button key={opt.name} onClick={() => addFidget(opt)} className="fidget-option-card">
                <span className="fidget-icon">{opt.icon}</span>
                <strong>{opt.name}</strong>
                <small>{opt.type}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="my-fidgets">
        <h3>My Fidget Tools ({myFidgets.length})</h3>
        {myFidgets.length === 0 ? (
          <div className="empty-state">
            <Hand size={48} />
            <p>Add fidget tools to track which ones help you focus!</p>
          </div>
        ) : (
          <div className="fidget-list">
            {myFidgets.map(fidget => (
              <div key={fidget.id} className="fidget-item">
                <div className="fidget-info">
                  <h4>{fidget.name}</h4>
                  <span className="fidget-type">{fidget.type}</span>
                </div>
                <div className="fidget-rating">
                  <strong>How helpful?</strong>
                  <div className="stars">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        onClick={() => updateRating(fidget.id, star)}
                        className={`star-btn ${star <= fidget.rating ? 'active' : ''}`}
                      >
                        <Star size={20} fill={star <= fidget.rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>Fidget Tool Types:</h3>
        <ul>
          <li><strong>Spinning:</strong> Fidget spinners, tops</li>
          <li><strong>Squeezing:</strong> Stress balls, squishy toys</li>
          <li><strong>Clicking:</strong> Fidget cubes, clickers</li>
          <li><strong>Twisting:</strong> Tangle toys, bendy figures</li>
          <li><strong>Popping:</strong> Pop its, bubble wrap</li>
          <li><strong>Chewing:</strong> Chewelry, chew necklaces (safe oral stimulation)</li>
        </ul>
      </div>
    </div>
  );
}
