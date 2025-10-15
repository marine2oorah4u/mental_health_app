import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';

type NoiseType = 'white' | 'brown' | 'pink' | 'rain' | 'ocean' | null;

export function NoiseGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedNoise, setSelectedNoise] = useState<NoiseType>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      stopNoise();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const generateNoiseBuffer = (type: NoiseType, duration: number = 5): AudioBuffer => {
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
        case 'white':
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          break;

        case 'brown':
          let lastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
          }
          break;

        case 'pink':
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11;
            b6 = white * 0.115926;
          }
          break;

        case 'rain':
          // Create rain-like sound using filtered noise with random drops
          let rainLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            // Base filtered noise for continuous rain
            const white = Math.random() * 2 - 1;
            const filtered = (rainLastOut + (0.05 * white)) / 1.05;
            rainLastOut = filtered;

            // Random raindrop impacts (sharper transients)
            const dropChance = Math.random();
            let dropImpact = 0;
            if (dropChance > 0.98) {
              dropImpact = (Math.random() * 2 - 1) * 0.6;
            }

            data[i] = (filtered * 2.5 + dropImpact) * 0.4;
          }
          break;

        case 'ocean':
          // Create ocean wave sounds with low-frequency waves and noise
          let oceanLastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            // Multiple overlapping wave frequencies for natural sound
            const wave1 = Math.sin((i / sampleRate) * Math.PI * 2 * 0.3) * 0.3;
            const wave2 = Math.sin((i / sampleRate) * Math.PI * 2 * 0.17) * 0.2;
            const wave3 = Math.sin((i / sampleRate) * Math.PI * 2 * 0.43) * 0.15;

            // Filtered noise for wave texture
            const white = Math.random() * 2 - 1;
            const filtered = (oceanLastOut + (0.03 * white)) / 1.03;
            oceanLastOut = filtered;

            // Combine waves with filtered noise
            data[i] = (wave1 + wave2 + wave3 + filtered * 1.8) * 0.35;
          }
          break;
      }
    }

    return buffer;
  };

  const playNoise = (type: NoiseType) => {
    if (!type) return;

    stopNoise();

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.gain.value = volume;
    gainNodeRef.current.connect(ctx.destination);

    const buffer = generateNoiseBuffer(type);
    sourceNodeRef.current = ctx.createBufferSource();
    sourceNodeRef.current.buffer = buffer;
    sourceNodeRef.current.loop = true;
    sourceNodeRef.current.connect(gainNodeRef.current);
    sourceNodeRef.current.start(0);

    setIsPlaying(true);
    setSelectedNoise(type);
  };

  const stopNoise = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setSelectedNoise(null);
  };

  const toggleNoise = (type: NoiseType) => {
    if (isPlaying && selectedNoise === type) {
      stopNoise();
    } else {
      playNoise(type);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const noiseTypes = [
    {
      type: 'white' as NoiseType,
      name: 'White Noise',
      emoji: '📻',
      description: 'Even frequencies - masks background noise',
      helps: 'Focus, sleep, blocking distractions',
    },
    {
      type: 'brown' as NoiseType,
      name: 'Brown Noise',
      emoji: '🌊',
      description: 'Deep, rumbling - like waterfall',
      helps: 'Deep focus, anxiety relief, sensory regulation',
    },
    {
      type: 'pink' as NoiseType,
      name: 'Pink Noise',
      emoji: '🎵',
      description: 'Balanced, natural - like rustling leaves',
      helps: 'Concentration, studying, background sound',
    },
    {
      type: 'rain' as NoiseType,
      name: 'Rain Sounds',
      emoji: '🌧️',
      description: 'Gentle rainfall pattern',
      helps: 'Relaxation, sleep, calming',
    },
    {
      type: 'ocean' as NoiseType,
      name: 'Ocean Waves',
      emoji: '🌊',
      description: 'Rhythmic wave sounds',
      helps: 'Meditation, stress relief, grounding',
    },
  ];

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Waves size={24} />
        <h2>Noise Generator</h2>
      </div>

      <div className="noise-intro">
        <p>
          Generate calming background noise to help with focus, reduce anxiety, block
          distractions, or provide sensory regulation. Perfect for sensory processing
          issues, ADHD, autism, and anxiety.
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
          <p>Playing: {noiseTypes.find(n => n.type === selectedNoise)?.name}</p>
          <button onClick={stopNoise} className="btn btn-danger">
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
        {noiseTypes.map((noise) => (
          <button
            key={noise.type}
            onClick={() => toggleNoise(noise.type)}
            className={`noise-type-card ${isPlaying && selectedNoise === noise.type ? 'active' : ''}`}
          >
            <div className="noise-type-emoji">{noise.emoji}</div>
            <h3>{noise.name}</h3>
            <p className="noise-type-description">{noise.description}</p>
            <div className="noise-type-helps">
              <strong>Helps with:</strong> {noise.helps}
            </div>
            {isPlaying && selectedNoise === noise.type ? (
              <div className="noise-type-status playing">▶ Playing</div>
            ) : (
              <div className="noise-type-status">Tap to play</div>
            )}
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h3>How Noise Helps:</h3>
        <ul>
          <li><strong>Masks Distractions:</strong> Blocks out sudden noises that break focus</li>
          <li><strong>Sensory Regulation:</strong> Provides consistent sensory input</li>
          <li><strong>Reduces Anxiety:</strong> Calming, predictable sound</li>
          <li><strong>Improves Focus:</strong> Creates consistent audio environment</li>
          <li><strong>Helps Sleep:</strong> Masks environmental sounds</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li>ADHD - Reduces auditory distractions</li>
          <li>Autism - Predictable sensory input</li>
          <li>Anxiety - Calming, grounding effect</li>
          <li>Sensory Processing - Consistent stimulation</li>
          <li>Anyone needing focus or calm</li>
        </ul>
      </div>
    </div>
  );
}
