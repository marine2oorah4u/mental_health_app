import { useState } from 'react';
import { Package, Plus, Check } from 'lucide-react';

const kitItems = [
  { id: '1', name: 'Noise-canceling headphones', category: 'auditory', icon: '🎧' },
  { id: '2', name: 'Sunglasses/hat', category: 'visual', icon: '🕶️' },
  { id: '3', name: 'Fidget tools', category: 'tactile', icon: '🎲' },
  { id: '4', name: 'Stress ball', category: 'tactile', icon: '⚽' },
  { id: '5', name: 'Chewing gum/snacks', category: 'oral', icon: '🍬' },
  { id: '6', name: 'Water bottle', category: 'oral', icon: '💧' },
  { id: '7', name: 'Weighted lap pad', category: 'proprioceptive', icon: '🔲' },
  { id: '8', name: 'Comfort item', category: 'emotional', icon: '🧸' },
  { id: '9', name: 'Cooling towel', category: 'temperature', icon: '🧊' },
  { id: '10', name: 'Hand warmers', category: 'temperature', icon: '🔥' },
  { id: '11', name: 'Ear plugs', category: 'auditory', icon: '👂' },
  { id: '12', name: 'Eye mask', category: 'visual', icon: '😴' },
];

export function SensoryKit() {
  const [packed, setPacked] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setPacked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const progress = Math.round((packed.length / kitItems.length) * 100);

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Package size={24} />
        <h2>Sensory Kit Packing List</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Check off items as you pack your portable sensory kit for activities
      </p>

      <div style={{marginBottom: 'var(--space-xl)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)'}}>
          <strong>Packing Progress</strong>
          <span>{packed.length} / {kitItems.length} items</span>
        </div>
        <div style={{height: '20px', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-full)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${progress}%`, background: 'var(--color-primary)', transition: 'width 0.3s'}}>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)'}}>
        {['all', 'auditory', 'visual', 'tactile', 'oral', 'proprioceptive', 'emotional', 'temperature'].map(cat => (
          <button
            key={cat}
            className="btn btn-secondary btn-small"
          >
            {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div style={{display: 'grid', gap: 'var(--space-md)'}}>
        {kitItems.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-lg)',
              background: packed.includes(item.id) ? 'var(--color-primary)' : 'var(--color-surface)',
              color: packed.includes(item.id) ? 'white' : 'inherit',
              border: `2px solid ${packed.includes(item.id) ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <span style={{fontSize: '2rem'}}>{item.icon}</span>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600}}>{item.name}</div>
              <div style={{fontSize: '0.875rem', opacity: 0.8}}>{item.category}</div>
            </div>
            {packed.includes(item.id) && <Check size={24} />}
          </button>
        ))}
      </div>

      {packed.length === kitItems.length && (
        <div style={{marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', background: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-lg)', textAlign: 'center'}}>
          <h3 style={{margin: 0}}>✅ Kit Complete!</h3>
          <p style={{margin: '0.5rem 0 0 0'}}>All sensory items packed and ready!</p>
        </div>
      )}

      <div className="tool-info">
        <h3>Why a Sensory Kit?</h3>
        <p>Having sensory tools on hand helps scouts self-regulate during activities and prevents sensory overload.</p>
      </div>
    </div>
  );
}
