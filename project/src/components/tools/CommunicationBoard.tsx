import { useState } from 'react';
import { MessageSquare, Volume2, RotateCcw } from 'lucide-react';

interface Word {
  id: string;
  text: string;
  emoji: string;
  category: 'needs' | 'feelings' | 'actions' | 'people' | 'places';
  color: string;
}

const words: Word[] = [
  // Needs
  { id: 'help', text: 'Help', emoji: '🆘', category: 'needs', color: '#EF4444' },
  { id: 'bathroom', text: 'Bathroom', emoji: '🚽', category: 'needs', color: '#3B82F6' },
  { id: 'water', text: 'Water', emoji: '💧', category: 'needs', color: '#06B6D4' },
  { id: 'food', text: 'Food', emoji: '🍎', category: 'needs', color: '#F59E0B' },
  { id: 'break', text: 'Break', emoji: '⏸️', category: 'needs', color: '#8B5CF6' },

  // Feelings
  { id: 'happy', text: 'Happy', emoji: '😊', category: 'feelings', color: '#FCD34D' },
  { id: 'sad', text: 'Sad', emoji: '😢', category: 'feelings', color: '#93C5FD' },
  { id: 'tired', text: 'Tired', emoji: '😴', category: 'feelings', color: '#C4B5FD' },
  { id: 'angry', text: 'Angry', emoji: '😠', category: 'feelings', color: '#F87171' },
  { id: 'scared', text: 'Scared', emoji: '😨', category: 'feelings', color: '#FCA5A5' },

  // Actions
  { id: 'yes', text: 'Yes', emoji: '✓', category: 'actions', color: '#10B981' },
  { id: 'no', text: 'No', emoji: '✗', category: 'actions', color: '#EF4444' },
  { id: 'more', text: 'More', emoji: '➕', category: 'actions', color: '#3B82F6' },
  { id: 'done', text: 'Done', emoji: '✅', category: 'actions', color: '#22C55E' },
  { id: 'wait', text: 'Wait', emoji: '⏱️', category: 'actions', color: '#F59E0B' },

  // People
  { id: 'friend', text: 'Friend', emoji: '👥', category: 'people', color: '#A78BFA' },
  { id: 'leader', text: 'Leader', emoji: '🧑‍🏫', category: 'people', color: '#60A5FA' },
  { id: 'family', text: 'Family', emoji: '👨‍👩‍👧', category: 'people', color: '#FB923C' },

  // Places
  { id: 'outside', text: 'Outside', emoji: '🌳', category: 'places', color: '#84CC16' },
  { id: 'quiet', text: 'Quiet Space', emoji: '🤫', category: 'places', color: '#8B5CF6' },
  { id: 'home', text: 'Home', emoji: '🏠', category: 'places', color: '#F59E0B' },
];

export function CommunicationBoard() {
  const [sentence, setSentence] = useState<Word[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'needs', label: 'Needs' },
    { id: 'feelings', label: 'Feelings' },
    { id: 'actions', label: 'Actions' },
    { id: 'people', label: 'People' },
    { id: 'places', label: 'Places' },
  ];

  const filteredWords = selectedCategory === 'all'
    ? words
    : words.filter(w => w.category === selectedCategory);

  const handleWordClick = (word: Word) => {
    setSentence([...sentence, word]);
  };

  const handleClear = () => {
    setSentence([]);
  };

  const handleSpeak = () => {
    if (sentence.length === 0) return;

    const text = sentence.map(w => w.text).join(' ');
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleRemoveLast = () => {
    setSentence(sentence.slice(0, -1));
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <MessageSquare size={24} />
        <h2>Communication Board</h2>
      </div>

      <div className="comm-sentence-bar">
        <div className="comm-sentence">
          {sentence.length === 0 ? (
            <span className="comm-sentence-placeholder">
              Tap words to build your message
            </span>
          ) : (
            sentence.map((word, idx) => (
              <div
                key={idx}
                className="comm-sentence-word"
                style={{ backgroundColor: word.color }}
              >
                <span className="comm-sentence-emoji">{word.emoji}</span>
                <span className="comm-sentence-text">{word.text}</span>
              </div>
            ))
          )}
        </div>
        <div className="comm-sentence-controls">
          {sentence.length > 0 && (
            <>
              <button
                onClick={handleSpeak}
                className="btn btn-primary"
                title="Speak"
              >
                <Volume2 size={20} />
              </button>
              <button
                onClick={handleRemoveLast}
                className="btn btn-secondary"
                title="Remove last word"
              >
                ←
              </button>
              <button
                onClick={handleClear}
                className="btn btn-secondary"
                title="Clear all"
              >
                <RotateCcw size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="comm-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`comm-category ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="comm-words-grid">
        {filteredWords.map(word => (
          <button
            key={word.id}
            onClick={() => handleWordClick(word)}
            className="comm-word-button"
            style={{
              backgroundColor: word.color,
            }}
          >
            <div className="comm-word-emoji">{word.emoji}</div>
            <div className="comm-word-text">{word.text}</div>
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>How to Use:</h3>
        <ul>
          <li>Tap words to add them to your message</li>
          <li>Build sentences by tapping multiple words</li>
          <li>Press the speaker button to hear your message</li>
          <li>Use categories to find words faster</li>
          <li>Great for Scouts who are nonverbal or prefer visual communication</li>
        </ul>
      </div>
    </div>
  );
}
