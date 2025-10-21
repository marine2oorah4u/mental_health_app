import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { Volume2, VolumeX, Play, Pause, X } from 'lucide-react-native';
import { soundManager, SoundTrack } from '@/lib/soundManager';
import Slider from '@react-native-community/slider';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AmbientSoundPlayerProps {
  environment?: string;
  initialVolume?: number;
  autoPlay?: boolean;
}

export default function AmbientSoundPlayer({
  environment = 'cozy',
  initialVolume = 0.3,
  autoPlay = false,
}: AmbientSoundPlayerProps) {
  const { theme, fontSize } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [showSelector, setShowSelector] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [availableSounds, setAvailableSounds] = useState<SoundTrack[]>([]);

  useEffect(() => {
    soundManager.initialize();
    const sounds = soundManager.getSoundsForEnvironment(environment);
    setAvailableSounds(sounds);

    if (autoPlay && sounds.length > 0) {
      playSound(sounds[0]);
    }

    return () => {
      soundManager.stopSound();
    };
  }, [environment]);

  const playSound = async (track: SoundTrack) => {
    await soundManager.playSound(track.id, { volume, loop: true });
    setCurrentTrack(track);
    setIsPlaying(true);
    soundManager.fadeIn(1500);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      await soundManager.pauseSound();
      setIsPlaying(false);
    } else {
      if (currentTrack) {
        await soundManager.resumeSound();
        setIsPlaying(true);
      } else if (availableSounds.length > 0) {
        await playSound(availableSounds[0]);
      }
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    await soundManager.setVolume(value);
  };

  const handleSoundSelect = async (track: SoundTrack) => {
    await playSound(track);
    setShowSelector(false);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    playButtonPaused: {
      backgroundColor: theme.border,
    },
    trackInfo: {
      flex: 1,
      marginRight: 12,
    },
    trackName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    trackDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    volumeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    changeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: `${theme.primary}20`,
    },
    changeButtonText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.primary,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundOption: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    soundOptionActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    soundOptionName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    soundOptionDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: `${theme.accent}20`,
      marginTop: 8,
    },
    categoryText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.accent,
      fontWeight: '600',
    },
    volumeContainer: {
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    volumeLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    volumeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    volumeValue: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 12,
      minWidth: 35,
    },
  });

  if (availableSounds.length === 0) {
    return null;
  }

  return (
    <>
      <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
        <TouchableOpacity
          style={[styles.playButton, !isPlaying && styles.playButtonPaused]}
          onPress={togglePlay}
        >
          {isPlaying ? (
            <Pause size={20} color="#FFFFFF" />
          ) : (
            <Play size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>
            {currentTrack ? currentTrack.name : 'Select Sound'}
          </Text>
          <Text style={styles.trackDescription}>
            {currentTrack
              ? currentTrack.description
              : `${availableSounds.length} sounds available`}
          </Text>
        </View>

        <TouchableOpacity style={styles.volumeButton} onPress={() => setShowSelector(true)}>
          {volume > 0 ? (
            <Volume2 size={18} color={theme.primary} />
          ) : (
            <VolumeX size={18} color={theme.textSecondary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.changeButton} onPress={() => setShowSelector(true)}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={showSelector} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ambient Sounds</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSelector(false)}
              >
                <X size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            {availableSounds.map((track) => (
              <TouchableOpacity
                key={track.id}
                style={[
                  styles.soundOption,
                  currentTrack?.id === track.id && styles.soundOptionActive,
                ]}
                onPress={() => handleSoundSelect(track)}
              >
                <Text style={styles.soundOptionName}>{track.name}</Text>
                <Text style={styles.soundOptionDescription}>{track.description}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{track.category}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.volumeContainer}>
              <Text style={styles.volumeLabel}>Volume</Text>
              <View style={styles.volumeRow}>
                <Slider
                  style={{ flex: 1 }}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.05}
                  minimumTrackTintColor={theme.primary}
                  maximumTrackTintColor={theme.border}
                  thumbTintColor={theme.primary}
                />
                <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
