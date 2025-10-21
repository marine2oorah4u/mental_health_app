import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Search,
  Filter,
  Heart,
} from 'lucide-react-native';
import { soundManager, SOUND_LIBRARY, SoundTrack } from '@/lib/soundManager';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', label: 'All Sounds', color: '#6366F1' },
  { id: 'nature', label: 'Nature', color: '#10B981' },
  { id: 'ambient', label: 'Ambient', color: '#8B5CF6' },
  { id: 'white-noise', label: 'White Noise', color: '#6B7280' },
  { id: 'music', label: 'Music', color: '#EC4899' },
];

export default function SoundsScreen() {
  const { theme, fontSize } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [filteredSounds, setFilteredSounds] = useState<SoundTrack[]>(SOUND_LIBRARY);

  useEffect(() => {
    soundManager.initialize();

    return () => {
      soundManager.stopSound();
    };
  }, []);

  useEffect(() => {
    let sounds = SOUND_LIBRARY;

    if (selectedCategory !== 'all') {
      sounds = sounds.filter((sound) => sound.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sounds = sounds.filter(
        (sound) =>
          sound.name.toLowerCase().includes(query) ||
          sound.description.toLowerCase().includes(query)
      );
    }

    setFilteredSounds(sounds);
  }, [selectedCategory, searchQuery]);

  const handlePlaySound = async (track: SoundTrack) => {
    if (playingTrackId === track.id) {
      await soundManager.stopSound();
      setPlayingTrackId(null);
    } else {
      await soundManager.playSound(track.id, { volume, loop: true });
      setPlayingTrackId(track.id);
      soundManager.fadeIn(1000);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    await soundManager.setVolume(value);
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || theme.primary;
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
    scrollContent: {
      padding: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginLeft: 12,
    },
    categoriesScroll: {
      marginBottom: 24,
    },
    categoryButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    categoryButtonActive: {
      backgroundColor: `${theme.primary}20`,
    },
    categoryText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.textSecondary,
    },
    categoryTextActive: {
      color: theme.primary,
    },
    volumeSection: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    volumeValue: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '600',
      minWidth: 45,
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
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
      padding: 16,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    soundCardPlaying: {
      backgroundColor: `${theme.primary}10`,
    },
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
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
      marginBottom: 8,
      lineHeight: getFontSize(fontSize, 'small') * 1.3,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 12,
    },
    categoryBadgeText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: '#FFFFFF',
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    playButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
    },
    emptyStateText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    infoBox: {
      backgroundColor: `${theme.primary}15`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    infoText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      lineHeight: getFontSize(fontSize, 'small') * 1.5,
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
          <Text style={styles.headerTitle}>Ambient Sounds</Text>
          <Text style={styles.headerSubtitle}>
            {playingTrackId
              ? `Playing • ${filteredSounds.length} sounds`
              : `${filteredSounds.length} sounds available`}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Browse and preview ambient sounds. Enable them in Environment Settings to play
            during companion chat sessions.
          </Text>
        </View>

        <View style={styles.volumeSection}>
          <Volume2 size={20} color={theme.primary} style={{ marginRight: 12 }} />
          <Slider
            style={{ flex: 1, marginHorizontal: 12, height: 40 }}
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

        <View style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sounds..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
                selectedCategory === category.id && { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                  selectedCategory === category.id && { color: category.color },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all'
            ? 'All Sounds'
            : categories.find((c) => c.id === selectedCategory)?.label}
        </Text>

        {filteredSounds.length === 0 ? (
          <View style={styles.emptyState}>
            <Filter size={48} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>
              No sounds found.{'\n'}Try a different search or category.
            </Text>
          </View>
        ) : (
          <View style={styles.soundsGrid}>
            {filteredSounds.map((sound) => {
              const isPlaying = playingTrackId === sound.id;
              const soundColor = getCategoryColor(sound.category);

              return (
                <TouchableOpacity
                  key={sound.id}
                  style={[
                    styles.soundCard,
                    isPlaying && {
                      borderColor: soundColor,
                      ...styles.soundCardPlaying,
                    },
                  ]}
                  onPress={() => handlePlaySound(sound)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${soundColor}20` },
                    ]}
                  >
                    <Heart
                      size={32}
                      color={soundColor}
                      fill={isPlaying ? soundColor : 'transparent'}
                    />
                  </View>
                  <Text style={styles.soundName}>{sound.name}</Text>
                  <Text style={styles.soundDescription}>{sound.description}</Text>
                  <View
                    style={[styles.categoryBadge, { backgroundColor: soundColor }]}
                  >
                    <Text style={styles.categoryBadgeText}>{sound.category}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: soundColor }]}
                    onPress={() => handlePlaySound(sound)}
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
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
