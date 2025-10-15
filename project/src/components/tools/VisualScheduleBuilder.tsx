import { useState } from 'react';
import { Calendar, Plus, Trash2, Save, Download, Clock } from 'lucide-react';

interface ScheduleActivity {
  id: string;
  name: string;
  emoji: string;
  startTime?: string;
  duration?: number;
  notes?: string;
}

const activityTemplates = [
  { emoji: '🌅', name: 'Arrival' },
  { emoji: '🍎', name: 'Snack Time' },
  { emoji: '🍽️', name: 'Lunch' },
  { emoji: '⛺', name: 'Setup Camp' },
  { emoji: '🔥', name: 'Campfire' },
  { emoji: '🎮', name: 'Game Time' },
  { emoji: '🏃', name: 'Physical Activity' },
  { emoji: '🎨', name: 'Craft Activity' },
  { emoji: '📚', name: 'Story Time' },
  { emoji: '🎤', name: 'Songs/Singing' },
  { emoji: '🧭', name: 'Navigation' },
  { emoji: '🪢', name: 'Knot Tying' },
  { emoji: '⏸️', name: 'Break Time' },
  { emoji: '🚽', name: 'Bathroom Break' },
  { emoji: '💧', name: 'Water Break' },
  { emoji: '🏕️', name: 'Free Time' },
  { emoji: '🛏️', name: 'Rest Time' },
  { emoji: '🌙', name: 'Bedtime' },
  { emoji: '🏠', name: 'Departure' },
  { emoji: '🎯', name: 'Custom Activity' },
];

export function VisualScheduleBuilder() {
  const [scheduleTitle, setScheduleTitle] = useState('My Scout Meeting');
  const [activities, setActivities] = useState<ScheduleActivity[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);

  const addActivity = (template: typeof activityTemplates[0]) => {
    const newActivity: ScheduleActivity = {
      id: Date.now().toString(),
      name: template.name,
      emoji: template.emoji,
    };
    setActivities([...activities, newActivity]);
    setShowTemplates(false);
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const updateActivity = (id: string, updates: Partial<ScheduleActivity>) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const moveActivity = (id: string, direction: 'up' | 'down') => {
    const index = activities.findIndex((a) => a.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === activities.length - 1)
    ) {
      return;
    }

    const newActivities = [...activities];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newActivities[index], newActivities[newIndex]] = [
      newActivities[newIndex],
      newActivities[index],
    ];
    setActivities(newActivities);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Calendar size={24} />
        <h2>Visual Schedule Builder</h2>
      </div>

      <div className="schedule-intro">
        <p>
          Create a visual schedule to help scouts know what to expect. Add activities
          with pictures and times. Perfect for reducing anxiety about the unknown!
        </p>
      </div>

      <div className="schedule-title-section">
        <input
          type="text"
          value={scheduleTitle}
          onChange={(e) => setScheduleTitle(e.target.value)}
          placeholder="Schedule Title"
          className="schedule-title-input"
        />
      </div>

      <div className="schedule-controls">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Add Activity
        </button>
        {activities.length > 0 && (
          <>
            <button onClick={handlePrint} className="btn btn-secondary">
              <Download size={18} />
              Print
            </button>
            <button className="btn btn-secondary">
              <Save size={18} />
              Save
            </button>
          </>
        )}
      </div>

      {showTemplates && (
        <div className="schedule-templates">
          <h3>Choose Activity:</h3>
          <div className="schedule-templates-grid">
            {activityTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => addActivity(template)}
                className="schedule-template-button"
              >
                <div className="schedule-template-emoji">{template.emoji}</div>
                <div className="schedule-template-name">{template.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="schedule-empty">
          <Calendar size={48} />
          <p>No activities yet. Click "Add Activity" to start building your schedule!</p>
        </div>
      ) : (
        <div className="schedule-list">
          {activities.map((activity, index) => (
            <div key={activity.id} className="schedule-item">
              <div className="schedule-item-number">{index + 1}</div>
              <div className="schedule-item-emoji">{activity.emoji}</div>
              <div className="schedule-item-content">
                <input
                  type="text"
                  value={activity.name}
                  onChange={(e) =>
                    updateActivity(activity.id, { name: e.target.value })
                  }
                  className="schedule-item-name-input"
                  placeholder="Activity name"
                />
                {editingActivity === activity.id ? (
                  <div className="schedule-item-details">
                    <div className="schedule-detail-row">
                      <Clock size={16} />
                      <input
                        type="time"
                        value={activity.startTime || ''}
                        onChange={(e) =>
                          updateActivity(activity.id, { startTime: e.target.value })
                        }
                        className="schedule-time-input"
                        placeholder="Start time"
                      />
                      <input
                        type="number"
                        value={activity.duration || ''}
                        onChange={(e) =>
                          updateActivity(activity.id, {
                            duration: Number(e.target.value),
                          })
                        }
                        className="schedule-duration-input"
                        placeholder="Duration (min)"
                        min="1"
                      />
                    </div>
                    <textarea
                      value={activity.notes || ''}
                      onChange={(e) =>
                        updateActivity(activity.id, { notes: e.target.value })
                      }
                      placeholder="Notes (optional)"
                      className="schedule-notes-input"
                      rows={2}
                    />
                  </div>
                ) : (
                  <div className="schedule-item-summary">
                    {activity.startTime && (
                      <span className="schedule-time-badge">
                        <Clock size={14} />
                        {activity.startTime}
                      </span>
                    )}
                    {activity.duration && (
                      <span className="schedule-duration-badge">
                        {activity.duration} min
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="schedule-item-actions">
                <button
                  onClick={() =>
                    setEditingActivity(
                      editingActivity === activity.id ? null : activity.id
                    )
                  }
                  className="schedule-action-button"
                  title={editingActivity === activity.id ? 'Collapse' : 'Expand'}
                >
                  {editingActivity === activity.id ? '▲' : '▼'}
                </button>
                <button
                  onClick={() => moveActivity(activity.id, 'up')}
                  className="schedule-action-button"
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveActivity(activity.id, 'down')}
                  className="schedule-action-button"
                  disabled={index === activities.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="schedule-action-button danger"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tool-info">
        <h3>Why Visual Schedules Help:</h3>
        <ul>
          <li>Reduces anxiety about what's coming next</li>
          <li>Helps scouts prepare for transitions</li>
          <li>Provides predictability and structure</li>
          <li>Supports time awareness and planning</li>
          <li>Perfect for autism, ADHD, and anxiety</li>
        </ul>
      </div>

      <style>{`
        @media print {
          .tool-header, .schedule-intro, .schedule-controls, .tool-info,
          .schedule-item-actions, nav, footer {
            display: none !important;
          }
          .schedule-list {
            page-break-inside: avoid;
          }
          .schedule-item {
            page-break-inside: avoid;
            border: 2px solid #000;
            padding: 1rem;
            margin-bottom: 0.5rem;
          }
          .schedule-item-emoji {
            font-size: 3rem;
          }
          .schedule-item-name-input {
            border: none;
            font-size: 1.5rem;
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
}
