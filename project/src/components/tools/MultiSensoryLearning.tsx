import { useState } from 'react';
import { Brain, Lightbulb } from 'lucide-react';

interface Activity {
  id: string;
  skill: string;
  visual: string;
  auditory: string;
  tactile: string;
  kinesthetic: string;
}

const skillTemplates = [
  { skill: 'Knot Tying', visual: 'Diagram posters', auditory: 'Step-by-step narration', tactile: 'Practice ropes', kinesthetic: 'Body movements' },
  { skill: 'Fire Safety', visual: 'Safety videos', auditory: 'Songs/chants', tactile: 'Safe fire materials', kinesthetic: 'Role-play scenarios' },
  { skill: 'First Aid', visual: 'Photo guides', auditory: 'Emergency sounds', tactile: 'Bandage practice', kinesthetic: 'Full demonstrations' },
  { skill: 'Map Reading', visual: 'Color-coded maps', auditory: 'Compass songs', tactile: 'Textured maps', kinesthetic: 'Scavenger hunt' },
];

export function MultiSensoryLearning() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const addFromTemplate = (template: typeof skillTemplates[0]) => {
    const activity: Activity = {
      id: Date.now().toString(),
      ...template,
    };
    setActivities(prev => [...prev, activity]);
    setShowTemplates(false);
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Brain size={24} />
        <h2>Multi-Sensory Learning Planner</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Plan activities that engage visual, auditory, tactile, and kinesthetic learning
      </p>

      <button onClick={() => setShowTemplates(!showTemplates)} className="btn btn-primary" style={{marginBottom: 'var(--space-lg)'}}>
        <Lightbulb size={20} />
        {showTemplates ? 'Hide Templates' : 'View Skill Templates'}
      </button>

      {showTemplates && (
        <div style={{marginBottom: 'var(--space-xl)'}}>
          <h3>Skill Templates:</h3>
          <div style={{display: 'grid', gap: 'var(--space-md)'}}>
            {skillTemplates.map((template, i) => (
              <button
                key={i}
                onClick={() => addFromTemplate(template)}
                style={{padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left'}}
              >
                <h4 style={{margin: '0 0 var(--space-sm) 0'}}>{template.skill}</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-sm)', fontSize: '0.875rem'}}>
                  <div>👁️ {template.visual}</div>
                  <div>👂 {template.auditory}</div>
                  <div>✋ {template.tactile}</div>
                  <div>🏃 {template.kinesthetic}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3>My Learning Plans ({activities.length})</h3>
        {activities.length === 0 ? (
          <div className="empty-state">
            <Brain size={48} />
            <p>Add skill templates to create multi-sensory learning plans</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'}}>
            {activities.map(activity => (
              <div key={activity.id} style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-lg)'}}>
                <h4 style={{margin: '0 0 var(--space-lg) 0', fontSize: '1.5rem'}}>{activity.skill}</h4>
                <div style={{display: 'grid', gap: 'var(--space-md)'}}>
                  <div style={{padding: 'var(--space-md)', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-md)'}}>
                    <strong>👁️ Visual:</strong> {activity.visual}
                  </div>
                  <div style={{padding: 'var(--space-md)', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-md)'}}>
                    <strong>👂 Auditory:</strong> {activity.auditory}
                  </div>
                  <div style={{padding: 'var(--space-md)', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-md)'}}>
                    <strong>✋ Tactile:</strong> {activity.tactile}
                  </div>
                  <div style={{padding: 'var(--space-md)', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-md)'}}>
                    <strong>🏃 Kinesthetic:</strong> {activity.kinesthetic}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>Why Multi-Sensory Learning?</h3>
        <ul>
          <li><strong>Universal Design:</strong> Reaches all learning styles</li>
          <li><strong>Memory:</strong> Multiple pathways strengthen retention</li>
          <li><strong>Engagement:</strong> Keeps all scouts involved</li>
          <li><strong>Accessibility:</strong> No one is left out</li>
        </ul>
      </div>
    </div>
  );
}
