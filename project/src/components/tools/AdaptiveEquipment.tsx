import { useState } from 'react';
import { Wrench, Check } from 'lucide-react';

const equipment = [
  { name: 'Adapted utensils', use: 'Eating assistance', icon: '🍴' },
  { name: 'Pencil grips', use: 'Writing support', icon: '✏️' },
  { name: 'Modified tools', use: 'Craft activities', icon: '🔧' },
  { name: 'Stabilizing aids', use: 'Balance support', icon: '🦯' },
  { name: 'Communication devices', use: 'AAC support', icon: '💬' },
  { name: 'Positioning cushions', use: 'Seating comfort', icon: '💺' },
];

export function AdaptiveEquipment() {
  const [inventory, setInventory] = useState<number[]>([]);

  const toggle = (index: number) => {
    setInventory(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Wrench size={24} />
        <h2>Adaptive Equipment Tracker</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Track which adaptive equipment you have available
      </p>

      <div style={{marginBottom: 'var(--space-md)'}}>
        <strong>Equipment Available: {inventory.length} / {equipment.length}</strong>
      </div>

      <div style={{display: 'grid', gap: 'var(--space-md)'}}>
        {equipment.map((eq, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-lg)', background: inventory.includes(i) ? 'var(--color-primary)' : 'var(--color-surface)', color: inventory.includes(i) ? 'white' : 'inherit', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left'}}
          >
            <span style={{fontSize: '2rem'}}>{eq.icon}</span>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600}}>{eq.name}</div>
              <div style={{fontSize: '0.875rem', opacity: 0.8}}>{eq.use}</div>
            </div>
            {inventory.includes(i) && <Check size={24} />}
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>Adaptive Equipment Benefits:</h3>
        <ul>
          <li>Enables full participation</li>
          <li>Supports independence</li>
          <li>Reduces frustration</li>
          <li>Promotes inclusion</li>
        </ul>
      </div>
    </div>
  );
}
