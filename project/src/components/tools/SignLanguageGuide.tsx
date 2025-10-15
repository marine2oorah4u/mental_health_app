import { useState } from 'react';
import { Hand, Search, BookOpen } from 'lucide-react';

interface Sign {
  id: string;
  word: string;
  category: string;
  description: string;
  imageUrl: string;
  videoTip?: string;
}

export function SignLanguageGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const signs: Sign[] = [
    {
      id: '1',
      word: 'Hello',
      category: 'greetings',
      description: 'Wave hand side to side near face',
      imageUrl: 'https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Keep hand relaxed and friendly',
    },
    {
      id: '2',
      word: 'Thank You',
      category: 'greetings',
      description: 'Touch fingers to chin, move hand forward',
      imageUrl: 'https://images.pexels.com/photos/7551742/pexels-photo-7551742.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Like blowing a kiss from chin',
    },
    {
      id: '3',
      word: 'Help',
      category: 'emergency',
      description: 'Flat hand on top of fist, lift both up',
      imageUrl: 'https://images.pexels.com/photos/7551622/pexels-photo-7551622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'One hand helps the other up',
    },
    {
      id: '4',
      word: 'Stop',
      category: 'emergency',
      description: 'Flat hand, palm out, push forward',
      imageUrl: 'https://images.pexels.com/photos/8088501/pexels-photo-8088501.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Universal stop gesture',
    },
    {
      id: '5',
      word: 'Yes',
      category: 'responses',
      description: 'Make fist, nod it forward like head nodding',
      imageUrl: 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Fist nods like your head says yes',
    },
    {
      id: '6',
      word: 'No',
      category: 'responses',
      description: 'Index and middle finger tap thumb together',
      imageUrl: 'https://images.pexels.com/photos/8088490/pexels-photo-8088490.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Like a mouth closing',
    },
    {
      id: '7',
      word: 'Please',
      category: 'greetings',
      description: 'Flat hand on chest, move in circle',
      imageUrl: 'https://images.pexels.com/photos/7551729/pexels-photo-7551729.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Circular motion on chest',
    },
    {
      id: '8',
      word: 'Sorry',
      category: 'greetings',
      description: 'Fist on chest, move in circle',
      imageUrl: 'https://images.pexels.com/photos/8088488/pexels-photo-8088488.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Shows regret from heart',
    },
    {
      id: '9',
      word: 'Friend',
      category: 'scout-terms',
      description: 'Hook index fingers together, then reverse',
      imageUrl: 'https://images.pexels.com/photos/7551669/pexels-photo-7551669.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Two friends linked together',
    },
    {
      id: '10',
      word: 'Scout',
      category: 'scout-terms',
      description: 'Three finger salute at forehead',
      imageUrl: 'https://images.pexels.com/photos/7551735/pexels-photo-7551735.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Scout sign at forehead',
    },
    {
      id: '11',
      word: 'Camping',
      category: 'scout-terms',
      description: 'Hands form tent shape, move apart',
      imageUrl: 'https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Shows tent opening',
    },
    {
      id: '12',
      word: 'Fire',
      category: 'scout-terms',
      description: 'Wiggle fingers upward like flames',
      imageUrl: 'https://images.pexels.com/photos/1749900/pexels-photo-1749900.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Fingers dance like fire',
    },
    {
      id: '13',
      word: 'Water',
      category: 'needs',
      description: 'Tap chin with three fingers (W shape)',
      imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'W for water at mouth',
    },
    {
      id: '14',
      word: 'Food/Eat',
      category: 'needs',
      description: 'Touch fingers to mouth repeatedly',
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Like eating with fingers',
    },
    {
      id: '15',
      word: 'Bathroom',
      category: 'needs',
      description: 'Shake fist with thumb between fingers',
      imageUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Letter T shakes side to side',
    },
    {
      id: '16',
      word: 'Tired',
      category: 'feelings',
      description: 'Drop both hands down chest',
      imageUrl: 'https://images.pexels.com/photos/3771790/pexels-photo-3771790.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      videoTip: 'Energy draining down',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Signs', icon: '📚' },
    { id: 'greetings', name: 'Greetings', icon: '👋' },
    { id: 'emergency', name: 'Emergency', icon: '🚨' },
    { id: 'responses', name: 'Yes/No', icon: '✅' },
    { id: 'scout-terms', name: 'Scout Terms', icon: '⚜️' },
    { id: 'needs', name: 'Basic Needs', icon: '🍽️' },
    { id: 'feelings', name: 'Feelings', icon: '😊' },
  ];

  const filteredSigns = signs.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Hand size={24} />
        <h2>Sign Language Quick Reference</h2>
      </div>

      <div className="sign-language-intro">
        <BookOpen size={32} />
        <p>
          Basic American Sign Language (ASL) signs for common scouting situations.
          Perfect for communicating with Deaf/Hard of Hearing scouts or during quiet activities.
        </p>
      </div>

      <div className="sign-language-search">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search signs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sign-search-input"
        />
      </div>

      <div className="sign-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`sign-category-button ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            <span className="sign-category-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="sign-count">
        Showing {filteredSigns.length} signs
      </div>

      <div className="sign-language-grid">
        {filteredSigns.map((sign) => (
          <div key={sign.id} className="sign-card">
            <div className="sign-image-container">
              <img src={sign.imageUrl} alt={sign.word} className="sign-image" />
            </div>
            <div className="sign-content">
              <h3 className="sign-word">{sign.word}</h3>
              <p className="sign-description">{sign.description}</p>
              {sign.videoTip && (
                <div className="sign-tip">
                  <strong>Tip:</strong> {sign.videoTip}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSigns.length === 0 && (
        <div className="sign-no-results">
          <Hand size={48} />
          <p>No signs found. Try a different search term.</p>
        </div>
      )}

      <div className="tool-info">
        <h3>Important Notes:</h3>
        <ul>
          <li><strong>ASL is a Full Language:</strong> These are basic signs. Full ASL has grammar and structure.</li>
          <li><strong>Facial Expressions Matter:</strong> ASL uses facial expressions as grammar.</li>
          <li><strong>Practice:</strong> Watch videos and practice with Deaf community members.</li>
          <li><strong>Respect:</strong> Always ask before trying to sign with Deaf individuals.</li>
          <li><strong>Learn More:</strong> Consider ASL classes or online resources like ASL University.</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Deaf Scouts:</strong> Primary language</li>
          <li><strong>Hard of Hearing:</strong> Backup communication</li>
          <li><strong>Non-verbal Scouts:</strong> Alternative communication</li>
          <li><strong>All Scouts:</strong> Learn inclusive communication</li>
          <li><strong>Quiet Activities:</strong> Silent communication needed</li>
        </ul>
      </div>
    </div>
  );
}
