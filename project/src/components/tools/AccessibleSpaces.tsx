import { useState } from 'react';
import { Home, Check } from 'lucide-react';

const checklist = [
  { item: 'Clear pathways (no obstacles)', category: 'mobility' },
  { item: 'Good lighting', category: 'visual' },
  { item: 'Quiet zone available', category: 'sensory' },
  { item: 'Accessible restrooms', category: 'mobility' },
  { item: 'Seating options (chairs, floor, standing)', category: 'physical' },
  { item: 'Visual schedules posted', category: 'cognitive' },
  { item: 'Emergency exits marked', category: 'safety' },
  { item: 'Noise level managed', category: 'sensory' },
  { item: 'Temperature comfortable', category: 'sensory' },
  { item: 'Minimal visual clutter', category: 'visual' },
];

export function AccessibleSpaces() {
  const [checked, setChecked] = useState<number[]>([]);

  const toggle = (index: number) => {
    setChecked(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const progress = Math.round((checked.length / checklist.length) * 100);

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Home size={24} />
        <h2>Space Accessibility Checklist</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Ensure your meeting space is accessible for all scouts
      </p>

      <div style={{marginBottom: 'var(--space-xl)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)'}}>
          <strong>Accessibility Score</strong>
          <span>{checked.length} / {checklist.length}</span>
        </div>
        <div style={{height: '24px', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-full)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${progress}%`, background: progress === 100 ? 'var(--color-success)' : 'var(--color-primary)', transition: 'width 0.3s'}}></div>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
        {checklist.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: checked.includes(i) ? 'var(--color-success)' : 'var(--color-surface)', color: checked.includes(i) ? 'white' : 'inherit', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left'}}
          >
            {checked.includes(i) && <Check size={20} />}
            <span style={{flex: 1}}>{item.item}</span>
            <span style={{fontSize: '0.75rem', opacity: 0.8}}>{item.category}</span>
          </button>
        ))}
      </div>

      {progress === 100 && (
        <div style={{marginTop: 'var(--space-xl)', padding: 'var(--space-lg)', background: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-lg)', textAlign: 'center'}}>
          <strong>✅ Fully Accessible Space!</strong>
        </div>
      )}

      <div className="tool-info">
        <h3>Why Accessible Spaces Matter:</h3>
        <p>Creating accessible environments ensures all scouts can participate fully and safely.</p>
      </div>
    </div>
  );
}
