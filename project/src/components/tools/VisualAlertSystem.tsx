import { useState, useEffect, useRef } from 'react';
import { Bell, Zap, AlertCircle, Clock, Settings, AlertTriangle, Upload, Play } from 'lucide-react';
import { alertSounds } from '../../utils/alertSounds';

interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

interface AlertSettings {
  intensity: number;
  brightness: number;
  duration: number;
  soundEnabled: boolean;
  selectedSound: string;
  soundRepeat: number; // 0 = continuous, 1-10 = number of times
  soundInterval: number; // milliseconds between sound repeats
  customSoundUrl: string | null; // URL for custom uploaded sound
}

// Organize sounds by category
const soundOptions = [
  // Gentle sounds
  ...alertSounds.filter(s => s.category === 'gentle').map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    synthesize: s.synthesize,
    category: 'Gentle' as const
  })),
  // Moderate sounds
  ...alertSounds.filter(s => s.category === 'moderate').map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    synthesize: s.synthesize,
    category: 'Moderate' as const
  })),
  // Urgent sounds
  ...alertSounds.filter(s => s.category === 'urgent').map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    synthesize: s.synthesize,
    category: 'Urgent' as const
  })),
  // Special options
  { id: 'custom', name: 'Custom', description: 'Upload your own sound', category: 'Special' as const },
  { id: 'none', name: 'Silent', description: 'No sound', category: 'Special' as const },
];

export function VisualAlertSystem() {
  const [showWarning, setShowWarning] = useState(true);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [testMode, setTestMode] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState<AlertSettings>({
    intensity: 20,
    brightness: 30,
    duration: 5000,
    soundEnabled: true,
    selectedSound: 'notification-ding',
    soundRepeat: 3,
    soundInterval: 1000,
    customSoundUrl: null,
  });
  const [customSoundFile, setCustomSoundFile] = useState<File | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const flashIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundIntervalRef = useRef<number | null>(null);
  const soundCountRef = useRef<number>(0);

  useEffect(() => {
    if (testMode !== 'none' && hasAcknowledged) {
      triggerVisualAlert(testMode);
      const timer = setTimeout(() => setTestMode('none'), settings.duration);
      return () => {
        clearTimeout(timer);
        stopFlashing();
      };
    }
  }, [testMode, hasAcknowledged, settings.duration]);

  const previewSound = (soundId: string) => {
    const sound = soundOptions.find(s => s.id === soundId);
    if (!sound || soundId === 'none') return;

    // Handle custom sound
    if (soundId === 'custom' && settings.customSoundUrl) {
      const audio = new Audio(settings.customSoundUrl);
      audio.volume = 0.5;
      audio.play().catch(err => console.error('Error playing custom sound:', err));
      return;
    }

    // Use synthesized sound
    if ('synthesize' in sound && sound.synthesize) {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContextRef.current) audioContextRef.current = ctx;
      sound.synthesize(ctx, 0.5);
    }
  };

  const playBeepWithSettings = (soundSettings: AlertSettings, priority: 'low' | 'medium' | 'high', ctx: AudioContext) => {
    if (soundSettings.selectedSound === 'custom' && soundSettings.customSoundUrl) {
      const audio = new Audio(soundSettings.customSoundUrl);
      audio.volume = 0.15; // Lower for preview
      audio.play().catch(err => console.error('Error playing custom sound:', err));
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const frequencies = { low: 400, medium: 600, high: 800 };
    generateSoundPattern(oscillator, gainNode, soundSettings.selectedSound, frequencies[priority], ctx);
  };

  const generateSoundPattern = (oscillator: OscillatorNode, gainNode: GainNode, soundType: string, baseFreq: number, ctx: AudioContext) => {
    let duration = 0.5;

    // Match EXACTLY the main playSingleBeep patterns
    if (soundType === 'soft-beep') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq * 0.7;
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      duration = 0.6;
    } else if (soundType === 'double-beep') {
      oscillator.type = 'triangle';
      oscillator.frequency.value = baseFreq;
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.value = baseFreq;
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.35);
      duration = 0.35;
    } else if (soundType === 'triple-beep') {
      oscillator.type = 'triangle';
      oscillator.frequency.value = baseFreq;
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.value = baseFreq;
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.27);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.27);
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.type = 'triangle';
      osc3.frequency.value = baseFreq;
      gain3.gain.setValueAtTime(0.1, ctx.currentTime + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.42);
      osc3.start(ctx.currentTime + 0.3);
      osc3.stop(ctx.currentTime + 0.42);
      duration = 0.42;
    } else if (soundType === 'descending') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, ctx.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      duration = 0.4;
    } else if (soundType === 'warble') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      for (let i = 0; i < 5; i++) {
        oscillator.frequency.setValueAtTime(baseFreq * 1.2, ctx.currentTime + (i * 0.12));
        oscillator.frequency.setValueAtTime(baseFreq * 0.9, ctx.currentTime + (i * 0.12) + 0.06);
      }
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      duration = 0.6;
    } else if (soundType === 'gong') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq * 0.4;
      gainNode.gain.setValueAtTime(0.14, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      duration = 1.2;
    } else if (soundType === 'whistle') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq * 2.5;
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      duration = 0.25;
    } else if (soundType === 'marimba') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq * 1.2;
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.value = baseFreq * 2.4;
      gain2.gain.setValueAtTime(0.06, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.3);
      duration = 0.4;
    } else if (soundType === 'siren') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscillator.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.45);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      duration = 0.6;
    } else if (soundType === 'buzz') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = baseFreq * 0.5;
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      duration = 0.4;
    } else if (soundType === 'ding') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq * 2;
      gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      duration = 0.2;
    } else if (soundType === 'chirp') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFreq * 0.8, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, ctx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      duration = 0.15;
    } else if (soundType === 'horn') {
      oscillator.type = 'square';
      oscillator.frequency.value = baseFreq * 0.6;
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      duration = 0.35;
    } else if (soundType === 'pulse') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq;
      gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.16, ctx.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      duration = 0.4;
    } else if (soundType === 'trill') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      duration = 0.3;
    } else if (soundType === 'chime') {
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq;
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      duration = 0.8;
    } else if (soundType === 'alert') {
      oscillator.type = 'square';
      oscillator.frequency.value = baseFreq;
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      duration = 0.3;
    } else {
      // Default beep
      oscillator.type = 'triangle';
      oscillator.frequency.value = baseFreq;
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playSingleBeep = (priority: 'low' | 'medium' | 'high') => {
    if (settings.selectedSound === 'none') return;

    // If custom sound is selected, play the uploaded file
    if (settings.selectedSound === 'custom' && settings.customSoundUrl) {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
        customAudioRef.current.currentTime = 0;
      }
      customAudioRef.current = new Audio(settings.customSoundUrl);
      customAudioRef.current.volume = 0.3;
      customAudioRef.current.play().catch(err => console.error('Error playing custom sound:', err));
      return;
    }

    // Use synthesized sound
    const sound = soundOptions.find(s => s.id === settings.selectedSound);
    if (sound && 'synthesize' in sound && sound.synthesize) {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContextRef.current) audioContextRef.current = ctx;
      sound.synthesize(ctx, 0.5);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const frequencies = { low: 400, medium: 600, high: 800 };

    // Different sound patterns based on type (volumes reduced by ~60% for comfort)
    if (settings.selectedSound === 'soft-beep') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority] * 0.7;
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    } else if (settings.selectedSound === 'double-beep') {
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequencies[priority];
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.value = frequencies[priority];
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.35);
    } else if (settings.selectedSound === 'triple-beep') {
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequencies[priority];
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.value = frequencies[priority];
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.27);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.27);
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.type = 'triangle';
      osc3.frequency.value = frequencies[priority];
      gain3.gain.setValueAtTime(0.1, ctx.currentTime + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.42);
      osc3.start(ctx.currentTime + 0.3);
      osc3.stop(ctx.currentTime + 0.42);
    } else if (settings.selectedSound === 'descending') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[priority] * 1.5, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequencies[priority] * 0.7, ctx.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    } else if (settings.selectedSound === 'warble') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[priority], ctx.currentTime);
      for (let i = 0; i < 5; i++) {
        oscillator.frequency.setValueAtTime(frequencies[priority] * 1.2, ctx.currentTime + (i * 0.12));
        oscillator.frequency.setValueAtTime(frequencies[priority] * 0.9, ctx.currentTime + (i * 0.12) + 0.06);
      }
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    } else if (settings.selectedSound === 'gong') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority] * 0.4;
      gainNode.gain.setValueAtTime(0.14, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    } else if (settings.selectedSound === 'whistle') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority] * 2.5;
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    } else if (settings.selectedSound === 'marimba') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority] * 1.2;
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.value = frequencies[priority] * 2.4;
      gain2.gain.setValueAtTime(0.06, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.3);
    } else if (settings.selectedSound === 'siren') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[priority], ctx.currentTime);
      oscillator.frequency.setValueAtTime(frequencies[priority] * 1.5, ctx.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(frequencies[priority], ctx.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(frequencies[priority] * 1.5, ctx.currentTime + 0.45);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    } else if (settings.selectedSound === 'buzz') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = frequencies[priority] * 0.5;
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    } else if (settings.selectedSound === 'ding') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority] * 2;
      gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    } else if (settings.selectedSound === 'chirp') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[priority] * 0.8, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequencies[priority] * 1.8, ctx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    } else if (settings.selectedSound === 'horn') {
      oscillator.type = 'square';
      oscillator.frequency.value = frequencies[priority] * 0.6;
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    } else if (settings.selectedSound === 'pulse') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority];
      gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.16, ctx.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    } else if (settings.selectedSound === 'trill') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[priority], ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequencies[priority] * 1.5, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else if (settings.selectedSound === 'chime') {
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[priority];
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    } else if (settings.selectedSound === 'alert') {
      oscillator.type = 'square';
      oscillator.frequency.value = frequencies[priority];
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else {
      // Default beep
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequencies[priority];
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    }

    const duration = settings.selectedSound === 'soft-beep' ? 0.6 :
                     settings.selectedSound === 'double-beep' ? 0.35 :
                     settings.selectedSound === 'triple-beep' ? 0.42 :
                     settings.selectedSound === 'descending' ? 0.4 :
                     settings.selectedSound === 'warble' ? 0.6 :
                     settings.selectedSound === 'gong' ? 1.2 :
                     settings.selectedSound === 'whistle' ? 0.25 :
                     settings.selectedSound === 'marimba' ? 0.4 :
                     settings.selectedSound === 'chime' ? 0.8 :
                     settings.selectedSound === 'trill' ? 0.3 :
                     settings.selectedSound === 'alert' ? 0.3 :
                     settings.selectedSound === 'siren' ? 0.6 :
                     settings.selectedSound === 'buzz' ? 0.4 :
                     settings.selectedSound === 'ding' ? 0.2 :
                     settings.selectedSound === 'chirp' ? 0.15 :
                     settings.selectedSound === 'horn' ? 0.35 : 0.5;

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playSound = (priority: 'low' | 'medium' | 'high') => {
    if (!settings.soundEnabled || settings.selectedSound === 'none') return;

    // Clear any existing sound interval
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }

    soundCountRef.current = 0;

    // Play first beep immediately
    playSingleBeep(priority);
    soundCountRef.current = 1;

    // If repeat is 1, we're done
    if (settings.soundRepeat === 1) return;

    // Set up interval for repeating sounds
    soundIntervalRef.current = window.setInterval(() => {
      playSingleBeep(priority);
      soundCountRef.current++;

      // Stop if we've reached the repeat count (0 means continuous throughout duration)
      if (settings.soundRepeat > 0 && soundCountRef.current >= settings.soundRepeat) {
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current);
          soundIntervalRef.current = null;
        }
      }
    }, settings.soundInterval);

    // If soundRepeat is 0 (continuous), stop sounds when duration ends
    if (settings.soundRepeat === 0 && settings.duration < 60000) {
      setTimeout(() => {
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current);
          soundIntervalRef.current = null;
        }
      }, settings.duration);
    }
  };

  const handleCustomSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file (MP3, WAV, OGG, etc.)');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please select a file under 5MB.');
        return;
      }

      setCustomSoundFile(file);
      const url = URL.createObjectURL(file);
      setSettings({...settings, customSoundUrl: url, selectedSound: 'custom'});
    }
  };

  const triggerVisualAlert = (priority: 'low' | 'medium' | 'high') => {
    stopFlashing();

    if (settings.soundEnabled) {
      playSound(priority);
    }

    if ('vibrate' in navigator) {
      const vibrationIntensity = Math.floor(settings.intensity / 100 * 300);
      const patterns = {
        low: [vibrationIntensity],
        medium: [vibrationIntensity, 100, vibrationIntensity],
        high: [vibrationIntensity, 100, vibrationIntensity, 100, vibrationIntensity],
      };
      navigator.vibrate(patterns[priority]);
    }
  };

  const stopFlashing = () => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  };

  const addAlert = (title: string, message: string, priority: 'low' | 'medium' | 'high') => {
    if (!hasAcknowledged) {
      alert('Please acknowledge the safety warning first');
      return;
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date(),
      priority,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    if (isEnabled) {
      triggerVisualAlert(priority);
    }
  };

  const testAlert = (priority: 'low' | 'medium' | 'high') => {
    const messages = {
      low: { title: 'Low Priority', message: 'General notification' },
      medium: { title: 'Medium Priority', message: 'Important update' },
      high: { title: 'High Priority', message: 'Urgent attention needed!' },
    };
    addAlert(messages[priority].title, messages[priority].message, priority);
    setTestMode(priority);
  };

  const getPriorityColor = (priority: string, alpha: number) => {
    switch (priority) {
      case 'high': return `rgba(239, 68, 68, ${alpha})`; // Red with transparency
      case 'medium': return `rgba(245, 158, 11, ${alpha})`; // Orange with transparency
      case 'low': return `rgba(16, 185, 129, ${alpha})`; // Green with transparency
      default: return `rgba(107, 114, 128, ${alpha})`; // Gray with transparency
    }
  };

  if (showWarning && !hasAcknowledged) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <AlertTriangle size={24} />
          <h2>⚠️ PHOTOSENSITIVITY WARNING</h2>
        </div>

        <div style={{padding: 'var(--space-xxl)', background: '#FEE2E2', border: '3px solid #DC2626', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)'}}>
          <div style={{fontSize: '3rem', textAlign: 'center', marginBottom: 'var(--space-lg)'}}>⚠️</div>

          <h2 style={{color: '#991B1B', textAlign: 'center', marginBottom: 'var(--space-lg)'}}>
            CRITICAL SAFETY WARNING
          </h2>

          <div style={{background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)'}}>
            <h3 style={{color: '#DC2626', marginTop: 0}}>⚠️ Photosensitive Epilepsy Risk</h3>
            <p style={{fontSize: '1.125rem', lineHeight: '1.8', marginBottom: 'var(--space-md)', color: '#111827'}}>
              <strong>This tool uses flashing lights that may trigger seizures in people with photosensitive epilepsy.</strong>
            </p>
            <p style={{fontSize: '1rem', lineHeight: '1.6', color: '#1F2937'}}>
              A very small percentage of people may experience seizures when exposed to flashing lights or patterns.
              Even people with no history of seizures or epilepsy may have an undiagnosed condition.
            </p>
          </div>

          <div style={{background: '#FEF3C7', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '2px solid #F59E0B', marginBottom: 'var(--space-lg)'}}>
            <h4 style={{marginTop: 0, color: '#78350F'}}>DO NOT USE if you or anyone nearby:</h4>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', color: '#92400E'}}>
              <li>Has epilepsy or any seizure disorder</li>
              <li>Has experienced seizures</li>
              <li>Has a family history of epilepsy</li>
              <li>Is sensitive to flashing lights</li>
              <li>Experiences dizziness, altered vision, or discomfort from flashing lights</li>
            </ul>
          </div>

          <div style={{background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)'}}>
            <h3 style={{marginTop: 0, color: '#111827'}}>📋 Liability Disclaimer</h3>
            <p style={{fontSize: '0.875rem', lineHeight: '1.6', color: '#1F2937'}}>
              By clicking "I Understand and Accept Risk" below, you acknowledge that:
            </p>
            <ol style={{fontSize: '0.875rem', lineHeight: '1.8', color: '#374151'}}>
              <li>You have read and understood this warning</li>
              <li>You are aware of the risks associated with flashing lights</li>
              <li>You confirm you do not have any conditions that make you photosensitive</li>
              <li>You will ensure no one with photosensitivity is present when using this tool</li>
              <li>You accept full responsibility for any consequences of using this tool</li>
              <li>You release this application and its creators from any liability for adverse effects</li>
              <li>You understand this tool should only be used in controlled, supervised environments</li>
            </ol>
          </div>

          <div style={{display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)'}}>
            <button
              onClick={() => setShowWarning(false)}
              className="btn btn-secondary"
              style={{flex: 1}}
            >
              Cancel - Go Back
            </button>
            <button
              onClick={() => {
                setHasAcknowledged(true);
                setShowWarning(false);
              }}
              className="btn btn-danger"
              style={{flex: 1}}
            >
              I Understand and Accept Risk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Bell size={24} />
        <h2>Visual Alert System</h2>
      </div>

      <div style={{padding: 'var(--space-md)', background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center', color: '#78350F'}}>
        <AlertTriangle size={24} color="#F59E0B" />
        <div style={{flex: 1}}>
          <strong style={{color: '#78350F'}}>Safety Reminder:</strong> Flashing lights can trigger seizures. Use with caution.
        </div>
        <button
          onClick={() => setShowWarning(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#1F2937',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          View Warning
        </button>
      </div>

      <div className="visual-alert-intro">
        <p>
          Customizable screen flashing and vibration alerts for Deaf/Hard of Hearing scouts.
          Control intensity, brightness, duration, and sound options.
        </p>
      </div>

      <div className="visual-alert-toggle">
        <div className="visual-alert-status">
          <div className={`status-indicator ${isEnabled ? 'active' : 'inactive'}`}>
            {isEnabled ? <Zap size={24} /> : <Bell size={24} />}
          </div>
          <div>
            <h3>Visual Alerts {isEnabled ? 'Enabled' : 'Disabled'}</h3>
            <p>{isEnabled ? 'You will receive visual and vibration alerts' : 'Enable to receive alerts'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`btn ${isEnabled ? 'btn-danger' : 'btn-primary'}`}
        >
          {isEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div style={{padding: 'var(--space-xl)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)'}}>
        <h3 style={{margin: 0, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'}}>
          <Settings size={20} />
          Alert Settings
        </h3>

        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'}}>
            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: 'var(--space-sm)'}}>
                Flash Intensity: {settings.intensity}% {settings.intensity <= 20 ? '(Safe)' : settings.intensity <= 50 ? '(Moderate)' : '(High)'}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={settings.intensity}
                onChange={(e) => setSettings({...settings, intensity: Number(e.target.value)})}
                style={{width: '100%'}}
              />
              <small style={{color: 'var(--color-textMuted)'}}>
                Controls how fast the flashes are (5-20% = Safe, 21-50% = Moderate, 51-100% = High Risk)
              </small>
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: 'var(--space-sm)'}}>
                Brightness: {settings.brightness}% {settings.brightness <= 30 ? '(Safe)' : settings.brightness <= 60 ? '(Moderate)' : '(High)'}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={settings.brightness}
                onChange={(e) => setSettings({...settings, brightness: Number(e.target.value)})}
                style={{width: '100%'}}
              />
              <small style={{color: 'var(--color-textMuted)'}}>
                Controls the brightness of the flash (5-30% = Safe, 31-60% = Moderate, 61-100% = High Risk)
              </small>
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: 'var(--space-sm)'}}>
                Duration: {settings.duration >= 60000 ? 'Continuous' : `${(settings.duration / 1000).toFixed(1)}s`}
              </label>
              <input
                type="range"
                min="2000"
                max="60000"
                step="1000"
                value={settings.duration}
                onChange={(e) => setSettings({...settings, duration: Number(e.target.value)})}
                style={{width: '100%'}}
              />
              <small style={{color: 'var(--color-textMuted)'}}>
                How long the alert lasts (2-59s or Continuous at 60s)
              </small>
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 600, marginBottom: 'var(--space-md)'}}>
                Sound Options
              </label>
              <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)'}}>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                  id="sound-toggle"
                />
                <label htmlFor="sound-toggle">Enable sound with alerts</label>
              </div>

              {settings.soundEnabled && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'}}>
                  {/* Gentle Sounds */}
                  <div>
                    <h4 style={{marginBottom: 'var(--space-sm)', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600}}>🌸 Gentle Sounds</h4>
                    <div style={{display: 'grid', gap: 'var(--space-sm)'}}>
                      {soundOptions.filter(s => s.category === 'Gentle').map(sound => (
                        <div key={sound.id} style={{position: 'relative'}}>
                          <button
                            onClick={() => setSettings({...settings, selectedSound: sound.id})}
                            style={{
                              width: '100%',
                              padding: 'var(--space-md)',
                              paddingRight: '3rem',
                              background: settings.selectedSound === sound.id ? 'var(--color-primary)' : 'white',
                              color: settings.selectedSound === sound.id ? 'white' : '#1F2937',
                              border: '2px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <strong>{sound.name}</strong>
                            <div style={{fontSize: '0.875rem', opacity: 0.8}}>{sound.description}</div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              previewSound(sound.id);
                            }}
                            title="Preview sound"
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              padding: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: settings.selectedSound === sound.id ? 'white' : 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Play size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Moderate Sounds */}
                  <div>
                    <h4 style={{marginBottom: 'var(--space-sm)', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600}}>🔔 Moderate Sounds</h4>
                    <div style={{display: 'grid', gap: 'var(--space-sm)'}}>
                      {soundOptions.filter(s => s.category === 'Moderate').map(sound => (
                        <div key={sound.id} style={{position: 'relative'}}>
                          <button
                            onClick={() => setSettings({...settings, selectedSound: sound.id})}
                            style={{
                              width: '100%',
                              padding: 'var(--space-md)',
                              paddingRight: '3rem',
                              background: settings.selectedSound === sound.id ? 'var(--color-primary)' : 'white',
                              color: settings.selectedSound === sound.id ? 'white' : '#1F2937',
                              border: '2px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <strong>{sound.name}</strong>
                            <div style={{fontSize: '0.875rem', opacity: 0.8}}>{sound.description}</div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              previewSound(sound.id);
                            }}
                            title="Preview sound"
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              padding: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: settings.selectedSound === sound.id ? 'white' : 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Play size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Urgent Sounds */}
                  <div>
                    <h4 style={{marginBottom: 'var(--space-sm)', color: '#DC2626', fontSize: '0.875rem', fontWeight: 600}}>🚨 Urgent Sounds</h4>
                    <div style={{display: 'grid', gap: 'var(--space-sm)'}}>
                      {soundOptions.filter(s => s.category === 'Urgent').map(sound => (
                        <div key={sound.id} style={{position: 'relative'}}>
                          <button
                            onClick={() => setSettings({...settings, selectedSound: sound.id})}
                            style={{
                              width: '100%',
                              padding: 'var(--space-md)',
                              paddingRight: '3rem',
                              background: settings.selectedSound === sound.id ? '#DC2626' : 'white',
                              color: settings.selectedSound === sound.id ? 'white' : '#1F2937',
                              border: '2px solid #DC2626',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <strong>{sound.name}</strong>
                            <div style={{fontSize: '0.875rem', opacity: 0.8}}>{sound.description}</div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              previewSound(sound.id);
                            }}
                            title="Preview sound"
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              padding: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: settings.selectedSound === sound.id ? 'white' : '#DC2626',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Play size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Options */}
                  <div>
                    <h4 style={{marginBottom: 'var(--space-sm)', color: 'var(--color-textMuted)', fontSize: '0.875rem', fontWeight: 600}}>⚙️ Special Options</h4>
                    <div style={{display: 'grid', gap: 'var(--space-sm)'}}>
                    {soundOptions.filter(s => s.category === 'Special').map(sound => {
                      if (sound.id === 'custom') {
                        return (
                          <div key={sound.id}>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={handleCustomSoundUpload}
                              id="custom-sound-upload"
                              style={{display: 'none'}}
                            />
                            <label
                              htmlFor="custom-sound-upload"
                              style={{
                                display: 'block',
                                padding: 'var(--space-md)',
                                background: settings.selectedSound === sound.id ? 'var(--color-primary)' : 'white',
                                color: settings.selectedSound === sound.id ? 'white' : '#1F2937',
                                border: '2px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'left',
                                cursor: 'pointer'
                              }}
                            >
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <Upload size={16} />
                                <strong>{sound.name}</strong>
                              </div>
                              <div style={{fontSize: '0.875rem', opacity: 0.8}}>
                                {customSoundFile ? `Using: ${customSoundFile.name}` : sound.description}
                              </div>
                            </label>
                          </div>
                        );
                      }
                      return (
                        <div key={sound.id} style={{position: 'relative'}}>
                          <button
                            onClick={() => setSettings({...settings, selectedSound: sound.id})}
                            style={{
                              width: '100%',
                              padding: 'var(--space-md)',
                              paddingRight: '3rem',
                              background: settings.selectedSound === sound.id ? 'var(--color-primary)' : 'white',
                              color: settings.selectedSound === sound.id ? 'white' : '#1F2937',
                              border: '2px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <strong>{sound.name}</strong>
                            <div style={{fontSize: '0.875rem', opacity: 0.8}}>{sound.description}</div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              previewSound(sound.id);
                            }}
                            title="Preview sound"
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              padding: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: settings.selectedSound === sound.id ? 'white' : 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Play size={18} />
                          </button>
                        </div>
                      );
                    })}
                    </div>
                  </div>

                  {settings.selectedSound !== 'none' && (
                    <>
                      <div>
                        <label style={{display: 'block', fontWeight: 600, marginBottom: 'var(--space-sm)'}}>
                          Sound Repeats: {settings.soundRepeat === 0 ? 'Continuous' : `${settings.soundRepeat}x`}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={settings.soundRepeat}
                          onChange={(e) => setSettings({...settings, soundRepeat: Number(e.target.value)})}
                          style={{width: '100%'}}
                        />
                        <small style={{color: 'var(--color-textMuted)'}}>
                          {settings.soundRepeat === 0
                            ? 'Sound plays continuously throughout the alert duration'
                            : `Sound plays ${settings.soundRepeat} time${settings.soundRepeat > 1 ? 's' : ''}, regardless of duration`
                          }
                        </small>
                      </div>

                      <div>
                        <label style={{display: 'block', fontWeight: 600, marginBottom: 'var(--space-sm)'}}>
                          Sound Interval: {(settings.soundInterval / 1000).toFixed(1)}s
                        </label>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="250"
                          value={settings.soundInterval}
                          onChange={(e) => setSettings({...settings, soundInterval: Number(e.target.value)})}
                          style={{width: '100%'}}
                        />
                        <small style={{color: 'var(--color-textMuted)'}}>
                          Time between sound repeats (0.5s - 5s)
                        </small>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div style={{padding: 'var(--space-md)', background: '#DBEAFE', borderRadius: 'var(--radius-md)', color: '#1E3A8A'}}>
              <strong style={{color: '#1E3A8A'}}>💡 Safety Tip:</strong> Defaults are set to safe levels (20% intensity, 30% brightness, 5s duration, 3 beeps). Adjust as needed for your situation.
            </div>
        </div>
      </div>

      {testMode !== 'none' && (
        <div
          className="visual-alert-flash"
          onClick={() => {
            setTestMode('none');
            stopFlashing();
          }}
          style={{
            backgroundColor: getPriorityColor(testMode, settings.brightness / 100),
            cursor: 'pointer',
            animation: (() => {
              // Intensity controls speed: lower = slower (safer), higher = faster
              const baseSpeed = {
                low: 2000,    // 2 seconds for low priority
                medium: 1500, // 1.5 seconds for medium priority
                high: 1000    // 1 second for high priority
              }[testMode];

              // Calculate speed based on intensity (5-100%)
              // At 5% intensity: very slow (baseSpeed * 4)
              // At 50% intensity: normal (baseSpeed)
              // At 100% intensity: fast (baseSpeed * 0.3)
              const intensityMultiplier = 4 - (settings.intensity / 100 * 3.7);
              const animationSpeed = Math.floor(baseSpeed * intensityMultiplier);

              const animationType = {
                low: 'flash-low',
                medium: 'flash-medium',
                high: 'flash-urgent'
              }[testMode];

              return `${animationType} ${animationSpeed}ms infinite`;
            })(),
          }}
        >
          <div className="visual-alert-flash-content" style={{opacity: Math.min(1, settings.brightness / 100 + 0.3)}}>
            <div className="visual-alert-flash-icon">
              {testMode === 'high' ? '🚨' : testMode === 'medium' ? '⚠️' : '📢'}
            </div>
            <h2>ALERT!</h2>
            <p>Visual Alert Active</p>
            <div style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
              fontSize: '1.25rem',
              fontWeight: 600
            }}>
              👆 Tap/Click Anywhere to Stop
            </div>
          </div>
        </div>
      )}

      <div className="visual-alert-tests">
        <h3>Test Alert Levels</h3>
        <div style={{
          padding: 'var(--space-md)',
          background: '#F3F4F6',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-md)',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          <strong>Current Settings:</strong> {settings.intensity}% intensity, {settings.brightness}% brightness, {settings.duration >= 60000 ? 'continuous' : `${(settings.duration / 1000).toFixed(0)}s`} duration
          {settings.soundEnabled && settings.selectedSound !== 'none' && (
            <>, {soundOptions.find(s => s.id === settings.selectedSound)?.name} sound {settings.soundRepeat === 0 ? 'continuous' : `${settings.soundRepeat}x`} @ {(settings.soundInterval / 1000).toFixed(1)}s intervals</>
          )}
        </div>
        <div className="visual-alert-test-buttons">
          <button
            onClick={() => testAlert('low')}
            className="visual-alert-test-button low"
            disabled={testMode !== 'none'}
          >
            <div className="test-icon">📢</div>
            <h4>Low Priority</h4>
            <p>Gentle flash + single vibration</p>
            <small>General notifications</small>
          </button>

          <button
            onClick={() => testAlert('medium')}
            className="visual-alert-test-button medium"
            disabled={testMode !== 'none'}
          >
            <div className="test-icon">⚠️</div>
            <h4>Medium Priority</h4>
            <p>Medium flash + double vibration</p>
            <small>Important updates</small>
          </button>

          <button
            onClick={() => testAlert('high')}
            className="visual-alert-test-button high"
            disabled={testMode !== 'none'}
          >
            <div className="test-icon">🚨</div>
            <h4>High Priority</h4>
            <p>Rapid flash + strong vibration</p>
            <small>Urgent attention needed</small>
          </button>
        </div>
      </div>

      <div className="visual-alert-history">
        <div className="visual-alert-history-header">
          <h3>
            <Clock size={20} />
            Recent Alerts ({alerts.length})
          </h3>
          {alerts.length > 0 && (
            <button onClick={() => setAlerts([])} className="btn btn-secondary btn-small">
              Clear All
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="visual-alert-empty">
            <Bell size={48} />
            <p>No alerts yet</p>
            <small>Test the system above to see how alerts work</small>
          </div>
        ) : (
          <div className="visual-alert-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="visual-alert-item"
                style={{ borderLeftColor: getPriorityColor(alert.priority, 1) }}
              >
                <div className="visual-alert-item-icon">
                  {alert.priority === 'high' ? '🚨' : alert.priority === 'medium' ? '⚠️' : '📢'}
                </div>
                <div className="visual-alert-item-content">
                  <div className="visual-alert-item-header">
                    <h4>{alert.title}</h4>
                    <span className="visual-alert-item-time">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tool-info">
        <h3>How It Works:</h3>
        <ul>
          <li><strong>Visual Feedback:</strong> Customizable screen flashes with color-coded priority</li>
          <li><strong>Haptic Feedback:</strong> Adjustable vibration patterns</li>
          <li><strong>Audio Options:</strong> Optional sound alerts with multiple tones</li>
          <li><strong>Safety Controls:</strong> Adjustable intensity, brightness, and duration</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Deaf Scouts:</strong> Visual alternative to audio alerts</li>
          <li><strong>Hard of Hearing:</strong> Backup to audio notifications</li>
          <li><strong>Noisy Environments:</strong> Works when audio can't be heard</li>
        </ul>
      </div>
    </div>
  );
}
