import { useState, useEffect } from 'react';
import { Vibrate, Heart, Zap, Waves, AlertCircle } from 'lucide-react';

interface VibrationPattern {
  id: string;
  name: string;
  emoji: string;
  pattern: number[];
  description: string;
  helps: string;
}

export function VibrationTool() {
  const [isSupported, setIsSupported] = useState(false);
  const [activePattern, setActivePattern] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported('vibrate' in navigator);
  }, []);

  const patterns: VibrationPattern[] = [
    {
      id: 'single-tap',
      name: 'Single Tap',
      emoji: '👆',
      pattern: [100],
      description: 'Quick single vibration',
      helps: 'Get attention, simple alert',
    },
    {
      id: 'double-tap',
      name: 'Double Tap',
      emoji: '✌️',
      pattern: [100, 50, 100],
      description: 'Two quick taps',
      helps: 'Notification, reminder',
    },
    {
      id: 'heartbeat',
      name: 'Heartbeat',
      emoji: '💓',
      pattern: [100, 50, 100, 400],
      description: 'Rhythm like a heartbeat',
      helps: 'Grounding, anxiety relief, focus on body',
    },
    {
      id: 'wave',
      name: 'Wave Pattern',
      emoji: '🌊',
      pattern: [200, 100, 300, 100, 400, 100, 300, 100, 200],
      description: 'Rising and falling intensity',
      helps: 'Calming, sensory input, meditation',
    },
    {
      id: 'pulse',
      name: 'Steady Pulse',
      emoji: '⏱️',
      pattern: [200, 200, 200, 200, 200, 200],
      description: 'Even, steady rhythm',
      helps: 'Time awareness, pacing, rhythm',
    },
    {
      id: 'alert',
      name: 'Alert',
      emoji: '⚠️',
      pattern: [300, 100, 300, 100, 300],
      description: 'Strong attention-getting pattern',
      helps: 'Emergency alert, important reminder',
    },
    {
      id: 'breathing',
      name: 'Breathing Guide',
      emoji: '🫁',
      pattern: [4000, 2000, 4000, 2000],
      description: 'Inhale (long), hold (short), exhale (long)',
      helps: 'Breathing exercise, anxiety reduction',
    },
    {
      id: 'sos',
      name: 'SOS Signal',
      emoji: '🆘',
      pattern: [100, 50, 100, 50, 100, 200, 300, 50, 300, 50, 300, 200, 100, 50, 100, 50, 100],
      description: 'Morse code SOS (... --- ...)',
      helps: 'Emergency signal, get help',
    },
  ];

  const triggerVibration = (pattern: number[], patternId: string) => {
    if (!isSupported) {
      alert('Vibration is not supported on this device.');
      return;
    }

    try {
      navigator.vibrate(pattern);
      setActivePattern(patternId);

      const totalDuration = pattern.reduce((a, b) => a + b, 0);
      setTimeout(() => {
        setActivePattern(null);
      }, totalDuration);
    } catch (error) {
      console.error('Vibration error:', error);
    }
  };

  const stopVibration = () => {
    if (isSupported) {
      navigator.vibrate(0);
      setActivePattern(null);
    }
  };

  if (!isSupported) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <Vibrate size={24} />
          <h2>Vibration/Haptic Tool</h2>
        </div>
        <div className="vibration-unsupported">
          <AlertCircle size={48} />
          <h3>Vibration Not Available</h3>
          <p>
            Vibration/haptic feedback is not supported on this device or browser.
            Try opening this app on a mobile device with vibration support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Vibrate size={24} />
        <h2>Vibration/Haptic Tool</h2>
      </div>

      <div className="vibration-intro">
        <p>
          Use vibration patterns for sensory regulation, grounding, anxiety relief, or as a
          gentle reminder. Haptic feedback provides physical sensory input that can be
          calming and regulating.
        </p>
      </div>

      {activePattern && (
        <div className="vibration-active-indicator">
          <div className="vibration-animation">
            <Vibrate size={48} className="vibrating" />
          </div>
          <p>Vibrating: {patterns.find(p => p.id === activePattern)?.name}</p>
          <button onClick={stopVibration} className="btn btn-danger">
            Stop Vibration
          </button>
        </div>
      )}

      <div className="vibration-patterns-grid">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => triggerVibration(pattern.pattern, pattern.id)}
            disabled={activePattern === pattern.id}
            className={`vibration-pattern-card ${activePattern === pattern.id ? 'active' : ''}`}
          >
            <div className="vibration-pattern-emoji">{pattern.emoji}</div>
            <h3>{pattern.name}</h3>
            <p className="vibration-pattern-description">{pattern.description}</p>
            <div className="vibration-pattern-helps">
              <strong>Helps with:</strong> {pattern.helps}
            </div>
            {activePattern === pattern.id ? (
              <div className="vibration-pattern-status active">
                <Vibrate size={16} />
                Vibrating...
              </div>
            ) : (
              <div className="vibration-pattern-status">Tap to feel</div>
            )}
          </button>
        ))}
      </div>

      <div className="vibration-custom">
        <h3>Quick Actions:</h3>
        <div className="vibration-quick-actions">
          <button
            onClick={() => triggerVibration([50], 'quick')}
            className="btn btn-secondary"
          >
            <Zap size={18} />
            Quick Tap
          </button>
          <button
            onClick={() => triggerVibration([100, 50, 100, 50, 100], 'repeat')}
            className="btn btn-secondary"
          >
            <Waves size={18} />
            Repeat Pattern
          </button>
          <button
            onClick={() => triggerVibration([1000], 'long')}
            className="btn btn-secondary"
          >
            <Heart size={18} />
            Long Press
          </button>
        </div>
      </div>

      <div className="tool-info">
        <h3>How Vibration Helps:</h3>
        <ul>
          <li><strong>Sensory Regulation:</strong> Provides consistent physical input</li>
          <li><strong>Grounding:</strong> Brings awareness back to body and present moment</li>
          <li><strong>Anxiety Relief:</strong> Rhythmic patterns can be calming</li>
          <li><strong>Focus:</strong> Physical reminder to stay on task</li>
          <li><strong>Communication:</strong> Non-verbal signal or alert</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Autism:</strong> Sensory seeking, self-regulation</li>
          <li><strong>ADHD:</strong> Physical reminder, focus tool</li>
          <li><strong>Anxiety:</strong> Grounding technique, panic prevention</li>
          <li><strong>Sensory Processing:</strong> Controlled tactile input</li>
          <li><strong>Deaf/Hard of Hearing:</strong> Alternative to audio alerts</li>
        </ul>
        <h3>Tips for Use:</h3>
        <ul>
          <li>Start with gentle patterns and increase as needed</li>
          <li>Use breathing pattern during anxiety or panic</li>
          <li>Heartbeat pattern helps with emotional regulation</li>
          <li>SOS pattern for emergencies or getting attention</li>
          <li>Some people find vibration calming, others alerting - experiment!</li>
        </ul>
      </div>
    </div>
  );
}
