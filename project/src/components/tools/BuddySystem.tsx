import { useState } from 'react';
import { Users, Plus, Shuffle } from 'lucide-react';

interface Scout {
  id: string;
  name: string;
}

export function BuddySystem() {
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [newName, setNewName] = useState('');
  const [pairs, setPairs] = useState<[Scout, Scout][]>([]);

  const addScout = () => {
    if (!newName.trim()) return;
    setScouts(prev => [...prev, { id: Date.now().toString(), name: newName }]);
    setNewName('');
  };

  const makePairs = () => {
    const shuffled = [...scouts].sort(() => Math.random() - 0.5);
    const newPairs: [Scout, Scout][] = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      newPairs.push([shuffled[i], shuffled[i + 1]]);
    }
    setPairs(newPairs);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Users size={24} />
        <h2>Buddy System Pairing</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Randomly pair scouts as buddies for activities
      </p>

      <div style={{display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)'}}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addScout()}
          placeholder="Scout name"
          style={{flex: 1, padding: 'var(--space-md)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)'}}
        />
        <button onClick={addScout} className="btn btn-primary">
          <Plus size={20} />
          Add
        </button>
      </div>

      <div style={{marginBottom: 'var(--space-xl)'}}>
        <h3>Scouts ({scouts.length})</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)'}}>
          {scouts.map(scout => (
            <span key={scout.id} style={{padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-full)'}}>
              {scout.name}
            </span>
          ))}
        </div>
      </div>

      {scouts.length >= 2 && (
        <button onClick={makePairs} className="btn btn-primary" style={{marginBottom: 'var(--space-xl)'}}>
          <Shuffle size={20} />
          Create Buddy Pairs
        </button>
      )}

      {pairs.length > 0 && (
        <div>
          <h3>Buddy Pairs:</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
            {pairs.map((pair, i) => (
              <div key={i} style={{padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                <span style={{fontSize: '1.25rem', fontWeight: 600}}>{pair[0].name}</span>
                <span style={{fontSize: '1.5rem'}}>🤝</span>
                <span style={{fontSize: '1.25rem', fontWeight: 600}}>{pair[1].name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tool-info">
        <h3>Benefits:</h3>
        <ul>
          <li>Reduces social anxiety</li>
          <li>Ensures no one is alone</li>
          <li>Builds friendships</li>
          <li>Safety in pairs</li>
        </ul>
      </div>
    </div>
  );
}
