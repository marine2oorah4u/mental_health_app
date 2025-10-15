import { useState } from 'react';
import { Battery, Play, Pause } from 'lucide-react';

export function FatigueManagement() {
  const [energy, setEnergy] = useState(5);
  const [breaks, setBreaks] = useState<{time: string; energy: number}[]>([]);
  const [isActive, setIsActive] = useState(false);

  const logBreak = () => {
    const now = new Date().toLocaleTimeString();
    setBreaks([...breaks, { time: now, energy }]);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Battery size={24} />
        <h2>Energy & Break Tracker</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Track energy levels and schedule breaks
      </p>

      <div style={{padding: 'var(--space-xxl)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)', textAlign: 'center'}}>
        <h3>Current Energy Level</h3>
        <div style={{fontSize: '4rem', margin: 'var(--space-lg) 0'}}>
          {energy <= 2 ? '🔴' : energy <= 4 ? '🟡' : '🟢'}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          style={{width: '100%'}}
        />
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-sm)', fontSize: '0.875rem'}}>
          <span>Empty</span>
          <span>Low</span>
          <span>Medium</span>
          <span>Good</span>
          <span>Full</span>
        </div>
      </div>

      {energy <= 2 && (
        <div style={{padding: 'var(--space-lg)', background: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)', textAlign: 'center'}}>
          <strong>⚠️ Low Energy - Time for a Break!</strong>
        </div>
      )}

      <button onClick={logBreak} className="btn btn-primary" style={{marginBottom: 'var(--space-xl)', width: '100%'}}>
        Log Break
      </button>

      <div>
        <h3>Break History ({breaks.length})</h3>
        {breaks.length === 0 ? (
          <div className="empty-state">
            <Battery size={48} />
            <p>No breaks logged yet</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
            {breaks.slice(-5).reverse().map((b, i) => (
              <div key={i} style={{padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between'}}>
                <span>{b.time}</span>
                <span>Energy: {b.energy}/5</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>Fatigue Management Tips:</h3>
        <ul>
          <li>Take breaks before energy is depleted</li>
          <li>Rest in quiet space</li>
          <li>Stay hydrated</li>
          <li>Communicate when tired</li>
        </ul>
      </div>
    </div>
  );
}
