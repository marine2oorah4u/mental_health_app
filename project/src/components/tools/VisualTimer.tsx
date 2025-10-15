import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export function VisualTimer() {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const playSound = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStart = () => {
    if (showSettings) {
      setTimeLeft(duration * 60);
      setShowSettings(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setShowSettings(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  const getColor = () => {
    const progress = getProgress();
    if (progress < 50) return '#10B981'; // Green
    if (progress < 80) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Clock size={24} />
        <h2>Visual Timer</h2>
      </div>

      {showSettings ? (
        <div className="timer-settings">
          <label className="form-label">
            Set Duration (minutes)
          </label>
          <div className="timer-presets">
            {[1, 3, 5, 10, 15, 20, 30].map((min) => (
              <button
                key={min}
                onClick={() => setDuration(min)}
                className={`preset-button ${duration === min ? 'active' : ''}`}
              >
                {min}m
              </button>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="60"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="timer-slider"
          />
          <div className="timer-display-large">
            {duration} {duration === 1 ? 'minute' : 'minutes'}
          </div>
        </div>
      ) : (
        <div className="timer-display">
          <div className="timer-circle" style={{ '--progress': getProgress(), '--color': getColor() } as any}>
            <svg viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={getColor()}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="timer-time">
              <div className="timer-minutes">{minutes}</div>
              <div className="timer-separator">:</div>
              <div className="timer-seconds">{seconds.toString().padStart(2, '0')}</div>
            </div>
          </div>

          {timeLeft === 0 && (
            <div className="timer-complete">
              <span className="timer-complete-emoji">🎉</span>
              <p>Time's up!</p>
            </div>
          )}
        </div>
      )}

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="btn btn-primary btn-large">
            <Play size={20} />
            Start
          </button>
        ) : (
          <button onClick={handlePause} className="btn btn-secondary btn-large">
            <Pause size={20} />
            Pause
          </button>
        )}
        <button onClick={handleReset} className="btn btn-secondary btn-large">
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="tool-info">
        <h3>How to Use:</h3>
        <ul>
          <li>Set your desired time</li>
          <li>Click Start to begin countdown</li>
          <li>Watch the circle fill up as time passes</li>
          <li>Green = plenty of time, Yellow = halfway, Red = almost done</li>
          <li>You'll hear a gentle sound when time's up</li>
        </ul>
      </div>
    </div>
  );
}
