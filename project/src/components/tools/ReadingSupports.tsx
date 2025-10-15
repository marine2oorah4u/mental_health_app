import { BookOpen } from 'lucide-react';

const supports = [
  { name: 'Larger Text', icon: '🔤', desc: 'Increase font size' },
  { name: 'Highlighting', icon: '✨', desc: 'Color-code important parts' },
  { name: 'Reading Ruler', icon: '📏', desc: 'Track lines with ruler' },
  { name: 'Audio Books', icon: '🎧', desc: 'Listen while reading' },
  { name: 'Picture Guides', icon: '🖼️', desc: 'Visual aids for stories' },
  { name: 'Simplified Text', icon: '📝', desc: 'Plain language versions' },
];

export function ReadingSupports() {
  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <BookOpen size={24} />
        <h2>Reading & Writing Supports</h2>
      </div>
      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Accommodations to support reading and writing activities
      </p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-md)'}}>
        {supports.map((sup, i) => (
          <div key={i} style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>{sup.icon}</div>
            <h3 style={{margin: '0 0 var(--space-sm) 0'}}>{sup.name}</h3>
            <p style={{margin: 0, color: 'var(--color-textMuted)'}}>{sup.desc}</p>
          </div>
        ))}
      </div>
      <div className="tool-info">
        <h3>Who Benefits:</h3>
        <ul>
          <li>Dyslexia</li>
          <li>Visual processing difficulties</li>
          <li>ADHD</li>
          <li>Reading delays</li>
        </ul>
      </div>
    </div>
  );
}
