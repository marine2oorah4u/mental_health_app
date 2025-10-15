import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';

export function SimplifiedInstructions() {
  const [instructions, setInstructions] = useState<{title: string; steps: string[]}[]>([]);
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState(['']);

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (i: number, val: string) => {
    const newSteps = [...steps];
    newSteps[i] = val;
    setSteps(newSteps);
  };
  const saveCard = () => {
    if (title && steps.some(s => s.trim())) {
      setInstructions([...instructions, { title, steps: steps.filter(s => s.trim()) }]);
      setTitle('');
      setSteps(['']);
    }
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <FileText size={24} />
        <h2>Visual Instruction Card Builder</h2>
      </div>

      <div style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)'}}>
        <h3>Create New Instruction Card</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity name (e.g., 'Tying Square Knot')"
          style={{width: '100%', padding: 'var(--space-md)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)'}}
        />

        <h4>Steps:</h4>
        {steps.map((step, i) => (
          <div key={i} style={{display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)'}}>
            <span style={{fontWeight: 'bold', minWidth: '30px'}}>{i + 1}.</span>
            <input
              type="text"
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              placeholder="Enter step"
              style={{flex: 1, padding: 'var(--space-sm)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)'}}
            />
          </div>
        ))}

        <div style={{display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)'}}>
          <button onClick={addStep} className="btn btn-secondary">
            <Plus size={16} /> Add Step
          </button>
          <button onClick={saveCard} className="btn btn-primary">
            Save Card
          </button>
        </div>
      </div>

      <div>
        <h3>My Instruction Cards ({instructions.length})</h3>
        {instructions.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>Create instruction cards for activities</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)'}}>
            {instructions.map((card, i) => (
              <div key={i} style={{padding: 'var(--space-lg)', background: 'white', border: '3px solid var(--color-primary)', borderRadius: 'var(--radius-lg)'}}>
                <h4 style={{margin: '0 0 var(--space-md) 0', textAlign: 'center'}}>{card.title}</h4>
                <ol style={{paddingLeft: 'var(--space-lg)', margin: 0}}>
                  {card.steps.map((step, j) => (
                    <li key={j} style={{marginBottom: 'var(--space-sm)', fontSize: '1rem'}}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>Tips for Good Instructions:</h3>
        <ul>
          <li>Use simple, clear language</li>
          <li>One action per step</li>
          <li>Add pictures when possible</li>
          <li>Number each step</li>
        </ul>
      </div>
    </div>
  );
}
