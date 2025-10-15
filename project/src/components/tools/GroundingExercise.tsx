import { useState } from 'react';
import { Anchor, Eye, Ear, Hand, Wind, Coffee, CheckCircle } from 'lucide-react';

type Step = '5-see' | '4-touch' | '3-hear' | '2-smell' | '1-taste' | 'complete';

export function GroundingExercise() {
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const steps = [
    {
      id: '5-see' as Step,
      number: 5,
      sense: 'See',
      icon: Eye,
      color: '#3B82F6',
      prompt: 'Name 5 things you can see around you',
      examples: ['The door', 'A tree', 'Your hand', 'A chair', 'The sky'],
    },
    {
      id: '4-touch' as Step,
      number: 4,
      sense: 'Touch',
      icon: Hand,
      color: '#8B5CF6',
      prompt: 'Name 4 things you can physically feel',
      examples: ['Your feet on the floor', 'The chair beneath you', 'Your clothes', 'The temperature'],
    },
    {
      id: '3-hear' as Step,
      number: 3,
      sense: 'Hear',
      icon: Ear,
      color: '#EC4899',
      prompt: 'Name 3 sounds you can hear right now',
      examples: ['Birds chirping', 'Your breathing', 'People talking', 'Traffic'],
    },
    {
      id: '2-smell' as Step,
      number: 2,
      sense: 'Smell',
      icon: Wind,
      color: '#F59E0B',
      prompt: 'Name 2 things you can smell (or like to smell)',
      examples: ['Fresh air', 'Your soap', 'Food', 'Nature'],
    },
    {
      id: '1-taste' as Step,
      number: 1,
      sense: 'Taste',
      icon: Coffee,
      color: '#10B981',
      prompt: 'Name 1 thing you can taste (or your favorite taste)',
      examples: ['Your last drink', 'Toothpaste', 'Your favorite food'],
    },
  ];

  const currentStepData = steps.find(s => s.id === currentStep);
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const startExercise = () => {
    setIsStarted(true);
    setCurrentStep('5-see');
    setItems([]);
  };

  const addItem = () => {
    if (!currentInput.trim() || !currentStepData) return;

    const newItems = [...items, currentInput.trim()];
    setItems(newItems);
    setCurrentInput('');

    if (newItems.length >= currentStepData.number) {
      if (currentStepIndex < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(steps[currentStepIndex + 1].id);
          setItems([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCurrentStep('complete');
        }, 500);
      }
    }
  };

  const skipStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
      setItems([]);
      setCurrentInput('');
    } else {
      setCurrentStep('complete');
    }
  };

  const restart = () => {
    setIsStarted(false);
    setCurrentStep(null);
    setItems([]);
    setCurrentInput('');
  };

  if (!isStarted) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <Anchor size={24} />
          <h2>5-4-3-2-1 Grounding Exercise</h2>
        </div>

        <div className="grounding-intro">
          <p>
            The 5-4-3-2-1 technique is a mindfulness exercise that helps you ground
            yourself in the present moment using your five senses. It's especially
            helpful during anxiety, panic, or overwhelm.
          </p>
        </div>

        <div className="grounding-how-it-works">
          <h3>How It Works:</h3>
          <div className="grounding-steps-preview">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="grounding-step-preview" style={{ borderColor: step.color }}>
                  <Icon size={32} style={{ color: step.color }} />
                  <h4 style={{ color: step.color }}>{step.number} {step.sense}</h4>
                  <p>{step.prompt}</p>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={startExercise} className="btn btn-primary grounding-start-button">
          <Anchor size={20} />
          Start Grounding Exercise
        </button>

        <div className="tool-info">
          <h3>When to Use:</h3>
          <ul>
            <li><strong>Anxiety or Panic:</strong> Brings you back to present moment</li>
            <li><strong>Feeling Overwhelmed:</strong> Focuses mind on concrete details</li>
            <li><strong>Dissociation:</strong> Reconnects you with your surroundings</li>
            <li><strong>Sensory Overload:</strong> Refocuses on manageable sensory input</li>
            <li><strong>Before Sleep:</strong> Calms racing thoughts</li>
          </ul>
          <h3>Why It Works:</h3>
          <ul>
            <li>Interrupts anxious thought patterns</li>
            <li>Engages logical thinking part of brain</li>
            <li>Focuses attention on present, not worries</li>
            <li>Easy to remember and do anywhere</li>
            <li>Scientifically proven grounding technique</li>
          </ul>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <Anchor size={24} />
          <h2>5-4-3-2-1 Grounding Exercise</h2>
        </div>

        <div className="grounding-complete">
          <CheckCircle size={80} className="grounding-complete-icon" />
          <h2>Exercise Complete!</h2>
          <p>
            Great job! You've completed the grounding exercise. Take a moment to notice
            how you feel now compared to when you started.
          </p>

          <div className="grounding-complete-actions">
            <button onClick={restart} className="btn btn-primary">
              Do It Again
            </button>
            <button onClick={() => setIsStarted(false)} className="btn btn-secondary">
              Back to Info
            </button>
          </div>

          <div className="grounding-check-in">
            <h3>How do you feel now?</h3>
            <p>
              Notice if you feel more grounded, present, or calm. This technique gets
              easier with practice!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStepData) return null;

  const Icon = currentStepData.icon;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const itemsNeeded = currentStepData.number - items.length;

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Anchor size={24} />
        <h2>5-4-3-2-1 Grounding Exercise</h2>
      </div>

      <div className="grounding-progress-bar">
        <div className="grounding-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="grounding-current-step" style={{ borderColor: currentStepData.color }}>
        <div className="grounding-step-icon" style={{ backgroundColor: currentStepData.color }}>
          <Icon size={48} />
        </div>
        <h2 style={{ color: currentStepData.color }}>
          {currentStepData.number} Things You Can {currentStepData.sense}
        </h2>
        <p className="grounding-step-prompt">{currentStepData.prompt}</p>
      </div>

      <div className="grounding-items-list">
        {items.map((item, index) => (
          <div key={index} className="grounding-item-added">
            <CheckCircle size={20} style={{ color: currentStepData.color }} />
            <span>{item}</span>
          </div>
        ))}
        {itemsNeeded > 0 && (
          <div className="grounding-items-remaining">
            {itemsNeeded} more to go...
          </div>
        )}
      </div>

      <div className="grounding-input-section">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="Type what you notice..."
          className="grounding-input"
          autoFocus
        />
        <button
          onClick={addItem}
          disabled={!currentInput.trim()}
          className="btn btn-primary"
        >
          Add
        </button>
      </div>

      <div className="grounding-examples">
        <p><strong>Examples:</strong></p>
        <div className="grounding-example-chips">
          {currentStepData.examples.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentInput(example);
              }}
              className="grounding-example-chip"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="grounding-actions">
        <button onClick={skipStep} className="btn btn-secondary">
          Skip This Step
        </button>
        <button onClick={restart} className="btn btn-secondary">
          Start Over
        </button>
      </div>
    </div>
  );
}
