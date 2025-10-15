import { Hand } from 'lucide-react';

const basicSigns = [
  { word: 'Hello', sign: '👋', description: 'Wave hand' },
  { word: 'Thank you', sign: '🙏', description: 'Touch fingers to chin, move forward' },
  { word: 'Yes', sign: '👍', description: 'Fist up and down (nodding)' },
  { word: 'No', sign: '👎', description: 'First and second finger open/close' },
  { word: 'Help', sign: '🆘', description: 'Place fist on open palm, lift up' },
  { word: 'Stop', sign: '🛑', description: 'Hand up, palm forward' },
  { word: 'Water', sign: '💧', description: 'W-shape tapped on chin' },
  { word: 'Food', sign: '🍎', description: 'Fingertips to mouth' },
  { word: 'Bathroom', sign: '🚻', description: 'Shake T-shape hand' },
  { word: 'Friend', sign: '🤝', description: 'Hook index fingers together' },
];

export function GestureSigns() {
  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Hand size={24} />
        <h2>Basic Sign Language & Gestures</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Learn essential signs for scout activities
      </p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)'}}>
        {basicSigns.map((sign, i) => (
          <div key={i} style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>{sign.sign}</div>
            <h3 style={{margin: '0 0 var(--space-sm) 0'}}>{sign.word}</h3>
            <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--color-textMuted)'}}>{sign.description}</p>
          </div>
        ))}
      </div>

      <div className="tool-info">
        <h3>Why Learn Signs?</h3>
        <ul>
          <li>Communicate with deaf/hard of hearing scouts</li>
          <li>Silent communication when needed</li>
          <li>Inclusive environment</li>
          <li>Useful skill for all scouts</li>
        </ul>
        <p><strong>Note:</strong> These are simplified. For full ASL, use the Sign Language Guide tool.</p>
      </div>
    </div>
  );
}
