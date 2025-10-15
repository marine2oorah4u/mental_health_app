import { useState } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Save } from 'lucide-react';

interface SensoryCategory {
  id: string;
  name: string;
  emoji: string;
  items: SensoryItem[];
}

interface SensoryItem {
  id: string;
  name: string;
  preference: 'love' | 'okay' | 'avoid' | 'unknown';
}

const initialCategories: SensoryCategory[] = [
  {
    id: 'sounds',
    name: 'Sounds',
    emoji: '🔊',
    items: [
      { id: 'loud-music', name: 'Loud music', preference: 'unknown' },
      { id: 'whispers', name: 'Whispers', preference: 'unknown' },
      { id: 'crowds', name: 'Crowd noise', preference: 'unknown' },
      { id: 'nature', name: 'Nature sounds', preference: 'unknown' },
      { id: 'alarms', name: 'Alarms/bells', preference: 'unknown' },
    ],
  },
  {
    id: 'touch',
    name: 'Touch',
    emoji: '✋',
    items: [
      { id: 'hugs', name: 'Hugs', preference: 'unknown' },
      { id: 'high-five', name: 'High-fives', preference: 'unknown' },
      { id: 'tags', name: 'Clothing tags', preference: 'unknown' },
      { id: 'textures', name: 'Different textures', preference: 'unknown' },
      { id: 'messy', name: 'Messy activities', preference: 'unknown' },
    ],
  },
  {
    id: 'visual',
    name: 'Visual',
    emoji: '👁️',
    items: [
      { id: 'bright-lights', name: 'Bright lights', preference: 'unknown' },
      { id: 'flashing', name: 'Flashing lights', preference: 'unknown' },
      { id: 'busy-patterns', name: 'Busy patterns', preference: 'unknown' },
      { id: 'dark-spaces', name: 'Dark spaces', preference: 'unknown' },
      { id: 'sunlight', name: 'Bright sunlight', preference: 'unknown' },
    ],
  },
  {
    id: 'movement',
    name: 'Movement',
    emoji: '🏃',
    items: [
      { id: 'spinning', name: 'Spinning', preference: 'unknown' },
      { id: 'swinging', name: 'Swinging', preference: 'unknown' },
      { id: 'jumping', name: 'Jumping', preference: 'unknown' },
      { id: 'rocking', name: 'Rocking', preference: 'unknown' },
      { id: 'still', name: 'Sitting still', preference: 'unknown' },
    ],
  },
  {
    id: 'smell',
    name: 'Smell',
    emoji: '👃',
    items: [
      { id: 'strong-smells', name: 'Strong smells', preference: 'unknown' },
      { id: 'food-smells', name: 'Food cooking', preference: 'unknown' },
      { id: 'perfume', name: 'Perfume/cologne', preference: 'unknown' },
      { id: 'outdoors', name: 'Outdoor smells', preference: 'unknown' },
      { id: 'cleaning', name: 'Cleaning products', preference: 'unknown' },
    ],
  },
];

export function SensoryTracker() {
  const [categories, setCategories] = useState<SensoryCategory[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handlePreferenceChange = (itemId: string, preference: SensoryItem['preference']) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, preference } : item
            ),
          };
        }
        return cat;
      })
    );

    // Update selected category
    const updated = categories.find((c) => c.id === selectedCategory.id);
    if (updated) {
      setSelectedCategory({
        ...updated,
        items: updated.items.map((item) =>
          item.id === itemId ? { ...item, preference } : item
        ),
      });
    }
  };

  const getPreferenceColor = (pref: SensoryItem['preference']) => {
    switch (pref) {
      case 'love':
        return '#10B981';
      case 'okay':
        return '#F59E0B';
      case 'avoid':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  const getCategoryProgress = (cat: SensoryCategory) => {
    const completed = cat.items.filter((i) => i.preference !== 'unknown').length;
    return `${completed}/${cat.items.length}`;
  };

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Heart size={24} />
        <h2>Sensory Preferences</h2>
      </div>

      <div className="sensory-intro">
        <p>
          Everyone has different sensory preferences! Track what you love, what's okay,
          and what you'd rather avoid. This helps leaders support you better.
        </p>
      </div>

      <div className="sensory-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className={`sensory-category-tab ${selectedCategory.id === cat.id ? 'active' : ''}`}
          >
            <span className="sensory-category-emoji">{cat.emoji}</span>
            <span className="sensory-category-name">{cat.name}</span>
            <span className="sensory-category-progress">{getCategoryProgress(cat)}</span>
          </button>
        ))}
      </div>

      <div className="sensory-items-list">
        {selectedCategory.items.map((item) => (
          <div key={item.id} className="sensory-item">
            <div className="sensory-item-name">{item.name}</div>
            <div className="sensory-item-buttons">
              <button
                onClick={() => handlePreferenceChange(item.id, 'love')}
                className={`sensory-preference-btn ${item.preference === 'love' ? 'active' : ''}`}
                style={{
                  '--pref-color': getPreferenceColor('love'),
                } as any}
                title="I love this!"
              >
                <Heart size={20} fill={item.preference === 'love' ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => handlePreferenceChange(item.id, 'okay')}
                className={`sensory-preference-btn ${item.preference === 'okay' ? 'active' : ''}`}
                style={{
                  '--pref-color': getPreferenceColor('okay'),
                } as any}
                title="It's okay"
              >
                <ThumbsUp size={20} fill={item.preference === 'okay' ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => handlePreferenceChange(item.id, 'avoid')}
                className={`sensory-preference-btn ${item.preference === 'avoid' ? 'active' : ''}`}
                style={{
                  '--pref-color': getPreferenceColor('avoid'),
                } as any}
                title="I want to avoid this"
              >
                <ThumbsDown size={20} fill={item.preference === 'avoid' ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sensory-summary">
        <h3>My Preferences Summary</h3>
        <div className="sensory-summary-grid">
          <div className="sensory-summary-item" style={{ borderColor: getPreferenceColor('love') }}>
            <Heart size={20} />
            <div className="sensory-summary-label">I Love</div>
            <div className="sensory-summary-list">
              {categories
                .flatMap((c) => c.items)
                .filter((i) => i.preference === 'love')
                .map((i) => i.name)
                .join(', ') || 'None yet'}
            </div>
          </div>

          <div className="sensory-summary-item" style={{ borderColor: getPreferenceColor('avoid') }}>
            <ThumbsDown size={20} />
            <div className="sensory-summary-label">I Avoid</div>
            <div className="sensory-summary-list">
              {categories
                .flatMap((c) => c.items)
                .filter((i) => i.preference === 'avoid')
                .map((i) => i.name)
                .join(', ') || 'None yet'}
            </div>
          </div>
        </div>
      </div>

      <div className="tool-info">
        <h3>Why Track Sensory Preferences?</h3>
        <ul>
          <li>Helps leaders understand your needs better</li>
          <li>Makes activities more comfortable for you</li>
          <li>Identifies sensory triggers to avoid</li>
          <li>Finds sensory strategies that help you</li>
          <li>Everyone has sensory preferences - this is normal!</li>
        </ul>
      </div>
    </div>
  );
}
