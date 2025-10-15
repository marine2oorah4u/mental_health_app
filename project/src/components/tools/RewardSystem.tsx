import { useState } from 'react';
import { Star, Trophy, RotateCcw, Plus } from 'lucide-react';

interface RewardGoal {
  id: string;
  name: string;
  tokensNeeded: number;
  tokensEarned: number;
  emoji: string;
  completed: boolean;
}

export function RewardSystem() {
  const [goals, setGoals] = useState<RewardGoal[]>([
    { id: '1', name: 'Free Time', tokensNeeded: 5, tokensEarned: 0, emoji: '🎮', completed: false },
    { id: '2', name: 'Special Snack', tokensNeeded: 10, tokensEarned: 0, emoji: '🍕', completed: false },
    { id: '3', name: 'Choose Activity', tokensNeeded: 15, tokensEarned: 0, emoji: '🎯', completed: false },
  ]);
  const [selectedGoal, setSelectedGoal] = useState<RewardGoal | null>(null);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTokens, setNewGoalTokens] = useState(5);
  const [newGoalEmoji, setNewGoalEmoji] = useState('⭐');

  const emojiOptions = ['⭐', '🎮', '🍕', '🎯', '🎨', '🏆', '🎪', '🎭', '🎬', '📚', '🎵', '🏃', '🚀', '🎁'];

  const handleAddToken = (goalId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId && goal.tokensEarned < goal.tokensNeeded) {
          const newTokens = goal.tokensEarned + 1;
          return {
            ...goal,
            tokensEarned: newTokens,
            completed: newTokens >= goal.tokensNeeded,
          };
        }
        return goal;
      })
    );
  };

  const handleRemoveToken = (goalId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId && goal.tokensEarned > 0) {
          return {
            ...goal,
            tokensEarned: goal.tokensEarned - 1,
            completed: false,
          };
        }
        return goal;
      })
    );
  };

  const handleResetGoal = (goalId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, tokensEarned: 0, completed: false } : goal
      )
    );
  };

  const handleCreateGoal = () => {
    if (!newGoalName.trim()) return;

    const newGoal: RewardGoal = {
      id: Date.now().toString(),
      name: newGoalName,
      tokensNeeded: newGoalTokens,
      tokensEarned: 0,
      emoji: newGoalEmoji,
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setNewGoalName('');
    setNewGoalTokens(5);
    setNewGoalEmoji('⭐');
    setShowNewGoal(false);
  };

  const getProgress = (goal: RewardGoal) => {
    return (goal.tokensEarned / goal.tokensNeeded) * 100;
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Trophy size={24} />
        <h2>Token Reward System</h2>
      </div>

      <div className="reward-intro">
        <p>
          Earn tokens for positive behaviors, completing tasks, or meeting goals.
          When you fill up a goal, you earn the reward!
        </p>
      </div>

      <div className="reward-goals-grid">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`reward-goal-card ${goal.completed ? 'completed' : ''}`}
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="reward-goal-emoji">{goal.emoji}</div>
            <div className="reward-goal-name">{goal.name}</div>

            <div className="reward-progress-bar">
              <div
                className="reward-progress-fill"
                style={{ width: `${getProgress(goal)}%` }}
              />
            </div>

            <div className="reward-tokens-display">
              <div className="reward-tokens-grid">
                {[...Array(goal.tokensNeeded)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`reward-token ${idx < goal.tokensEarned ? 'earned' : ''}`}
                  >
                    <Star size={20} fill={idx < goal.tokensEarned ? 'currentColor' : 'none'} />
                  </div>
                ))}
              </div>
            </div>

            <div className="reward-count">
              {goal.tokensEarned} / {goal.tokensNeeded}
            </div>

            {goal.completed && (
              <div className="reward-completed-badge">
                <Trophy size={16} />
                Earned!
              </div>
            )}
          </div>
        ))}

        <button onClick={() => setShowNewGoal(true)} className="reward-add-goal">
          <Plus size={32} />
          <div>Add New Goal</div>
        </button>
      </div>

      {selectedGoal && (
        <div className="modal-overlay" onClick={() => setSelectedGoal(null)}>
          <div className="modal-content reward-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedGoal(null)}>
              &times;
            </button>

            <div className="reward-modal-header">
              <div className="reward-modal-emoji">{selectedGoal.emoji}</div>
              <h3>{selectedGoal.name}</h3>
            </div>

            <div className="reward-modal-progress">
              <div className="reward-progress-bar-large">
                <div
                  className="reward-progress-fill"
                  style={{ width: `${getProgress(selectedGoal)}%` }}
                />
              </div>
              <div className="reward-modal-count">
                {selectedGoal.tokensEarned} / {selectedGoal.tokensNeeded} tokens
              </div>
            </div>

            {selectedGoal.completed ? (
              <div className="reward-modal-completed">
                <Trophy size={48} />
                <h2>Goal Achieved!</h2>
                <p>Time to enjoy your reward!</p>
                <button
                  onClick={() => {
                    handleResetGoal(selectedGoal.id);
                    setSelectedGoal(null);
                  }}
                  className="btn btn-primary btn-large"
                >
                  <RotateCcw size={20} />
                  Reset Goal
                </button>
              </div>
            ) : (
              <div className="reward-modal-controls">
                <button
                  onClick={() => handleAddToken(selectedGoal.id)}
                  className="btn btn-primary btn-large"
                  disabled={selectedGoal.tokensEarned >= selectedGoal.tokensNeeded}
                >
                  <Star size={20} />
                  Add Token
                </button>
                {selectedGoal.tokensEarned > 0 && (
                  <button
                    onClick={() => handleRemoveToken(selectedGoal.id)}
                    className="btn btn-secondary btn-large"
                  >
                    Remove Token
                  </button>
                )}
                <button
                  onClick={() => {
                    handleResetGoal(selectedGoal.id);
                    setSelectedGoal(null);
                  }}
                  className="btn btn-secondary btn-large"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showNewGoal && (
        <div className="modal-overlay" onClick={() => setShowNewGoal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNewGoal(false)}>
              &times;
            </button>

            <h2>Create New Goal</h2>

            <div className="form-group">
              <label className="form-label">Goal Name</label>
              <input
                type="text"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder="e.g., Extra Recess"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tokens Needed</label>
              <input
                type="range"
                min="3"
                max="20"
                value={newGoalTokens}
                onChange={(e) => setNewGoalTokens(Number(e.target.value))}
                className="timer-slider"
              />
              <div className="reward-token-count">{newGoalTokens} tokens</div>
            </div>

            <div className="form-group">
              <label className="form-label">Choose Emoji</label>
              <div className="reward-emoji-picker">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewGoalEmoji(emoji)}
                    className={`reward-emoji-option ${newGoalEmoji === emoji ? 'selected' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCreateGoal} className="btn btn-primary btn-block btn-large">
              Create Goal
            </button>
          </div>
        </div>
      )}

      <div className="tool-info">
        <h3>How It Works:</h3>
        <ul>
          <li>Set up goals with rewards you want to earn</li>
          <li>Earn tokens for positive behaviors and completed tasks</li>
          <li>Fill up your token chart to earn the reward</li>
          <li>Great for motivation and visual progress tracking</li>
          <li>Perfect for all scouts who benefit from positive reinforcement</li>
        </ul>
      </div>
    </div>
  );
}
