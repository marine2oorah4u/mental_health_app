import { useState, useEffect } from 'react';
import { Zap, Play, RotateCcw, Trophy } from 'lucide-react';

interface MovementActivity {
  id: string;
  name: string;
  emoji: string;
  duration: number; // seconds
  description: string;
  instructions: string[];
}

const activities: MovementActivity[] = [
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    emoji: '🤸',
    duration: 30,
    description: 'Get your energy out with jumping jacks',
    instructions: ['Stand with feet together', 'Jump and spread arms and legs', 'Jump back to start', 'Repeat!'],
  },
  {
    id: 'star-jumps',
    name: 'Star Jumps',
    emoji: '⭐',
    duration: 30,
    description: 'Jump high and make a star shape',
    instructions: ['Crouch down low', 'Jump up high', 'Spread arms and legs like a star', 'Land softly'],
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    emoji: '🔄',
    duration: 30,
    description: 'Big circles with your arms',
    instructions: ['Stand tall', 'Stretch arms out', 'Make big circles forward', 'Then backward'],
  },
  {
    id: 'march-in-place',
    name: 'March in Place',
    emoji: '🚶',
    duration: 30,
    description: 'March like you\'re in a parade',
    instructions: ['Stand tall', 'Lift knees high', 'Swing arms', 'March to the beat'],
  },
  {
    id: 'stretch-reach',
    name: 'Stretch & Reach',
    emoji: '🙆',
    duration: 30,
    description: 'Reach for the sky',
    instructions: ['Stand on tiptoes', 'Reach arms up high', 'Hold and breathe', 'Relax down'],
  },
  {
    id: 'twist-turns',
    name: 'Twist & Turn',
    emoji: '🌀',
    duration: 30,
    description: 'Twist your body side to side',
    instructions: ['Stand with feet apart', 'Put hands on hips', 'Twist left', 'Twist right'],
  },
  {
    id: 'silly-shakes',
    name: 'Silly Shakes',
    emoji: '🤪',
    duration: 30,
    description: 'Shake everything out',
    instructions: ['Shake your hands', 'Shake your feet', 'Wiggle your whole body', 'Be silly!'],
  },
  {
    id: 'balance-pose',
    name: 'Balance Pose',
    emoji: '🧘',
    duration: 30,
    description: 'Stand on one foot like a flamingo',
    instructions: ['Stand on one foot', 'Arms out for balance', 'Hold steady', 'Switch feet'],
  },
  {
    id: 'knee-lifts',
    name: 'High Knee Lifts',
    emoji: '🦵',
    duration: 30,
    description: 'Lift those knees high',
    instructions: ['Stand tall', 'Lift right knee to chest', 'Lift left knee to chest', 'Alternate quickly'],
  },
  {
    id: 'toe-touches',
    name: 'Toe Touches',
    emoji: '👇',
    duration: 30,
    description: 'Bend and touch your toes',
    instructions: ['Stand with feet apart', 'Bend forward slowly', 'Try to touch toes', 'Come back up'],
  },
];

export function MovementBreaks() {
  const [selectedActivity, setSelectedActivity] = useState<MovementActivity | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (selectedActivity) {
      setTimeLeft(selectedActivity.duration);
    }
  }, [selectedActivity]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setCompletedCount((c) => c + 1);
            playCompleteSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const playCompleteSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleStart = () => {
    if (!selectedActivity) return;
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    if (selectedActivity) {
      setTimeLeft(selectedActivity.duration);
    }
  };

  const handleRandomActivity = () => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    setSelectedActivity(activities[randomIndex]);
    setIsActive(false);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Zap size={24} />
        <h2>Movement Breaks</h2>
      </div>

      <div className="movement-intro">
        <p>
          Quick movement activities to help you focus and feel great!
          Perfect for when you need to get the wiggles out.
        </p>
        <button
          onClick={handleRandomActivity}
          className="btn btn-primary"
          style={{ marginTop: 'var(--space-md)' }}
        >
          🎲 Pick Random Activity
        </button>
      </div>

      {completedCount > 0 && (
        <div className="movement-stats">
          <Trophy size={20} />
          <span>Activities Completed: {completedCount}</span>
        </div>
      )}

      {selectedActivity && (
        <div className="movement-selected">
          <div className="movement-card">
            <div className="movement-emoji">{selectedActivity.emoji}</div>
            <h3>{selectedActivity.name}</h3>
            <p className="movement-description">{selectedActivity.description}</p>

            <div className="movement-timer">
              <div className="movement-timer-circle">
                <div className="movement-timer-number">{timeLeft}</div>
                <div className="movement-timer-label">seconds</div>
              </div>
              {timeLeft === 0 && (
                <div className="movement-complete-badge">
                  🎉 Great job!
                </div>
              )}
            </div>

            <div className="timer-controls">
              {!isActive && timeLeft > 0 ? (
                <button onClick={handleStart} className="btn btn-primary btn-large">
                  <Play size={20} />
                  Start
                </button>
              ) : null}
              {timeLeft === 0 && (
                <button onClick={handleReset} className="btn btn-primary btn-large">
                  <RotateCcw size={20} />
                  Do Again
                </button>
              )}
              <button onClick={() => setSelectedActivity(null)} className="btn btn-secondary btn-large">
                Choose Different
              </button>
            </div>

            <div className="movement-instructions">
              <h4>How to do it:</h4>
              <ol>
                {selectedActivity.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {!selectedActivity && (
        <div className="movement-grid">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className="movement-activity-button"
            >
              <div className="movement-activity-emoji">{activity.emoji}</div>
              <div className="movement-activity-name">{activity.name}</div>
              <div className="movement-activity-time">{activity.duration}s</div>
            </button>
          ))}
        </div>
      )}

      <div className="tool-info">
        <h3>Why Movement Breaks?</h3>
        <ul>
          <li>Helps you focus better after moving</li>
          <li>Gets energy out in a positive way</li>
          <li>Perfect for ADHD, sensory needs, or just feeling restless</li>
          <li>Use between activities or when focus is fading</li>
        </ul>
      </div>
    </div>
  );
}
