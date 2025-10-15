import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const templates = [
  { label: 'I need help', icon: '🆘' },
  { label: 'I need a break', icon: '⏸️' },
  { label: 'I am ready', icon: '✅' },
  { label: 'I do not understand', icon: '❓' },
  { label: 'That is too loud', icon: '🔊' },
  { label: 'Can you repeat that', icon: '🔁' },
  { label: 'I feel overwhelmed', icon: '😰' },
  { label: 'Thank you', icon: '🙏' },
];

export function ClearCommunication() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <MessageCircle size={24} />
        <h2>Simple Message Creator</h2>
      </div>
      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Tap to select a clear, simple message
      </p>

      {selected && (
        <div style={{padding: 'var(--space-xxl)', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-lg)', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--space-xl)'}}>
          {templates.find(t => t.label === selected)?.icon} {selected}
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)'}}>
        {templates.map((t, i) => (
          <button
            key={i}
            onClick={() => setSelected(t.label)}
            style={{padding: 'var(--space-xl)', background: selected === t.label ? 'var(--color-primary)' : 'var(--color-surface)', color: selected === t.label ? 'white' : 'inherit', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600}}
          >
            <div style={{fontSize: '2rem', marginBottom: 'var(--space-sm)'}}>{t.icon}</div>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>Simple communication helps:</h3>
        <ul>
          <li>Reduce misunderstandings</li>
          <li>Express needs quickly</li>
          <li>Support non-verbal scouts</li>
        </ul>
      </div>
    </div>
  );
}
