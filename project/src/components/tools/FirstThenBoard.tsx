import { useState } from 'react';
import { ArrowRight, Save, List } from 'lucide-react';

interface Activity {
  id: string;
  emoji: string;
  name: string;
  category: 'task' | 'fun' | 'transition' | 'care';
}

const activities: Activity[] = [
  // Tasks
  { id: 'work', emoji: '📝', name: 'Work Time', category: 'task' },
  { id: 'clean', emoji: '🧹', name: 'Clean Up', category: 'task' },
  { id: 'homework', emoji: '📚', name: 'Homework', category: 'task' },
  { id: 'practice', emoji: '⚡', name: 'Practice Skill', category: 'task' },
  { id: 'listen', emoji: '👂', name: 'Listen', category: 'task' },
  { id: 'wait', emoji: '⏰', name: 'Wait', category: 'task' },

  // Fun
  { id: 'play', emoji: '🎮', name: 'Play Time', category: 'fun' },
  { id: 'snack', emoji: '🍎', name: 'Snack', category: 'fun' },
  { id: 'outside', emoji: '🌳', name: 'Go Outside', category: 'fun' },
  { id: 'game', emoji: '🎲', name: 'Play Game', category: 'fun' },
  { id: 'craft', emoji: '🎨', name: 'Arts & Crafts', category: 'fun' },
  { id: 'music', emoji: '🎵', name: 'Music', category: 'fun' },
  { id: 'friend', emoji: '👥', name: 'Friend Time', category: 'fun' },

  // Transitions
  { id: 'break', emoji: '⏸️', name: 'Take a Break', category: 'transition' },
  { id: 'move', emoji: '🚶', name: 'Move to...', category: 'transition' },
  { id: 'line-up', emoji: '📍', name: 'Line Up', category: 'transition' },
  { id: 'sit', emoji: '🪑', name: 'Sit Down', category: 'transition' },

  // Self-care
  { id: 'bathroom', emoji: '🚽', name: 'Bathroom', category: 'care' },
  { id: 'eat', emoji: '🍽️', name: 'Eat', category: 'care' },
  { id: 'drink', emoji: '💧', name: 'Drink Water', category: 'care' },
  { id: 'rest', emoji: '😴', name: 'Rest', category: 'care' },
];

interface Board {
  id: string;
  first: Activity;
  then: Activity;
  timestamp: Date;
}

export function FirstThenBoard() {
  const [firstActivity, setFirstActivity] = useState<Activity | null>(null);
  const [thenActivity, setThenActivity] = useState<Activity | null>(null);
  const [savedBoards, setSavedBoards] = useState<Board[]>([]);
  const [selectingFor, setSelectingFor] = useState<'first' | 'then' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'task', label: 'Tasks' },
    { id: 'fun', label: 'Fun' },
    { id: 'transition', label: 'Transitions' },
    { id: 'care', label: 'Self-Care' },
  ];

  const filteredActivities =
    selectedCategory === 'all'
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  const handleActivitySelect = (activity: Activity) => {
    if (selectingFor === 'first') {
      setFirstActivity(activity);
      setSelectingFor(null);
    } else if (selectingFor === 'then') {
      setThenActivity(activity);
      setSelectingFor(null);
    }
  };

  const handleSaveBoard = () => {
    if (!firstActivity || !thenActivity) return;

    const board: Board = {
      id: Date.now().toString(),
      first: firstActivity,
      then: thenActivity,
      timestamp: new Date(),
    };

    setSavedBoards([board, ...savedBoards]);
  };

  const handleLoadBoard = (board: Board) => {
    setFirstActivity(board.first);
    setThenActivity(board.then);
    setSelectingFor(null);
  };

  const handleClear = () => {
    setFirstActivity(null);
    setThenActivity(null);
    setSelectingFor(null);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <ArrowRight size={24} />
        <h2>First-Then Board</h2>
      </div>

      <div className="first-then-intro">
        <p>
          First we do this, THEN we do that! This helps you know what's coming next
          and makes transitions easier.
        </p>
      </div>

      <div className="first-then-board">
        <div className="first-then-column">
          <div className="first-then-label">FIRST</div>
          <button
            onClick={() => setSelectingFor('first')}
            className={`first-then-box ${selectingFor === 'first' ? 'selecting' : ''} ${
              firstActivity ? 'filled' : ''
            }`}
          >
            {firstActivity ? (
              <>
                <div className="first-then-emoji">{firstActivity.emoji}</div>
                <div className="first-then-name">{firstActivity.name}</div>
              </>
            ) : (
              <div className="first-then-placeholder">Tap to choose</div>
            )}
          </button>
        </div>

        <div className="first-then-arrow">
          <ArrowRight size={48} />
        </div>

        <div className="first-then-column">
          <div className="first-then-label">THEN</div>
          <button
            onClick={() => setSelectingFor('then')}
            className={`first-then-box ${selectingFor === 'then' ? 'selecting' : ''} ${
              thenActivity ? 'filled' : ''
            }`}
          >
            {thenActivity ? (
              <>
                <div className="first-then-emoji">{thenActivity.emoji}</div>
                <div className="first-then-name">{thenActivity.name}</div>
              </>
            ) : (
              <div className="first-then-placeholder">Tap to choose</div>
            )}
          </button>
        </div>
      </div>

      <div className="first-then-controls">
        {firstActivity && thenActivity && (
          <button onClick={handleSaveBoard} className="btn btn-primary">
            <Save size={18} />
            Save Board
          </button>
        )}
        {(firstActivity || thenActivity) && (
          <button onClick={handleClear} className="btn btn-secondary">
            Clear
          </button>
        )}
      </div>

      {selectingFor && (
        <div className="first-then-selector">
          <h3>Choose {selectingFor === 'first' ? 'first' : 'then'} activity:</h3>

          <div className="first-then-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="first-then-activities">
            {filteredActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleActivitySelect(activity)}
                className="first-then-activity"
              >
                <div className="first-then-activity-emoji">{activity.emoji}</div>
                <div className="first-then-activity-name">{activity.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {savedBoards.length > 0 && (
        <div className="first-then-saved">
          <h3>
            <List size={20} />
            Saved Boards
          </h3>
          <div className="saved-boards-list">
            {savedBoards.slice(0, 5).map((board) => (
              <button
                key={board.id}
                onClick={() => handleLoadBoard(board)}
                className="saved-board-item"
              >
                <span className="saved-board-emoji">{board.first.emoji}</span>
                <span className="saved-board-text">{board.first.name}</span>
                <ArrowRight size={16} />
                <span className="saved-board-emoji">{board.then.emoji}</span>
                <span className="saved-board-text">{board.then.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="tool-info">
        <h3>How to Use:</h3>
        <ul>
          <li>Choose what needs to happen FIRST</li>
          <li>Choose what will happen THEN (usually something fun!)</li>
          <li>Complete the first activity to earn the then activity</li>
          <li>Helps with transitions and understanding what comes next</li>
          <li>Perfect for visual learners and reducing anxiety</li>
        </ul>
      </div>
    </div>
  );
}
