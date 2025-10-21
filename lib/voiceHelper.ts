import { Platform } from 'react-native';

interface VoiceHelperOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

class VoiceHelper {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isSpeaking: boolean = false;
  private isListening: boolean = false;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    }
  }

  async speak(text: string, options: VoiceHelperOptions = {}): Promise<void> {
    if (Platform.OS !== 'web' || !this.synthesis) {
      console.warn('Speech synthesis not available on this platform');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if (this.isSpeaking) {
        this.synthesis!.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = options.language || 'en-US';
      utterance.pitch = options.pitch || 1.0;
      utterance.rate = options.rate || 0.9;
      utterance.volume = options.volume || 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', error);
        reject(error);
      };

      this.synthesis!.speak(utterance);
    });
  }

  stop(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  async listen(): Promise<string> {
    if (Platform.OS !== 'web' || !this.recognition) {
      console.warn('Speech recognition not available on this platform');
      return Promise.reject(new Error('Speech recognition not available'));
    }

    return new Promise((resolve, reject) => {
      if (this.isListening) {
        this.recognition.stop();
      }

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        this.isListening = false;
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        console.error('Speech recognition error:', event.error);
        reject(new Error(event.error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    if (Platform.OS !== 'web' || !this.synthesis) {
      return [];
    }

    return new Promise((resolve) => {
      let voices = this.synthesis!.getVoices();

      if (voices.length > 0) {
        resolve(voices);
      } else {
        this.synthesis!.onvoiceschanged = () => {
          voices = this.synthesis!.getVoices();
          resolve(voices);
        };
      }
    });
  }

  isAvailable(): boolean {
    return Platform.OS === 'web' && this.synthesis !== null;
  }

  isRecognitionAvailable(): boolean {
    return Platform.OS === 'web' && this.recognition !== null;
  }
}

export const voiceHelper = new VoiceHelper();

export interface VoiceSettings {
  enabled: boolean;
  autoSpeak: boolean;
  voice: string;
  pitch: number;
  rate: number;
  volume: number;
}

export const defaultVoiceSettings: VoiceSettings = {
  enabled: false,
  autoSpeak: false,
  voice: 'default',
  pitch: 1.0,
  rate: 0.9,
  volume: 1.0,
};
