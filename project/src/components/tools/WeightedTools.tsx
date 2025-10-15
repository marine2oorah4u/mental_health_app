import { useState } from 'react';
import { Scale, Plus } from 'lucide-react';

interface WeightedItem {
  id: string;
  name: string;
  weight: string;
  effectiveness: number;
  notes: string;
}

const suggestions = [
  { name: 'Weighted blanket', weight: '5-15 lbs', icon: '🛏️' },
  { name: 'Weighted vest', weight: '2-5 lbs', icon: '🦺' },
  { name: 'Lap pad', weight: '3-5 lbs', icon: '▪️' },
  { name: 'Weighted stuffed animal', weight: '1-3 lbs', icon: '🧸' },
  { name: 'Ankle/wrist weights', weight: '0.5-2 lbs', icon: '⚖️' },
];

export function WeightedTools() {
  const [items, setItems] = useState<WeightedItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const addItem = (suggestion: typeof suggestions[0]) => {
    const item: WeightedItem = {
      id: Date.now().toString(),
      name: suggestion.name,
      weight: suggestion.weight,
      effectiveness: 0,
      notes: '',
    };
    setItems(prev => [...prev, item]);
    setShowAdd(false);
  };

  const updateEffectiveness = (id: string, rating: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, effectiveness: rating } : i));
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Scale size={24} />
        <h2>Weighted Tools Tracker</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Track which weighted tools help with calming and focus
      </p>

      <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary" style={{marginBottom: 'var(--space-lg)'}}>
        <Plus size={20} />
        Add Weighted Tool
      </button>

      {showAdd && (
        <div style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)'}}>
          <h3>Choose a weighted tool:</h3>
          <div style={{display: 'grid', gap: 'var(--space-md)', marginTop: 'var(--space-lg)'}}>
            {suggestions.map(sug => (
              <button
                key={sug.name}
                onClick={() => addItem(sug)}
                style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-lg)', background: 'white', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left'}}
              >
                <span style={{fontSize: '2rem'}}>{sug.icon}</span>
                <div>
                  <div style={{fontWeight: 600}}>{sug.name}</div>
                  <div style={{fontSize: '0.875rem', color: 'var(--color-textMuted)'}}>{sug.weight}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3>My Weighted Tools ({items.length})</h3>
        {items.length === 0 ? (
          <div className="empty-state">
            <Scale size={48} />
            <p>Add weighted tools to track their effectiveness</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
            {items.map(item => (
              <div key={item.id} style={{padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)'}}>
                  <div>
                    <h4 style={{margin: 0}}>{item.name}</h4>
                    <span style={{fontSize: '0.875rem', color: 'var(--color-textMuted)'}}>{item.weight}</span>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-xs)'}}>Helpful?</div>
                    <div style={{display: 'flex', gap: '4px'}}>
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => updateEffectiveness(item.id, star)}
                          className={star <= item.effectiveness ? 'star-btn active' : 'star-btn'}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>About Weighted Tools:</h3>
        <ul>
          <li><strong>Deep Pressure:</strong> Provides calming sensory input</li>
          <li><strong>Focus:</strong> Helps with attention and concentration</li>
          <li><strong>Anxiety:</strong> Reduces stress and anxiety</li>
          <li><strong>Safety:</strong> Use 10% of body weight as guideline</li>
        </ul>
      </div>
    </div>
  );
}
