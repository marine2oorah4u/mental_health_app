import React, { useState } from 'react';
import { Grid3x3 } from 'lucide-react';

const defaultChoices = [
  { id: '1', text: 'Play outside', icon: '🏃', category: 'activity' },
  { id: '2', text: 'Read a book', icon: '📚', category: 'activity' },
  { id: '3', text: 'Draw', icon: '🎨', category: 'activity' },
  { id: '4', text: 'Build', icon: '🧱', category: 'activity' },
  { id: '5', text: 'Water', icon: '💧', category: 'need' },
  { id: '6', text: 'Snack', icon: '🍎', category: 'need' },
  { id: '7', text: 'Bathroom', icon: '🚻', category: 'need' },
  { id: '8', text: 'Break', icon: '😌', category: 'need' },
  { id: '9', text: 'Happy', icon: '😊', category: 'feeling' },
  { id: '10', text: 'Tired', icon: '😴', category: 'feeling' },
  { id: '11', text: 'Frustrated', icon: '😤', category: 'feeling' },
  { id: '12', text: 'Need help', icon: '🙋', category: 'feeling' },
];

export function ChoiceBoard() {
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');

  const toggleChoice = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = filter === 'all' ? defaultChoices : defaultChoices.filter(c => c.category === filter);

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Grid3x3 size={24} />
        <h2>Visual Choice Board</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Tap pictures to show what you want or how you feel
      </p>

      <div className="choice-filters" style={{display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap'}}>
        {['all', 'activity', 'need', 'feeling'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div style={{padding: 'var(--space-lg)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)'}}>
          <h3>Selected:</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', marginTop: 'var(--space-md)'}}>
            {selected.map(id => {
              const choice = defaultChoices.find(c => c.id === id);
              return choice ? (
                <div key={id} style={{padding: 'var(--space-md)', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '1.5rem'}}>
                  <span style={{marginRight: 'var(--space-sm)'}}>{choice.icon}</span>
                  <span>{choice.text}</span>
                </div>
              ) : null;
            })}
          </div>
          <button onClick={() => setSelected([])} className="btn btn-secondary" style={{marginTop: 'var(--space-md)'}}>Clear</button>
        </div>
      )}

      <div className="choice-grid">
        {filtered.map(choice => (
          <button
            key={choice.id}
            onClick={() => toggleChoice(choice.id)}
            className={selected.includes(choice.id) ? 'choice-card selected' : 'choice-card'}
          >
            <span className="choice-icon">{choice.icon}</span>
            <span className="choice-text">{choice.text}</span>
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>Who Benefits:</h3>
        <ul>
          <li>Non-verbal scouts</li>
          <li>Limited speech</li>
          <li>Autism</li>
        </ul>
      </div>
    </div>
  );
}
