import { useState } from 'react';
import { Sun, Moon, Eye, Palette } from 'lucide-react';

type ColorFilter = 'none' | 'warm' | 'cool' | 'sepia' | 'grayscale' | 'blue-light';

export function ScreenDimmer() {
  const [dimLevel, setDimLevel] = useState(0);
  const [colorFilter, setColorFilter] = useState<ColorFilter>('none');
  const [isActive, setIsActive] = useState(false);

  const applyDimmer = (level: number) => {
    setDimLevel(level);
    setIsActive(level > 0);
  };

  const applyFilter = (filter: ColorFilter) => {
    setColorFilter(filter);
  };

  const resetAll = () => {
    setDimLevel(0);
    setColorFilter('none');
    setIsActive(false);
  };

  const getFilterStyle = () => {
    const filters: string[] = [];

    switch (colorFilter) {
      case 'warm':
        filters.push('sepia(0.3)');
        filters.push('saturate(1.2)');
        filters.push('hue-rotate(-10deg)');
        break;
      case 'cool':
        filters.push('hue-rotate(180deg)');
        filters.push('saturate(0.7)');
        break;
      case 'sepia':
        filters.push('sepia(1)');
        break;
      case 'grayscale':
        filters.push('grayscale(1)');
        break;
      case 'blue-light':
        filters.push('sepia(0.5)');
        filters.push('saturate(1.5)');
        filters.push('hue-rotate(-20deg)');
        break;
    }

    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  const dimmerOpacity = dimLevel / 100;

  const colorFilters = [
    {
      id: 'none' as ColorFilter,
      name: 'No Filter',
      emoji: '✨',
      description: 'Normal screen',
      color: 'transparent',
    },
    {
      id: 'warm' as ColorFilter,
      name: 'Warm',
      emoji: '🌅',
      description: 'Reduce blue light, easier on eyes at night',
      color: '#ff9966',
    },
    {
      id: 'blue-light' as ColorFilter,
      name: 'Blue Light Filter',
      emoji: '🌙',
      description: 'Strong blue light reduction for evening',
      color: '#ffaa66',
    },
    {
      id: 'cool' as ColorFilter,
      name: 'Cool',
      emoji: '❄️',
      description: 'Cooler tones, may help with focus',
      color: '#6699ff',
    },
    {
      id: 'sepia' as ColorFilter,
      name: 'Sepia',
      emoji: '📜',
      description: 'Vintage look, reduces contrast',
      color: '#cc9966',
    },
    {
      id: 'grayscale' as ColorFilter,
      name: 'Grayscale',
      emoji: '⬛',
      description: 'Remove all color, reduce stimulation',
      color: '#888888',
    },
  ];

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Sun size={24} />
        <h2>Screen Dimmer & Color Filters</h2>
      </div>

      <div className="dimmer-intro">
        <p>
          Reduce screen brightness beyond system settings and apply color filters to reduce
          eye strain, light sensitivity, or visual overstimulation. Perfect for photosensitivity,
          migraines, autism, and sensory processing issues.
        </p>
      </div>

      {isActive && (
        <div className="dimmer-active-notice">
          <Eye size={20} />
          <span>Screen modifications active</span>
          <button onClick={resetAll} className="btn btn-danger btn-small">
            Reset All
          </button>
        </div>
      )}

      <div className="dimmer-controls">
        <h3>
          <Moon size={20} />
          Brightness Reduction
        </h3>
        <div className="dimmer-slider-container">
          <label className="dimmer-label">
            Dim Level: {dimLevel}%
          </label>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={dimLevel}
            onChange={(e) => applyDimmer(Number(e.target.value))}
            className="dimmer-slider"
          />
          <div className="dimmer-slider-labels">
            <span>Bright</span>
            <span>Dim</span>
          </div>
        </div>

        <div className="dimmer-presets">
          <button
            onClick={() => applyDimmer(0)}
            className="btn btn-secondary btn-small"
          >
            Normal
          </button>
          <button
            onClick={() => applyDimmer(25)}
            className="btn btn-secondary btn-small"
          >
            25%
          </button>
          <button
            onClick={() => applyDimmer(50)}
            className="btn btn-secondary btn-small"
          >
            50%
          </button>
          <button
            onClick={() => applyDimmer(75)}
            className="btn btn-secondary btn-small"
          >
            75%
          </button>
        </div>
      </div>

      <div className="dimmer-filters">
        <h3>
          <Palette size={20} />
          Color Filters
        </h3>
        <div className="dimmer-filters-grid">
          {colorFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => applyFilter(filter.id)}
              className={`dimmer-filter-card ${colorFilter === filter.id ? 'active' : ''}`}
            >
              <div
                className="dimmer-filter-preview"
                style={{ backgroundColor: filter.color }}
              >
                <span className="dimmer-filter-emoji">{filter.emoji}</span>
              </div>
              <h4>{filter.name}</h4>
              <p>{filter.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="dimmer-preview">
        <h3>Preview:</h3>
        <div
          className="dimmer-preview-box"
          style={{
            filter: getFilterStyle(),
            position: 'relative',
          }}
        >
          {dimLevel > 0 && (
            <div
              className="dimmer-overlay-preview"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                opacity: dimmerOpacity,
                pointerEvents: 'none',
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1, padding: '1rem' }}>
            <h4>Sample Text</h4>
            <p>This is how your screen will look with current settings.</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#ff6b6b' }}></div>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#4ecdc4' }}></div>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#ffe66d' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="tool-info">
        <h3>When to Use:</h3>
        <ul>
          <li><strong>Light Sensitivity:</strong> Reduce brightness in bright environments</li>
          <li><strong>Evening Use:</strong> Blue light filter helps with sleep</li>
          <li><strong>Migraines:</strong> Lower brightness and use warm filter</li>
          <li><strong>Visual Overload:</strong> Grayscale reduces visual stimulation</li>
          <li><strong>Eye Strain:</strong> Reduce contrast and brightness</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Autism:</strong> Visual sensory sensitivity</li>
          <li><strong>Migraines:</strong> Light-triggered headaches</li>
          <li><strong>Photosensitivity:</strong> Medical sensitivity to light</li>
          <li><strong>Eye Conditions:</strong> Various vision issues</li>
          <li><strong>Evening Users:</strong> Better sleep with reduced blue light</li>
        </ul>
        <h3>Tips:</h3>
        <ul>
          <li>Use warm filter in evening to improve sleep quality</li>
          <li>Grayscale can help reduce phone addiction</li>
          <li>Combine dimmer with color filter for maximum effect</li>
          <li>Reset to normal for color-critical tasks</li>
          <li>Adjust based on environment brightness</li>
        </ul>
      </div>

      {(dimLevel > 0 || colorFilter !== 'none') && (
        <div
          className="screen-dimmer-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            opacity: dimmerOpacity,
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      )}

      {colorFilter !== 'none' && (
        <style>{`
          html {
            filter: ${getFilterStyle()} !important;
          }
        `}</style>
      )}
    </div>
  );
}
