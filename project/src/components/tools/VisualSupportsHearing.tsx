import { Eye } from 'lucide-react';

const strategies = [
  { strategy: 'Written Instructions', visual: '📝', description: 'Provide written backup for all verbal instructions' },
  { strategy: 'Visual Schedule', visual: '📅', description: 'Post schedule where everyone can see it' },
  { strategy: 'Hand Signals', visual: '✋', description: 'Use agreed-upon hand signals for common words' },
  { strategy: 'Gesture Cues', visual: '👆', description: 'Point to what you are talking about' },
  { strategy: 'Picture Cards', visual: '🖼️', description: 'Use picture cards for activities and needs' },
  { strategy: 'Whiteboard/Charts', visual: '⬜', description: 'Write key points during meetings' },
];

export function VisualSupportsHearing() {
  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Eye size={24} />
        <h2>Visual Communication Supports</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Visual strategies to support scouts who are deaf or hard of hearing
      </p>

      <div style={{display: 'grid', gap: 'var(--space-md)'}}>
        {strategies.map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)'}}>
            <div style={{fontSize: '3rem'}}>{s.visual}</div>
            <div style={{flex: 1}}>
              <h3 style={{margin: '0 0 var(--space-sm) 0'}}>{s.strategy}</h3>
              <p style={{margin: 0, color: 'var(--color-textMuted)'}}>{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="tool-info">
        <h3>Additional Tips:</h3>
        <ul>
          <li>Face the scout when speaking</li>
          <li>Ensure good lighting on faces</li>
          <li>Reduce background noise</li>
          <li>Speak clearly (not louder)</li>
          <li>Check for understanding</li>
        </ul>
      </div>
    </div>
  );
}
