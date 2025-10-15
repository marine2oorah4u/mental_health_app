import { useState } from 'react';
import { Volume2, VolumeX, Check } from 'lucide-react';

const strategies = [
  { id: '1', title: 'Noise-Canceling Headphones', description: 'Block out background noise', icon: '🎧', level: 'high' },
  { id: '2', title: 'Ear Plugs', description: 'Reduce noise by 20-30dB', icon: '👂', level: 'medium' },
  { id: '3', title: 'Quiet Space Designated', description: 'Set up a quiet retreat area', icon: '🏕️', level: 'high' },
  { id: '4', title: 'Visual Signals', description: 'Use hand signals instead of whistles', icon: '✋', level: 'medium' },
  { id: '5', title: 'Volume Limits', description: 'Keep activities at lower volume', icon: '🔉', level: 'low' },
  { id: '6', title: 'Advance Warning', description: 'Warn before loud activities', icon: '⚠️', level: 'low' },
  { id: '7', title: 'Outdoor vs Indoor', description: 'Choose outdoor spaces for noise', icon: '🌲', level: 'medium' },
  { id: '8', title: 'Scheduled Breaks', description: 'Regular quiet breaks', icon: '⏰', level: 'medium' },
];

export function NoiseReduction() {
  const [implemented, setImplemented] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');

  const toggleStrategy = (id: string) => {
    setImplemented(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = filter === 'all' ? strategies : strategies.filter(s => s.level === filter);

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Volume2 size={24} />
        <h2>Noise Reduction Planner</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Plan and track noise reduction strategies for your activities
      </p>

      <div style={{marginBottom: 'var(--space-xl)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)'}}>
          <strong>Strategies Implemented</strong>
          <span>{implemented.length} / {strategies.length}</span>
        </div>
        <div style={{height: '20px', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-full)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${(implemented.length / strategies.length) * 100}%`, background: 'var(--color-primary)', transition: 'width 0.3s'}}>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap'}}>
        {['all', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + ' Impact'}
          </button>
        ))}
      </div>

      <div style={{display: 'grid', gap: 'var(--space-md)'}}>
        {filtered.map(strategy => (
          <button
            key={strategy.id}
            onClick={() => toggleStrategy(strategy.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-lg)',
              background: implemented.includes(strategy.id) ? 'var(--color-primary)' : 'var(--color-surface)',
              color: implemented.includes(strategy.id) ? 'white' : 'inherit',
              border: `2px solid ${implemented.includes(strategy.id) ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <span style={{fontSize: '2rem'}}>{strategy.icon}</span>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600}}>{strategy.title}</div>
              <div style={{fontSize: '0.875rem', opacity: 0.8}}>{strategy.description}</div>
            </div>
            {implemented.includes(strategy.id) && <Check size={24} />}
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>Why Noise Reduction Matters:</h3>
        <ul>
          <li><strong>Sensory Processing:</strong> Prevents auditory overload</li>
          <li><strong>Focus:</strong> Reduces distractions for ADHD</li>
          <li><strong>Anxiety:</strong> Lower stress in loud environments</li>
          <li><strong>Autism:</strong> Critical for sensory-sensitive scouts</li>
        </ul>
      </div>
    </div>
  );
}
