// Synthesized alert sounds using Web Audio API
// No external dependencies - all sounds generated in real-time
// NOTE: These are placeholder synthesized sounds. Better quality audio samples will be added in a future update.

export interface SoundOption {
  id: string;
  name: string;
  description: string;
  synthesize: (ctx: AudioContext, volume?: number) => void;
  category: 'gentle' | 'moderate' | 'urgent';
}

export const alertSounds: SoundOption[] = [
  // Gentle sounds
  {
    id: 'soft-bell',
    name: 'Soft Bell',
    description: 'Gentle single bell chime',
    synthesize: (ctx, vol = 0.3) => playBell(ctx, 800, vol, 0.5),
    category: 'gentle',
  },
  {
    id: 'notification-ding',
    name: 'Notification Ding',
    description: 'Pleasant notification sound',
    synthesize: (ctx, vol = 0.3) => playDing(ctx, 1200, vol),
    category: 'gentle',
  },
  {
    id: 'glass-chime',
    name: 'Glass Chime',
    description: 'Delicate glass-like chime',
    synthesize: (ctx, vol = 0.2) => playChime(ctx, 1500, vol),
    category: 'gentle',
  },
  {
    id: 'soft-ping',
    name: 'Soft Ping',
    description: 'Subtle ping notification',
    synthesize: (ctx, vol = 0.25) => playPing(ctx, 1000, vol),
    category: 'gentle',
  },
  {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    description: 'Playful bubble pop sound',
    synthesize: (ctx, vol = 0.25) => playBubble(ctx, vol),
    category: 'gentle',
  },

  // Moderate sounds
  {
    id: 'marimba',
    name: 'Marimba',
    description: 'Warm marimba tone',
    synthesize: (ctx, vol = 0.3) => playMarimba(ctx, vol),
    category: 'moderate',
  },
  {
    id: 'two-tone',
    name: 'Two Tone Beep',
    description: 'Classic two-tone alert',
    synthesize: (ctx, vol = 0.3) => playTwoTone(ctx, vol),
    category: 'moderate',
  },
  {
    id: 'positive-chime',
    name: 'Positive Chime',
    description: 'Uplifting notification chime',
    synthesize: (ctx, vol = 0.3) => playPositiveChime(ctx, vol),
    category: 'moderate',
  },
  {
    id: 'bell-ring',
    name: 'Bell Ring',
    description: 'Clear bell ring',
    synthesize: (ctx, vol = 0.35) => playBellRing(ctx, vol),
    category: 'moderate',
  },
  {
    id: 'digital-beep',
    name: 'Digital Beep',
    description: 'Modern digital alert',
    synthesize: (ctx, vol = 0.3) => playDigitalBeep(ctx, vol),
    category: 'moderate',
  },

  // Urgent sounds
  {
    id: 'alarm-beep',
    name: 'Alarm Beep',
    description: 'Urgent alarm beep',
    synthesize: (ctx, vol = 0.4) => playAlarmBeep(ctx, vol),
    category: 'urgent',
  },
  {
    id: 'alert-warning',
    name: 'Warning Alert',
    description: 'Attention-grabbing alert',
    synthesize: (ctx, vol = 0.4) => playWarning(ctx, vol),
    category: 'urgent',
  },
  {
    id: 'emergency-beep',
    name: 'Emergency Beep',
    description: 'Emergency alert beep',
    synthesize: (ctx, vol = 0.45) => playEmergency(ctx, vol),
    category: 'urgent',
  },
  {
    id: 'triple-beep',
    name: 'Triple Beep',
    description: 'Three urgent beeps',
    synthesize: (ctx, vol = 0.4) => playTripleBeep(ctx, vol),
    category: 'urgent',
  },
  {
    id: 'attention-tone',
    name: 'Attention Tone',
    description: 'Loud attention signal',
    synthesize: (ctx, vol = 0.45) => playAttention(ctx, vol),
    category: 'urgent',
  },
];

// Sound synthesis functions
function playBell(ctx: AudioContext, freq: number, volume: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = freq;
  osc.type = 'sine';

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playDing(ctx: AudioContext, freq: number, volume: number) {
  playBell(ctx, freq, volume, 0.3);
}

function playChime(ctx: AudioContext, freq: number, volume: number) {
  playBell(ctx, freq, volume, 0.6);
  setTimeout(() => playBell(ctx, freq * 1.5, volume * 0.7, 0.4), 100);
}

function playPing(ctx: AudioContext, freq: number, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = freq;
  osc.type = 'triangle';

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

function playBubble(ctx: AudioContext, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
  osc.type = 'sine';

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

function playMarimba(ctx: AudioContext, volume: number) {
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = 'triangle';

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }, i * 100);
  });
}

function playTwoTone(ctx: AudioContext, volume: number) {
  playBell(ctx, 800, volume, 0.2);
  setTimeout(() => playBell(ctx, 600, volume, 0.2), 200);
}

function playPositiveChime(ctx: AudioContext, volume: number) {
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    setTimeout(() => playBell(ctx, freq, volume * 0.8, 0.2), i * 80);
  });
}

function playBellRing(ctx: AudioContext, volume: number) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => playBell(ctx, 900, volume * 0.9, 0.15), i * 150);
  }
}

function playDigitalBeep(ctx: AudioContext, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 1000;
  osc.type = 'square';

  gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

function playAlarmBeep(ctx: AudioContext, volume: number) {
  for (let i = 0; i < 2; i++) {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 800;
      osc.type = 'square';

      gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }, i * 200);
  }
}

function playWarning(ctx: AudioContext, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.3);
  osc.type = 'sawtooth';

  gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.3);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

function playEmergency(ctx: AudioContext, volume: number) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 900;
      osc.type = 'square';

      gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }, i * 150);
  }
}

function playTripleBeep(ctx: AudioContext, volume: number) {
  [0, 200, 400].forEach(delay => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 1000;
      osc.type = 'sine';

      gain.gain.setValueAtTime(volume * 0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }, delay);
  });
}

function playAttention(ctx: AudioContext, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
  osc.type = 'sawtooth';

  gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.5);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}
