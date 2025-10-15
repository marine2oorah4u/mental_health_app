import { useState } from 'react';
import { MessageSquare, Volume2, Plus, Edit, Trash2 } from 'lucide-react';

interface Card {
  id: string;
  text: string;
  emoji: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

export function QuickCards() {
  const [cards, setCards] = useState<Card[]>([
    { id: '1', text: 'I need a break', emoji: '⏸️', color: '#EF4444', priority: 'high' },
    { id: '2', text: 'Too loud', emoji: '🔊', color: '#F59E0B', priority: 'high' },
    { id: '3', text: 'I need help', emoji: '🆘', color: '#DC2626', priority: 'high' },
    { id: '4', text: 'Bathroom please', emoji: '🚽', color: '#8B5CF6', priority: 'medium' },
    { id: '5', text: 'I\'m hungry', emoji: '🍎', color: '#10B981', priority: 'medium' },
    { id: '6', text: 'I\'m thirsty', emoji: '💧', color: '#06B6D4', priority: 'medium' },
    { id: '7', text: 'I don\'t understand', emoji: '❓', color: '#F59E0B', priority: 'medium' },
    { id: '8', text: 'Can you repeat that?', emoji: '🔄', color: '#6366F1', priority: 'low' },
    { id: '9', text: 'Yes', emoji: '✅', color: '#10B981', priority: 'low' },
    { id: '10', text: 'No', emoji: '❌', color: '#EF4444', priority: 'low' },
    { id: '11', text: 'Maybe later', emoji: '⏰', color: '#6B7280', priority: 'low' },
    { id: '12', text: 'I\'m okay', emoji: '👍', color: '#10B981', priority: 'low' },
  ]);

  const [showingCard, setShowingCard] = useState<Card | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCardText, setNewCardText] = useState('');
  const [newCardEmoji, setNewCardEmoji] = useState('💬');

  const showCard = (card: Card) => {
    setShowingCard(card);

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setShowingCard(null);
    }, 3000);
  };

  const addCard = () => {
    if (!newCardText.trim()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      text: newCardText,
      emoji: newCardEmoji,
      color: '#6366F1',
      priority: 'medium',
    };

    setCards([...cards, newCard]);
    setNewCardText('');
    setNewCardEmoji('💬');
    setIsEditing(false);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const highPriorityCards = cards.filter(c => c.priority === 'high');
  const mediumPriorityCards = cards.filter(c => c.priority === 'medium');
  const lowPriorityCards = cards.filter(c => c.priority === 'low');

  if (showingCard) {
    return (
      <div className="tool-interactive">
        <div className="quick-card-fullscreen" style={{ backgroundColor: showingCard.color }}>
          <div className="quick-card-content">
            <div className="quick-card-emoji-large">{showingCard.emoji}</div>
            <h1 className="quick-card-text-large">{showingCard.text}</h1>
          </div>
          <button
            onClick={() => setShowingCard(null)}
            className="quick-card-close"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <MessageSquare size={24} />
        <h2>Quick Communication Cards</h2>
      </div>

      <div className="quick-cards-intro">
        <p>
          One-tap communication cards for when speaking is difficult or impossible.
          Tap a card to show it full-screen with text-to-speech. Perfect for non-verbal
          communication, anxiety, or sensory overload.
        </p>
      </div>

      <div className="quick-cards-controls">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary"
        >
          {isEditing ? 'Done Editing' : <><Edit size={18} /> Edit Cards</>}
        </button>
      </div>

      {isEditing && (
        <div className="quick-cards-add">
          <h3>Add New Card:</h3>
          <div className="quick-cards-add-form">
            <input
              type="text"
              value={newCardEmoji}
              onChange={(e) => setNewCardEmoji(e.target.value)}
              placeholder="Emoji"
              className="quick-card-emoji-input"
              maxLength={2}
            />
            <input
              type="text"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCard()}
              placeholder="Card message..."
              className="quick-card-text-input"
            />
            <button onClick={addCard} className="btn btn-primary">
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>
      )}

      <div className="quick-cards-section">
        <h3 className="quick-cards-section-title priority-high">
          🚨 Urgent Needs
        </h3>
        <div className="quick-cards-grid">
          {highPriorityCards.map((card) => (
            <button
              key={card.id}
              onClick={() => showCard(card)}
              className="quick-card"
              style={{ backgroundColor: card.color }}
            >
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(card.id);
                  }}
                  className="quick-card-delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="quick-card-emoji">{card.emoji}</div>
              <div className="quick-card-text">{card.text}</div>
              <Volume2 size={16} className="quick-card-speaker" />
            </button>
          ))}
        </div>
      </div>

      <div className="quick-cards-section">
        <h3 className="quick-cards-section-title priority-medium">
          📢 Important Needs
        </h3>
        <div className="quick-cards-grid">
          {mediumPriorityCards.map((card) => (
            <button
              key={card.id}
              onClick={() => showCard(card)}
              className="quick-card"
              style={{ backgroundColor: card.color }}
            >
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(card.id);
                  }}
                  className="quick-card-delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="quick-card-emoji">{card.emoji}</div>
              <div className="quick-card-text">{card.text}</div>
              <Volume2 size={16} className="quick-card-speaker" />
            </button>
          ))}
        </div>
      </div>

      <div className="quick-cards-section">
        <h3 className="quick-cards-section-title priority-low">
          💬 Common Responses
        </h3>
        <div className="quick-cards-grid">
          {lowPriorityCards.map((card) => (
            <button
              key={card.id}
              onClick={() => showCard(card)}
              className="quick-card"
              style={{ backgroundColor: card.color }}
            >
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(card.id);
                  }}
                  className="quick-card-delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="quick-card-emoji">{card.emoji}</div>
              <div className="quick-card-text">{card.text}</div>
              <Volume2 size={16} className="quick-card-speaker" />
            </button>
          ))}
        </div>
      </div>

      <div className="tool-info">
        <h3>How to Use:</h3>
        <ul>
          <li>Tap any card to show it full-screen</li>
          <li>Card will be read aloud automatically</li>
          <li>Perfect for when speaking is hard</li>
          <li>Add custom cards for your specific needs</li>
          <li>Show to leaders, parents, or friends</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Non-verbal:</strong> Alternative to spoken communication</li>
          <li><strong>Autism:</strong> When words won't come</li>
          <li><strong>Anxiety:</strong> Communicate during panic or overwhelm</li>
          <li><strong>Selective Mutism:</strong> Express needs without speaking</li>
          <li><strong>Anyone:</strong> Quick way to communicate urgent needs</li>
        </ul>
      </div>
    </div>
  );
}
