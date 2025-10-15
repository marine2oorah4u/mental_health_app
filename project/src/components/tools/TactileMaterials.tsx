import { Hand } from 'lucide-react';

const activities = [
  {
    name: 'Textured Maps',
    materials: ['Sandpaper', 'Fabric', 'String', 'Glue'],
    description: 'Create maps with different textures for landmarks',
    icon: '🗺️'
  },
  {
    name: 'Tactile Badges',
    materials: ['Foam sheets', 'Beads', 'Raised paint'],
    description: 'Make badges with raised elements',
    icon: '🏅'
  },
  {
    name: 'Knot Boards',
    materials: ['Wood boards', 'Rope', 'Hooks'],
    description: 'Practice knots with hands-on boards',
    icon: '🪢'
  },
  {
    name: 'Nature Cards',
    materials: ['Leaves', 'Bark', 'Seeds', 'Lamination'],
    description: 'Tactile identification cards',
    icon: '🍃'
  }
];

export function TactileMaterials() {
  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Hand size={24} />
        <h2>Tactile Learning Activities</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Hands-on learning materials for tactile learners and visually impaired scouts
      </p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)'}}>
        {activities.map((activity, i) => (
          <div key={i} style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)'}}>
            <div style={{fontSize: '3rem', textAlign: 'center', marginBottom: 'var(--space-md)'}}>{activity.icon}</div>
            <h3 style={{margin: '0 0 var(--space-md) 0', textAlign: 'center'}}>{activity.name}</h3>
            <p style={{margin: '0 0 var(--space-md) 0', color: 'var(--color-textMuted)'}}>{activity.description}</p>
            <div style={{padding: 'var(--space-md)', background: 'var(--color-backgroundAlt)', borderRadius: 'var(--radius-md)'}}>
              <strong style={{display: 'block', marginBottom: 'var(--space-sm)'}}>Materials:</strong>
              <ul style={{margin: 0, paddingLeft: 'var(--space-lg)'}}>
                {activity.materials.map((m, j) => (
                  <li key={j}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="tool-info">
        <h3>Who Benefits from Tactile Learning:</h3>
        <ul>
          <li>Visual impairments</li>
          <li>Kinesthetic learners</li>
          <li>Sensory seekers</li>
          <li>All scouts learn better with hands-on experiences</li>
        </ul>
      </div>
    </div>
  );
}
