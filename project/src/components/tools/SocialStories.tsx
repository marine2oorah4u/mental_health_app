import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

const storyTemplates = [
  {
    title: 'Going to Camp',
    pages: [
      'I am going to scout camp. Camp is a fun place outdoors.',
      'At camp, there will be other scouts and leaders.',
      'We will do activities like hiking, crafts, and games.',
      'If I feel overwhelmed, I can ask for a break.',
      'Camp is safe and fun. I will try my best!'
    ]
  },
  {
    title: 'Meeting New People',
    pages: [
      'Sometimes I meet new people at scouts.',
      'It\'s okay to feel nervous about meeting someone new.',
      'I can say "Hi, my name is ___" and smile.',
      'Not everyone needs to be best friends right away.',
      'I can take my time getting to know new scouts.'
    ]
  },
  {
    title: 'When Things Change',
    pages: [
      'Sometimes plans change at scouts.',
      'The weather might change our activity.',
      'Leaders will tell us about changes.',
      'Change can be okay. I can be flexible.',
      'I can ask questions if I\'m unsure.'
    ]
  }
];

export function SocialStories() {
  const [currentStory, setCurrentStory] = useState<typeof storyTemplates[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  if (currentStory) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <BookOpen size={24} />
          <h2>{currentStory.title}</h2>
        </div>

        <div style={{padding: 'var(--space-xxl)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
          <p style={{fontSize: '1.5rem', lineHeight: '1.8', margin: 0}}>
            {currentStory.pages[currentPage]}
          </p>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)'}}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
          <span style={{fontWeight: 600}}>
            Page {currentPage + 1} of {currentStory.pages.length}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(currentStory.pages.length - 1, p + 1))}
            disabled={currentPage === currentStory.pages.length - 1}
            className="btn btn-secondary"
          >
            Next →
          </button>
        </div>

        <button
          onClick={() => { setCurrentStory(null); setCurrentPage(0); }}
          className="btn btn-primary"
        >
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <BookOpen size={24} />
        <h2>Social Story Scripts</h2>
      </div>

      <p style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
        Read social stories to prepare for new situations
      </p>

      <div style={{display: 'grid', gap: 'var(--space-md)'}}>
        {storyTemplates.map((story, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(story)}
            style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left'}}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)'}}>
              <span style={{fontSize: '3rem'}}>📖</span>
              <div>
                <h3 style={{margin: 0}}>{story.title}</h3>
                <p style={{margin: '0.5rem 0 0 0', color: 'var(--color-textMuted)'}}>
                  {story.pages.length} pages
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>What are Social Stories?</h3>
        <p>Short, simple stories that explain social situations, helping scouts understand what to expect and how to respond.</p>
      </div>
    </div>
  );
}
