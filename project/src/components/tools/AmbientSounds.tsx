import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

type AmbientType = 'forest' | 'rain' | 'ocean' | 'thunder' | 'campfire' | 'stream' | 'wind' | 'birds' | 'cafe' | 'library' | null;

export function AmbientSounds() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [selectedAmbient, setSelectedAmbient] = useState<AmbientType>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const generateAmbientBuffer = (type: AmbientType, duration: number = 8): AudioBuffer => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);

      switch (type) {
        case 'forest':
          let forestLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (forestLastOut + (0.08 * white)) / 1.08;
            forestLastOut = filtered;

            const birdChance = Math.random();
            let birdChirp = 0;
            if (birdChance > 0.995) {
              const chirpFreq = 2000 + Math.random() * 2000;
              birdChirp = Math.sin((i / sampleRate) * Math.PI * 2 * chirpFreq) * 0.3 * Math.exp(-((i % 4000) / 2000));
            }

            data[i] = (filtered * 1.5 + birdChirp) * 0.35;
          }
          break;

        case 'rain':
          let rainLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (rainLastOut + (0.05 * white)) / 1.05;
            rainLastOut = filtered;

            const dropChance = Math.random();
            let dropImpact = 0;
            if (dropChance > 0.97) {
              dropImpact = (Math.random() * 2 - 1) * 0.7;
            }

            data[i] = (filtered * 3 + dropImpact) * 0.4;
          }
          break;

        case 'ocean':
          let oceanLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const wave1 = Math.sin((i / sampleRate) * Math.PI * 2 * 0.15) * 0.4;
            const wave2 = Math.sin((i / sampleRate) * Math.PI * 2 * 0.08) * 0.3;
            const wave3 = Math.sin((i / sampleRate) * Math.PI * 2 * 0.22) * 0.2;

            const white = Math.random() * 2 - 1;
            const filtered = (oceanLastOut + (0.04 * white)) / 1.04;
            oceanLastOut = filtered;

            data[i] = (wave1 + wave2 + wave3 + filtered * 2) * 0.35;
          }
          break;

        case 'thunder':
          let thunderLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (thunderLastOut + (0.02 * white)) / 1.02;
            thunderLastOut = filtered;

            const thunderChance = Math.random();
            let thunder = 0;
            if (thunderChance > 0.9998) {
              const rumbleDuration = 20000;
              const position = i % rumbleDuration;
              const envelope = Math.exp(-position / 8000);
              thunder = (Math.random() * 2 - 1) * envelope * 0.8;
            }

            data[i] = (filtered * 2.5 + thunder) * 0.4;
          }
          break;

        case 'campfire':
          let fireLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (fireLastOut + (0.06 * white)) / 1.06;
            fireLastOut = filtered;

            const crackleChance = Math.random();
            let crackle = 0;
            if (crackleChance > 0.985) {
              crackle = (Math.random() * 2 - 1) * 0.6;
            }

            data[i] = (filtered * 2.2 + crackle) * 0.35;
          }
          break;

        case 'stream':
          let streamLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (streamLastOut + (0.04 * white)) / 1.04;
            streamLastOut = filtered;

            const bubble = Math.sin((i / sampleRate) * Math.PI * 2 * (1 + Math.random() * 2)) * 0.15;

            data[i] = (filtered * 2.8 + bubble) * 0.4;
          }
          break;

        case 'wind':
          let windLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (windLastOut + (0.03 * white)) / 1.03;
            windLastOut = filtered;

            const gust = Math.sin((i / sampleRate) * Math.PI * 2 * 0.05) * 0.3;

            data[i] = (filtered * 2.5 + gust) * 0.38;
          }
          break;

        case 'birds':
          let birdsLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (birdsLastOut + (0.1 * white)) / 1.1;
            birdsLastOut = filtered;

            const birdChance = Math.random();
            let birdSound = 0;
            if (birdChance > 0.992) {
              const freq = 1500 + Math.random() * 2500;
              const progress = (i % 6000) / 6000;
              const envelope = Math.sin(progress * Math.PI);
              birdSound = Math.sin((i / sampleRate) * Math.PI * 2 * freq) * envelope * 0.4;
            }

            data[i] = (filtered * 0.8 + birdSound) * 0.35;
          }
          break;

        case 'cafe':
          let cafeLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (cafeLastOut + (0.07 * white)) / 1.07;
            cafeLastOut = filtered;

            const chatterChance = Math.random();
            let chatter = 0;
            if (chatterChance > 0.988) {
              const freq = 200 + Math.random() * 400;
              chatter = Math.sin((i / sampleRate) * Math.PI * 2 * freq) * 0.3;
            }

            data[i] = (filtered * 2 + chatter) * 0.35;
          }
          break;

        case 'library':
          let libraryLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const filtered = (libraryLastOut + (0.12 * white)) / 1.12;
            libraryLastOut = filtered;

            const rustleChance = Math.random();
            let rustle = 0;
            if (rustleChance > 0.995) {
              rustle = (Math.random() * 2 - 1) * 0.2;
            }

            data[i] = (filtered * 1.2 + rustle) * 0.3;
          }
          break;
      }
    }

    return buffer;
  };

  const playAmbient = (type: AmbientType) => {
    if (!type) return;

    stopAmbient();

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.gain.value = volume;
    gainNodeRef.current.connect(ctx.destination);

    const buffer = generateAmbientBuffer(type);
    sourceNodeRef.current = ctx.createBufferSource();
    sourceNodeRef.current.buffer = buffer;
    sourceNodeRef.current.loop = true;
    sourceNodeRef.current.connect(gainNodeRef.current);
    sourceNodeRef.current.start(0);

    setIsPlaying(true);
    setSelectedAmbient(type);
  };

  const stopAmbient = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
    setSelectedAmbient(null);
  };

  const toggleAmbient = (type: AmbientType) => {
    if (isPlaying && selectedAmbient === type) {
      stopAmbient();
    } else {
      playAmbient(type);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const ambientTypes = [
    {
      type: 'rain' as AmbientType,
      name: 'Rainfall',
      emoji: '🌧️',
      description: 'Steady rain with occasional drops',
      helps: 'Sleep, focus, relaxation',
    },
    {
      type: 'ocean' as AmbientType,
      name: 'Ocean Waves',
      emoji: '🌊',
      description: 'Gentle waves washing ashore',
      helps: 'Meditation, sleep, stress relief',
    },
    {
      type: 'forest' as AmbientType,
      name: 'Forest',
      emoji: '🌲',
      description: 'Rustling leaves with bird songs',
      helps: 'Nature connection, peace, grounding',
    },
    {
      type: 'thunder' as AmbientType,
      name: 'Thunderstorm',
      emoji: '⛈️',
      description: 'Distant thunder with rain',
      helps: 'Deep sleep, dramatic ambiance',
    },
    {
      type: 'campfire' as AmbientType,
      name: 'Campfire',
      emoji: '🔥',
      description: 'Crackling fire sounds',
      helps: 'Comfort, warmth, cozy feeling',
    },
    {
      type: 'stream' as AmbientType,
      name: 'Babbling Brook',
      emoji: '💧',
      description: 'Flowing water over stones',
      helps: 'Concentration, tranquility',
    },
    {
      type: 'wind' as AmbientType,
      name: 'Wind',
      emoji: '💨',
      description: 'Gentle breeze through trees',
      helps: 'Calm, meditation, openness',
    },
    {
      type: 'birds' as AmbientType,
      name: 'Bird Songs',
      emoji: '🐦',
      description: 'Various bird calls and chirps',
      helps: 'Morning energy, nature, joy',
    },
    {
      type: 'cafe' as AmbientType,
      name: 'Coffee Shop',
      emoji: '☕',
      description: 'Ambient cafe chatter',
      helps: 'Productivity, creativity, studying',
    },
    {
      type: 'library' as AmbientType,
      name: 'Library',
      emoji: '📚',
      description: 'Quiet with subtle rustling',
      helps: 'Deep work, reading, silence',
    },
  ];

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Music size={24} />
        <h2>Ambient Sounds</h2>
      </div>

      <div className="noise-intro">
        <p>
          Create calming ambient soundscapes to enhance focus, reduce stress, and create
          a peaceful environment. Perfect for studying, sleeping, meditation, or just
          creating a pleasant atmosphere.
        </p>
      </div>

      {isPlaying && (
        <div className="noise-playing-indicator">
          <div className="noise-playing-animation">
            <Volume2 size={32} />
            <div className="noise-sound-waves">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <p>Playing: {ambientTypes.find(n => n.type === selectedAmbient)?.name}</p>
          <button onClick={stopAmbient} className="btn btn-danger">
            <VolumeX size={18} />
            Stop Sound
          </button>
        </div>
      )}

      <div className="noise-volume-control">
        <label className="noise-volume-label">
          <Volume2 size={20} />
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="noise-volume-slider"
        />
      </div>

      <div className="noise-types-grid">
        {ambientTypes.map((ambient) => (
          <button
            key={ambient.type}
            onClick={() => toggleAmbient(ambient.type)}
            className={`noise-type-card ${isPlaying && selectedAmbient === ambient.type ? 'active' : ''}`}
          >
            <div className="noise-type-emoji">{ambient.emoji}</div>
            <h3>{ambient.name}</h3>
            <p className="noise-type-description">{ambient.description}</p>
            <div className="noise-type-helps">
              <strong>Helps with:</strong> {ambient.helps}
            </div>
            {isPlaying && selectedAmbient === ambient.type ? (
              <div className="noise-type-status playing">▶ Playing</div>
            ) : (
              <div className="noise-type-status">Tap to play</div>
            )}
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>About Ambient Sounds:</h3>
        <ul>
          <li><strong>Natural Sounds:</strong> Forest, rain, ocean, thunder, stream, wind, birds</li>
          <li><strong>Environmental:</strong> Cafe and library for productivity</li>
          <li><strong>Cozy:</strong> Campfire for warmth and comfort</li>
          <li><strong>Looping:</strong> All sounds loop seamlessly for continuous play</li>
          <li><strong>Adjustable:</strong> Control volume to your preference</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li>ADHD - Background noise for focus</li>
          <li>Anxiety - Calming natural sounds</li>
          <li>Sleep Issues - Soothing ambient for rest</li>
          <li>Sensory Needs - Predictable audio environment</li>
          <li>Anyone seeking peace and calm</li>
        </ul>
      </div>
    </div>
  );
}
