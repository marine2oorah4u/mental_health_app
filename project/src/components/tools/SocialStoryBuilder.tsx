import { useState } from 'react';
import { BookOpen, Plus, Trash2, Save, Download, ArrowLeft, ArrowRight } from 'lucide-react';

interface StoryPage {
  id: string;
  text: string;
  emoji: string;
}

const situations = [
  { id: 'new-place', name: 'Going to a New Place', emoji: '🏢' },
  { id: 'meeting-people', name: 'Meeting New People', emoji: '👋' },
  { id: 'loud-noises', name: 'Dealing with Loud Noises', emoji: '🔊' },
  { id: 'waiting', name: 'Waiting My Turn', emoji: '⏰' },
  { id: 'changes', name: 'When Plans Change', emoji: '🔄' },
  { id: 'feeling-upset', name: 'When I Feel Upset', emoji: '😟' },
  { id: 'camping', name: 'Going Camping', emoji: '⛺' },
  { id: 'asking-help', name: 'Asking for Help', emoji: '🆘' },
  { id: 'custom', name: 'Custom Story', emoji: '✏️' },
];

const storyTemplates: Record<string, StoryPage[]> = {
  'new-place': [
    { id: '1', text: 'Sometimes I go to new places.', emoji: '🏢' },
    { id: '2', text: 'New places might look different than I expected.', emoji: '👀' },
    { id: '3', text: 'It\'s okay to feel nervous or excited.', emoji: '💭' },
    { id: '4', text: 'I can ask questions if I need to.', emoji: '❓' },
    { id: '5', text: 'My leader will help me feel safe.', emoji: '👨‍🏫' },
  ],
  'meeting-people': [
    { id: '1', text: 'Sometimes I meet new people.', emoji: '👋' },
    { id: '2', text: 'New people might want to say hello.', emoji: '😊' },
    { id: '3', text: 'I can wave, smile, or say hi.', emoji: '🙋' },
    { id: '4', text: 'It\'s okay if I need time to warm up.', emoji: '⏰' },
    { id: '5', text: 'I can meet new friends at my own pace.', emoji: '🤝' },
  ],
  'loud-noises': [
    { id: '1', text: 'Sometimes there are loud noises.', emoji: '🔊' },
    { id: '2', text: 'Loud noises might surprise me.', emoji: '😲' },
    { id: '3', text: 'I can cover my ears if I need to.', emoji: '🙉' },
    { id: '4', text: 'I can take a break in a quiet space.', emoji: '🤫' },
    { id: '5', text: 'The loud noise will end soon.', emoji: '✅' },
  ],
  'waiting': [
    { id: '1', text: 'Sometimes I have to wait my turn.', emoji: '⏰' },
    { id: '2', text: 'Waiting can feel hard.', emoji: '😣' },
    { id: '3', text: 'I can count or take deep breaths while waiting.', emoji: '🫁' },
    { id: '4', text: 'Everyone has to wait sometimes.', emoji: '👥' },
    { id: '5', text: 'My turn will come!', emoji: '🎉' },
  ],
  'changes': [
    { id: '1', text: 'Sometimes plans change.', emoji: '🔄' },
    { id: '2', text: 'Changes can feel uncomfortable.', emoji: '😕' },
    { id: '3', text: 'It\'s okay to feel upset about changes.', emoji: '💭' },
    { id: '4', text: 'I can ask questions about the new plan.', emoji: '❓' },
    { id: '5', text: 'I can handle changes with help from my leader.', emoji: '💪' },
  ],
};

export function SocialStoryBuilder() {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const startStory = (situationId: string) => {
    const situation = situations.find((s) => s.id === situationId);
    if (!situation) return;

    setSelectedSituation(situationId);
    setStoryTitle(situation.name);

    if (situationId === 'custom') {
      setPages([{ id: '1', text: '', emoji: '📖' }]);
    } else {
      setPages(storyTemplates[situationId] || []);
    }
    setCurrentPage(0);
  };

  const addPage = () => {
    const newPage: StoryPage = {
      id: Date.now().toString(),
      text: '',
      emoji: '📖',
    };
    setPages([...pages, newPage]);
  };

  const updatePage = (id: string, updates: Partial<StoryPage>) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePage = (id: string) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((p) => p.id !== id);
    setPages(newPages);
    if (currentPage >= newPages.length) {
      setCurrentPage(newPages.length - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetStory = () => {
    setSelectedSituation(null);
    setStoryTitle('');
    setPages([]);
    setCurrentPage(0);
  };

  const emojiOptions = ['📖', '😊', '😟', '🤔', '💭', '✅', '❌', '👍', '👋', '💪', '🎉', '⏰', '❓', '💡'];

  if (!selectedSituation) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <BookOpen size={24} />
          <h2>Social Story Builder</h2>
        </div>

        <div className="story-intro">
          <p>
            Social stories help prepare for new situations or understand social expectations.
            Choose a situation or create your own custom story.
          </p>
        </div>

        <div className="story-situations-grid">
          {situations.map((situation) => (
            <button
              key={situation.id}
              onClick={() => startStory(situation.id)}
              className="story-situation-button"
            >
              <div className="story-situation-emoji">{situation.emoji}</div>
              <div className="story-situation-name">{situation.name}</div>
            </button>
          ))}
        </div>

        <div className="tool-info">
          <h3>What are Social Stories?</h3>
          <ul>
            <li>Short stories that explain social situations</li>
            <li>Help prepare for new or challenging experiences</li>
            <li>Reduce anxiety by providing clear expectations</li>
            <li>Developed by Carol Gray for individuals with autism</li>
            <li>Can be customized for any situation</li>
          </ul>
        </div>
      </div>
    );
  }

  const currentPageData = pages[currentPage];

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <BookOpen size={24} />
        <h2>Social Story Builder</h2>
      </div>

      <div className="story-header">
        <input
          type="text"
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
          className="story-title-input"
          placeholder="Story Title"
        />
        <div className="story-controls-top">
          <button onClick={resetStory} className="btn btn-secondary">
            ← Choose Different Story
          </button>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Download size={18} />
            Print
          </button>
          <button className="btn btn-secondary">
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <div className="story-page-view">
        <div className="story-page-number">Page {currentPage + 1} of {pages.length}</div>

        <div className="story-page-content">
          <div className="story-emoji-selector">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => updatePage(currentPageData.id, { emoji })}
                className={`story-emoji-option ${currentPageData.emoji === emoji ? 'active' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="story-page-emoji-display">{currentPageData.emoji}</div>

          <textarea
            value={currentPageData.text}
            onChange={(e) => updatePage(currentPageData.id, { text: e.target.value })}
            placeholder="Write what happens on this page..."
            className="story-page-text"
            rows={4}
          />
        </div>

        <div className="story-page-navigation">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="btn btn-secondary"
          >
            <ArrowLeft size={18} />
            Previous
          </button>

          <div className="story-page-dots">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`story-page-dot ${idx === currentPage ? 'active' : ''}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pages.length - 1}
            className="btn btn-secondary"
          >
            Next
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="story-page-actions">
          <button onClick={addPage} className="btn btn-primary">
            <Plus size={18} />
            Add Page
          </button>
          {pages.length > 1 && (
            <button
              onClick={() => deletePage(currentPageData.id)}
              className="btn btn-danger"
            >
              <Trash2 size={18} />
              Delete This Page
            </button>
          )}
        </div>
      </div>

      <div className="story-all-pages">
        <h3>All Pages:</h3>
        <div className="story-pages-grid">
          {pages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(idx)}
              className={`story-page-thumbnail ${idx === currentPage ? 'active' : ''}`}
            >
              <div className="story-thumbnail-number">{idx + 1}</div>
              <div className="story-thumbnail-emoji">{page.emoji}</div>
              <div className="story-thumbnail-text">
                {page.text.substring(0, 50) || 'Empty page'}...
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media print {
          .tool-header, .story-controls-top, .story-emoji-selector,
          .story-page-navigation, .story-page-actions, .story-all-pages,
          nav, footer {
            display: none !important;
          }
          .story-page-view {
            page-break-after: always;
          }
          .story-page-emoji-display {
            font-size: 6rem;
          }
          .story-page-text {
            border: none;
            font-size: 1.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
