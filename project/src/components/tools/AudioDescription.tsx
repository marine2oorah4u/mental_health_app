import { Volume2 } from 'lucide-react';

const scenarios = [
  {
    activity: 'Nature Hike',
    cues: [
      'We are starting the trail',
      'Watch for roots on the ground',
      'Stream coming up on the left',
      'Stop - we are taking a group photo',
      'Time to head back to camp'
    ]
  },
  {
    activity: 'Campfire',
    cues: [
      'Finding seats around the fire',
      'Fire is being lit - stay back',
      'Time for songs',
      'Someone is starting a skit',
      'Marshmallows are being passed out'
    ]
  },
  {
    activity: 'Craft Time',
    cues: [
      'Materials are on the table',
      'Pick your colors',
      'Start with step one',
      'Time to let it dry',
      'Clean up your space'
    ]
  }
];

export function AudioDescription() {
  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Volume2 size={24} />
        <h2>Audio Cue Scripts</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Verbal descriptions to help visually impaired scouts follow activities
      </p>

      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'}}>
        {scenarios.map((scenario, i) => (
          <div key={i} style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)'}}>
            <h3 style={{margin: '0 0 var(--space-lg) 0', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'}}>
              <span>🎙️</span> {scenario.activity}
            </h3>
            <ol style={{paddingLeft: 'var(--space-xl)', margin: 0}}>
              {scenario.cues.map((cue, j) => (
                <li key={j} style={{marginBottom: 'var(--space-md)', fontSize: '1.125rem', lineHeight: '1.6'}}>
                  {cue}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="tool-info">
        <h3>Audio Description Guidelines:</h3>
        <ul>
          <li>Describe what is happening</li>
          <li>Announce transitions</li>
          <li>Identify speakers</li>
          <li>Explain visual elements</li>
          <li>Give advance warning of changes</li>
        </ul>
      </div>
    </div>
  );
}
