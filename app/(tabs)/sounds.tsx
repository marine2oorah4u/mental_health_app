import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  CloudRain,
  Waves,
  Wind,
  Music,
  Bird,
  Flame,
  Coffee,
  Timer,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SOUNDS = [
  {
    id: '1',
    name: 'Rain',
    icon: CloudRain,
    color: '#60A5FA',
    description: 'Gentle rain sounds',
    duration: '∞',
  },
  {
    id: '2',
    name: 'Ocean Waves',
    icon: Waves,
    color: '#3B82F6',
    description: 'Peaceful ocean waves',
    duration: '∞',
  },
  {
    id: '3',
    name: 'Forest',
    icon: Wind,
    color: '#10B981',
    description: 'Tranquil forest ambiance',
    duration: '∞',
  },
  {
    id: '4',
    name: 'Piano',
    icon: Music,
    color: '#8B5CF6',
    description: 'Soft piano meditation',
    duration: '∞',
  },
  {
    id: '5',
    name: 'Birds',
    icon: Bird,
    color: '#F59E0B',
    description: 'Morning bird songs',
    duration: '∞',
  },
  {
    id: '6',
    name: 'Fireplace',
    icon: Flame,
    color: '#EF4444',
    description: 'Crackling fireplace',
    duration: '∞',
  },
  {
    id: '7',
    name: 'Coffee Shop',
    icon: Coffee,
    color: '#78350F',
    description: 'Cozy café atmosphere',
    duration: '∞',
  },
  {
    id: '8',
    name: 'White Noise',
    icon: Volume2,
    color: '#6B7280',
    description: 'Pure white noise',
    duration: '∞',
  },
];

const TIMERS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '60 min', value: 60 },
  { label: '∞', value: null },
];

export default function SoundsScreen() {
  const { theme, fontSize } = useTheme();
  const router = useRouter();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.7);

  const toggleSound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
    } else {
      setPlayingSound(soundId);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'small'),
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    timerRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 24,
    },
    timerButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 12,
      backgroundColor: theme.surface,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    timerButtonActive: {
      backgroundColor: `${theme.primary}20`,
      borderColor: theme.primary,
    },
    timerText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      fontWeight: '500',
    },
    timerTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    soundsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    soundCard: {
      width: (width - 52) / 2,
      margin: 6,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    soundCardPlaying: {
      borderWidth: 2,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      opacity: 0.9,
    },
    soundName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    soundDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    playButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    noteCard: {
      backgroundColor: `${theme.primary}15`,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    noteText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Calming Sounds</Text>
          <Text style={styles.headerSubtitle}>
            {playingSound ? 'Playing' : 'Choose a sound to relax'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volume</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}>
            <Volume2 size={20} color={theme.primary} />
            <Slider
              style={{ flex: 1, marginHorizontal: 16, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolume}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.border}
              thumbTintColor={theme.primary}
            />
            <Text style={{ color: theme.text, fontWeight: '600', minWidth: 40 }}>
              {Math.round(volume * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer</Text>
          <View style={styles.timerRow}>
            {TIMERS.map((timer) => (
              <TouchableOpacity
                key={timer.label}
                style={[
                  styles.timerButton,
                  selectedTimer === timer.value && styles.timerButtonActive,
                ]}
                onPress={() => setSelectedTimer(timer.value)}
              >
                <Timer size={16} color={selectedTimer === timer.value ? theme.primary : theme.text} />
                <Text
                  style={[
                    styles.timerText,
                    selectedTimer === timer.value && styles.timerTextActive,
                  ]}
                >
                  {timer.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sounds</Text>
          <View style={styles.soundsGrid}>
            {SOUNDS.map((sound) => {
              const Icon = sound.icon;
              const isPlaying = playingSound === sound.id;

              return (
                <TouchableOpacity
                  key={sound.id}
                  style={[
                    styles.soundCard,
                    isPlaying && { borderColor: sound.color, ...styles.soundCardPlaying },
                  ]}
                  onPress={() => toggleSound(sound.id)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${sound.color}20` },
                    ]}
                  >
                    <Icon size={40} color={sound.color} />
                  </View>
                  <Text style={styles.soundName}>{sound.name}</Text>
                  <Text style={styles.soundDescription}>{sound.description}</Text>
                  <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: sound.color }]}
                    onPress={() => toggleSound(sound.id)}
                  >
                    {isPlaying ? (
                      <Pause size={24} color="#FFFFFF" />
                    ) : (
                      <Play size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 Tip: Use calming sounds while meditating, journaling, or before sleep to enhance
            relaxation and reduce stress. Combine with breathing exercises for maximum effect.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
