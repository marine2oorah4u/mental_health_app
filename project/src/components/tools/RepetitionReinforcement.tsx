import { useState } from 'react';
import { Repeat, Star } from 'lucide-react';

export function RepetitionReinforcement() {
  const [skill, setSkill] = useState('');
  const [practices, setPractices] = useState<{skill: string; count: number}[]>([]);

  const addSkill = () => {
    if (skill.trim()) {
      setPractices([...practices, { skill, count: 0 }]);
      setSkill('');
    }
  };

  const incrementPractice = (index: number) => {
    const newPractices = [...practices];
    newPractices[index].count++;
    setPractices(newPractices);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Repeat size={24} />
        <h2>Practice Tracker</h2>
      </div>
      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Track skill practice repetitions and earn mastery stars
      </p>

      <div style={{display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)'}}>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Skill to practice"
          style={{flex: 1, padding: 'var(--space-md)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)'}}
        />
        <button onClick={addSkill} className="btn btn-primary">Add</button>
      </div>

      {practices.length === 0 ? (
        <div className="empty-state">
          <Repeat size={48} />
          <p>Add skills to track practice</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
          {practices.map((p, i) => (
            <div key={i} style={{padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h4 style={{margin: 0}}>{p.skill}</h4>
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)'}}>
                  <div>
                    {Array.from({length: Math.min(5, Math.floor(p.count / 3))}).map((_, j) => (
                      <Star key={j} size={20} fill="gold" color="gold" style={{display: 'inline'}} />
                    ))}
                  </div>
                  <button onClick={() => incrementPractice(i)} className="btn btn-primary">
                    Practice #{p.count + 1}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tool-info">
        <h3>Repetition helps:</h3>
        <ul>
          <li>Build muscle memory</li>
          <li>Increase confidence</li>
          <li>Master new skills</li>
          <li>Earn mastery stars every 3 practices!</li>
        </ul>
      </div>
    </div>
  );
}
