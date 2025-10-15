import { useState } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';

const activityOptions = [
  '⛺ Opening Circle', '🎯 Skills Station', '🎨 Craft Activity', '🏃 Physical Game',
  '🍎 Snack Break', '🎵 Song Time', '📖 Story Time', '🏕️ Campfire',
  '🧭 Navigation', '⚡ Service Project', '🎭 Skit Practice', '🏆 Awards Ceremony'
];

export function VisualSchedule() {
  const [schedule, setSchedule] = useState<string[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);

  const addActivity = (activity: string) => {
    setSchedule(prev => [...prev, activity]);
  };

  const toggleComplete = (index: number) => {
    setCompleted(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Calendar size={24} />
        <h2>Visual Schedule Board</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Build a visual schedule for your meeting or event
      </p>

      <div style={{marginBottom: 'var(--space-xl)'}}>
        <h3>Add Activities:</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-sm)'}}>
          {activityOptions.map((activity, i) => (
            <button
              key={i}
              onClick={() => addActivity(activity)}
              className="btn btn-secondary"
              style={{fontSize: '0.875rem'}}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Today's Schedule ({schedule.length} activities)</h3>
        {schedule.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>Add activities to build your schedule</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
            {schedule.map((activity, index) => (
              <button
                key={index}
                onClick={() => toggleComplete(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-lg)',
                  background: completed.includes(index) ? 'var(--color-success)' : 'var(--color-surface)',
                  color: completed.includes(index) ? 'white' : 'inherit',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textDecoration: completed.includes(index) ? 'line-through' : 'none',
                  textAlign: 'left'
                }}
              >
                <span style={{fontSize: '1.5rem', fontWeight: 'bold', minWidth: '40px'}}>{index + 1}</span>
                <span style={{fontSize: '1.25rem', flex: 1}}>{activity}</span>
                {completed.includes(index) && <Check size={24} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>Benefits:</h3>
        <ul>
          <li>Reduces anxiety about transitions</li>
          <li>Provides predictability</li>
          <li>Visual reference for all scouts</li>
        </ul>
      </div>
    </div>
  );
}
