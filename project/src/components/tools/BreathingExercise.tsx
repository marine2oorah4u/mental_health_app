import { useState, useEffect } from 'react';
import { Play, Pause, Wind } from 'lucide-react';

type ExerciseType = 'box' | 'balloon' | 'star';

interface Exercise {
  id: ExerciseType;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const exercises: Exercise[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Breathe in a square pattern',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  {
    id: 'balloon',
    name: 'Balloon Breathing',
    description: 'Imagine filling a balloon',
    inhale: 4,
    hold1: 2,
    exhale: 6,
    hold2: 0,
  },
  {
    id: 'star',
    name: '5-Point Star',
    description: 'Trace a star with your breath',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
  },
];

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeInPhase((prev) => {
        const currentPhaseDuration = selectedExercise[phase];

        if (prev >= currentPhaseDuration) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase(selectedExercise.hold1 > 0 ? 'hold1' : 'exhale');
          } else if (phase === 'hold1') {
            setPhase('exhale');
          } else if (phase === 'exhale') {
            setPhase(selectedExercise.hold2 > 0 ? 'hold2' : 'inhale');
            if (selectedExercise.hold2 === 0) {
              setTotalCycles((c) => c + 1);
            }
          } else if (phase === 'hold2') {
            setPhase('inhale');
            setTotalCycles((c) => c + 1);
          }
          return 0;
        }

        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeInPhase(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeInPhase(0);
    setTotalCycles(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return '#3B82F6'; // Blue
      case 'hold1':
        return '#8B5CF6'; // Purple
      case 'exhale':
        return '#10B981'; // Green
      case 'hold2':
        return '#F59E0B'; // Orange
    }
  };

  const getCircleScale = () => {
    const duration = selectedExercise[phase];
    const progress = timeInPhase / duration;

    if (phase === 'inhale') {
      return 0.5 + (progress * 0.5); // Grow from 0.5 to 1
    } else if (phase === 'exhale') {
      return 1 - (progress * 0.5); // Shrink from 1 to 0.5
    }
    return phase === 'hold1' ? 1 : 0.5; // Stay at size
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Wind size={24} />
        <h2>Breathing Exercise</h2>
      </div>

      <div className="breathing-selector">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise);
              handleReset();
            }}
            className={`breathing-option ${selectedExercise.id === exercise.id ? 'active' : ''}`}
          >
            <div className="breathing-option-name">{exercise.name}</div>
            <div className="breathing-option-desc">{exercise.description}</div>
          </button>
        ))}
      </div>

      <div className="breathing-display">
        <div
          className="breathing-circle"
          style={{
            transform: `scale(${getCircleScale()})`,
            backgroundColor: getPhaseColor(),
            transition: 'transform 1s ease-in-out, background-color 0.5s ease',
          }}
        />
        <div className="breathing-instruction">
          <div className="breathing-phase">{getPhaseText()}</div>
          <div className="breathing-counter">
            {selectedExercise[phase] - timeInPhase}
          </div>
        </div>
      </div>

      <div className="breathing-stats">
        <div className="stat">
          <div className="stat-value">{totalCycles}</div>
          <div className="stat-label">Cycles Completed</div>
        </div>
      </div>

      <div className="timer-controls">
        {!isActive ? (
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
          Reset
        </button>
      </div>

      <div className="tool-info">
        <h3>Benefits:</h3>
        <ul>
          <li>Reduces anxiety and stress</li>
          <li>Helps regain focus and calm</li>
          <li>Perfect before transitions or challenging activities</li>
          <li>Can be done anywhere, anytime</li>
        </ul>
      </div>
    </div>
  );
}
