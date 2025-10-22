import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface SoundTrack {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'ambient' | 'white-noise' | 'music';
  url?: string;
  localFile?: any;
  environments: string[];
}

export const SOUND_LIBRARY: SoundTrack[] = [
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Gentle waves on the beach',
    category: 'nature',
    environments: ['beach', 'cozy'],
    url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112e3cc.mp3',
  },
  {
    id: 'rain-gentle',
    name: 'Gentle Rain',
    description: 'Soft rainfall sounds',
    category: 'nature',
    environments: ['cozy', 'garden', 'forest'],
    url: 'https://cdn.pixabay.com/audio/2022/03/12/audio_4e30e1d03c.mp3',
  },
  {
    id: 'forest-birds',
    name: 'Forest Birds',
    description: 'Morning birds chirping',
    category: 'nature',
    environments: ['garden', 'forest', 'mountain'],
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c2bc788154.mp3',
  },
  {
    id: 'wind-gentle',
    name: 'Gentle Wind',
    description: 'Soft breeze through trees',
    category: 'nature',
    environments: ['garden', 'mountain', 'forest'],
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_a969d71836.mp3',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Crackling fire',
    category: 'ambient',
    environments: ['cozy', 'mountain'],
    url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_0625c1539c.mp3',
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    description: 'Cozy cafe atmosphere',
    category: 'ambient',
    environments: ['city', 'office', 'cozy'],
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_14d098d97c.mp3',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    description: 'Steady static sound',
    category: 'white-noise',
    environments: ['office', 'city', 'cozy'],
    url: 'https://cdn.pixabay.com/audio/2023/10/30/audio_c41c89137f.mp3',
  },
  {
    id: 'space-ambient',
    name: 'Space Ambient',
    description: 'Cosmic atmosphere',
    category: 'ambient',
    environments: ['space'],
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_ccef0a5743.mp3',
  },
  {
    id: 'calm-music',
    name: 'Calm Piano',
    description: 'Peaceful piano melody',
    category: 'music',
    environments: ['cozy', 'office', 'mountain'],
    url: 'https://cdn.pixabay.com/audio/2023/12/25/audio_13ecc2c5cc.mp3',
  },
  {
    id: 'meditation-bowl',
    name: 'Meditation Bowl',
    description: 'Singing bowl resonance',
    category: 'ambient',
    environments: ['garden', 'mountain', 'space'],
    url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_d6e5132bde.mp3',
  },
];

class SoundManager {
  private currentSound: Audio.Sound | null = null;
  private currentTrackId: string | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  async initialize() {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      }
    } catch (error) {
      console.error('Audio initialization error:', error);
    }
  }

  async playSound(trackId: string, options: { volume?: number; loop?: boolean } = {}) {
    try {
      const track = SOUND_LIBRARY.find((t) => t.id === trackId);
      if (!track) {
        console.error('Track not found:', trackId);
        return;
      }

      await this.stopSound();

      this.volume = options.volume !== undefined ? options.volume : 0.5;

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url! },
        {
          shouldPlay: true,
          isLooping: options.loop !== false,
          volume: this.volume,
        }
      );

      this.currentSound = sound;
      this.currentTrackId = trackId;
      this.isPlaying = true;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish && !status.isLooping) {
          this.isPlaying = false;
          this.currentTrackId = null;
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      this.isPlaying = false;
      this.currentTrackId = null;
    }
  }

  async stopSound() {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
      this.currentSound = null;
      this.currentTrackId = null;
      this.isPlaying = false;
    }
  }

  async pauseSound() {
    if (this.currentSound && this.isPlaying) {
      try {
        await this.currentSound.pauseAsync();
        this.isPlaying = false;
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  }

  async resumeSound() {
    if (this.currentSound && !this.isPlaying) {
      try {
        await this.currentSound.playAsync();
        this.isPlaying = true;
      } catch (error) {
        console.error('Error resuming sound:', error);
      }
    }
  }

  async setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentSound) {
      try {
        await this.currentSound.setVolumeAsync(this.volume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }

  async fadeIn(duration: number = 2000) {
    if (!this.currentSound) return;

    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = this.volume / steps;

    await this.currentSound.setVolumeAsync(0);

    let currentStep = 0;
    this.fadeInterval = setInterval(async () => {
      currentStep++;
      const newVolume = volumeStep * currentStep;

      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        if (this.currentSound) {
          await this.currentSound.setVolumeAsync(this.volume);
        }
      } else if (this.currentSound) {
        await this.currentSound.setVolumeAsync(newVolume);
      }
    }, stepDuration);
  }

  async fadeOut(duration: number = 2000) {
    if (!this.currentSound) return;

    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = this.volume / steps;

    let currentStep = steps;
    this.fadeInterval = setInterval(async () => {
      currentStep--;
      const newVolume = volumeStep * currentStep;

      if (currentStep <= 0) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        await this.stopSound();
      } else if (this.currentSound) {
        await this.currentSound.setVolumeAsync(newVolume);
      }
    }, stepDuration);
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  getCurrentVolume(): number {
    return this.volume;
  }

  getSoundsForEnvironment(environment: string): SoundTrack[] {
    return SOUND_LIBRARY.filter((track) => track.environments.includes(environment));
  }

  getSoundsByCategory(category: string): SoundTrack[] {
    return SOUND_LIBRARY.filter((track) => track.category === category);
  }

  getAllSounds(): SoundTrack[] {
    return SOUND_LIBRARY;
  }
}

export const soundManager = new SoundManager();
