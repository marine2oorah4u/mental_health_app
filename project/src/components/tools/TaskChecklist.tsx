import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Save, RotateCcw } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const checklistTemplates = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    emoji: '🌅',
    tasks: [
      'Wake up',
      'Get dressed',
      'Brush teeth',
      'Eat breakfast',
      'Pack my bag',
    ],
  },
  {
    id: 'camping-prep',
    name: 'Camping Checklist',
    emoji: '⛺',
    tasks: [
      'Pack sleeping bag',
      'Pack clothes',
      'Pack toiletries',
      'Pack flashlight',
      'Pack water bottle',
      'Pack snacks',
    ],
  },
  {
    id: 'cleanup',
    name: 'Cleanup Tasks',
    emoji: '🧹',
    tasks: [
      'Put away materials',
      'Throw away trash',
      'Push in chairs',
      'Help buddy',
      'Line up quietly',
    ],
  },
  {
    id: 'meeting-tasks',
    name: 'Meeting Tasks',
    emoji: '📋',
    tasks: [
      'Arrive on time',
      'Find my spot',
      'Listen to leader',
      'Participate in activity',
      'Help with cleanup',
    ],
  },
  {
    id: 'custom',
    name: 'Custom Checklist',
    emoji: '✏️',
    tasks: [],
  },
];

export function TaskChecklist() {
  const [checklistName, setChecklistName] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showTemplates, setShowTemplates] = useState(true);

  const loadTemplate = (templateId: string) => {
    const template = checklistTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setChecklistName(template.name);
    setTasks(
      template.tasks.map((text, idx) => ({
        id: `${Date.now()}-${idx}`,
        text,
        completed: false,
      }))
    );
    setShowTemplates(false);
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const resetChecklist = () => {
    setTasks(tasks.map((t) => ({ ...t, completed: false })));
  };

  const clearAll = () => {
    setChecklistName('');
    setTasks([]);
    setShowTemplates(true);
  };

  const getProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (showTemplates) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <CheckSquare size={24} />
          <h2>Task Checklist</h2>
        </div>

        <div className="checklist-intro">
          <p>
            Visual checklists help break down tasks and track progress. Choose a template
            or create your own custom checklist.
          </p>
        </div>

        <div className="checklist-templates-grid">
          {checklistTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.id)}
              className="checklist-template-button"
            >
              <div className="checklist-template-emoji">{template.emoji}</div>
              <div className="checklist-template-name">{template.name}</div>
              {template.tasks.length > 0 && (
                <div className="checklist-template-count">
                  {template.tasks.length} tasks
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="tool-info">
          <h3>Why Checklists Help:</h3>
          <ul>
            <li>Break big tasks into smaller steps</li>
            <li>Provide clear visual progress</li>
            <li>Reduce overwhelm and anxiety</li>
            <li>Build independence and confidence</li>
            <li>Perfect for ADHD, autism, and executive function support</li>
          </ul>
        </div>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <CheckSquare size={24} />
        <h2>Task Checklist</h2>
      </div>

      <div className="checklist-header">
        <input
          type="text"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          placeholder="Checklist Name"
          className="checklist-name-input"
        />
        <div className="checklist-controls">
          <button onClick={clearAll} className="btn btn-secondary">
            ← Choose Different
          </button>
          <button onClick={resetChecklist} className="btn btn-secondary">
            <RotateCcw size={18} />
            Reset All
          </button>
          <button className="btn btn-secondary">
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="checklist-progress">
          <div className="checklist-progress-bar">
            <div
              className="checklist-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="checklist-progress-text">
            {progress}% Complete ({tasks.filter((t) => t.completed).length} of {tasks.length})
          </div>
        </div>
      )}

      <div className="checklist-add-task">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="checklist-task-input"
        />
        <button onClick={addTask} className="btn btn-primary">
          <Plus size={18} />
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="checklist-empty">
          <CheckSquare size={48} />
          <p>No tasks yet. Add your first task above!</p>
        </div>
      ) : (
        <div className="checklist-tasks">
          {tasks.map((task) => (
            <div key={task.id} className={`checklist-task-item ${task.completed ? 'completed' : ''}`}>
              <button
                onClick={() => toggleTask(task.id)}
                className="checklist-checkbox"
              >
                {task.completed && '✓'}
              </button>
              <div className="checklist-task-text">{task.text}</div>
              <button
                onClick={() => deleteTask(task.id)}
                className="checklist-task-delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {progress === 100 && tasks.length > 0 && (
        <div className="checklist-celebration">
          <div className="checklist-celebration-emoji">🎉</div>
          <h3>All Done!</h3>
          <p>Great job completing all your tasks!</p>
        </div>
      )}
    </div>
  );
}
