import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, Download, Trash2, Play, Pause, Heart } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

interface MusicPack {
  id: string;
  name: string;
  description: string;
  category: string;
  track_count: number;
  file_size_mb: number;
  is_free: boolean;
  is_downloaded?: boolean;
}

interface MusicTrack {
  id: string;
  pack_id: string;
  title: string;
  artist: string;
  duration_seconds: number;
  file_url: string;
  is_favorite?: boolean;
}

export default function MusicLibraryScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [packs, setPacks] = useState<MusicPack[]>([]);
  const [downloadedPacks, setDownloadedPacks] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<MusicPack | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    loadPacks();
    loadDownloadedPacks();
    initAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPack) {
      loadTracks(selectedPack.id);
    }
  }, [selectedPack]);

  const initAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    } catch (error) {
      console.error('Audio init error:', error);
    }
  };

  const loadPacks = async () => {
    const { data, error } = await supabase
      .from('music_packs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPacks(data);
      if (data.length > 0 && !selectedPack) {
        setSelectedPack(data[0]);
      }
    }
  };

  const loadDownloadedPacks = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_downloaded_packs')
      .select('pack_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setDownloadedPacks(data.map((item) => item.pack_id));
    }
  };

  const loadTracks = async (packId: string) => {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('pack_id', packId)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setTracks(data);
    }
  };

  const downloadPack = async (packId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('user_downloaded_packs')
      .insert({ user_id: user.id, pack_id: packId });

    if (!error) {
      setDownloadedPacks([...downloadedPacks, packId]);
      Alert.alert('Success', 'Music pack downloaded!');
    }
  };

  const removePack = async (packId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('user_downloaded_packs')
      .delete()
      .eq('user_id', user.id)
      .eq('pack_id', packId);

    if (!error) {
      setDownloadedPacks(downloadedPacks.filter((id) => id !== packId));
      Alert.alert('Success', 'Music pack removed');
    }
  };

  const playTrack = async (track: MusicTrack) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.file_url },
        {
          shouldPlay: true,
          isLooping: false,
          volume: volume,
        }
      );

      setSound(newSound);
      setPlayingTrackId(track.id);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingTrackId(null);
        }
      });
    } catch (error) {
      console.error('Play error:', error);
      Alert.alert('Error', 'Could not play track');
    }
  };

  const stopTrack = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlayingTrackId(null);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      lofi: '#8B5CF6',
      piano: '#3B82F6',
      nature: '#10B981',
      ambient: '#6366F1',
      chill: '#EC4899',
      meditation: '#14B8A6',
    };
    return colors[category] || theme.primary;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      padding: 24,
      paddingTop: 60,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'xxlarge'),
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: 'rgba(255, 255, 255, 0.9)',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginHorizontal: 16,
      marginBottom: 12,
    },
    packsScroll: {
      paddingHorizontal: 16,
    },
    packCard: {
      width: 160,
      marginRight: 12,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    packCardSelected: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    packIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    packName: {
      fontSize: getFontSize(fontSize, 'medium'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    packInfo: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 8,
    },
    downloadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginTop: 8,
      gap: 4,
    },
    downloadButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
    },
    downloadedBadge: {
      backgroundColor: '#10B981',
    },
    tracksList: {
      paddingHorizontal: 16,
    },
    trackCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    trackPlaying: {
      backgroundColor: `${theme.primary}10`,
      borderWidth: 1,
      borderColor: theme.primary,
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
    trackInfo: {
      flex: 1,
    },
    trackTitle: {
      fontSize: getFontSize(fontSize, 'medium'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    trackArtist: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    volumeContainer: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
    },
    volumeLabel: {
      fontSize: getFontSize(fontSize, 'medium'),
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Music Library</Text>
        <Text style={styles.headerSubtitle}>
          Relax with curated music packs
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Music Packs</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.packsScroll}
          >
            {packs.map((pack) => {
              const isDownloaded = downloadedPacks.includes(pack.id);
              return (
                <TouchableOpacity
                  key={pack.id}
                  style={[
                    styles.packCard,
                    selectedPack?.id === pack.id && styles.packCardSelected,
                  ]}
                  onPress={() => setSelectedPack(pack)}
                >
                  <View
                    style={[
                      styles.packIcon,
                      { backgroundColor: getCategoryColor(pack.category) },
                    ]}
                  >
                    <Music size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.packName}>{pack.name}</Text>
                  <Text style={styles.packInfo}>
                    {pack.track_count} tracks • {pack.file_size_mb}MB
                  </Text>
                  <Text style={styles.packInfo}>{pack.category}</Text>

                  {!isDownloaded ? (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => downloadPack(pack.id)}
                    >
                      <Download size={14} color="#FFFFFF" />
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <TouchableOpacity
                        style={[styles.downloadButton, styles.downloadedBadge]}
                      >
                        <Text style={styles.downloadButtonText}>Downloaded</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.downloadButton, { backgroundColor: '#DC2626', marginTop: 4 }]}
                        onPress={() => removePack(pack.id)}
                      >
                        <Trash2 size={14} color="#FFFFFF" />
                        <Text style={styles.downloadButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {selectedPack && downloadedPacks.includes(selectedPack.id) && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tracks</Text>
              <View style={styles.tracksList}>
                {tracks.map((track) => (
                  <TouchableOpacity
                    key={track.id}
                    style={[
                      styles.trackCard,
                      playingTrackId === track.id && styles.trackPlaying,
                    ]}
                    onPress={() =>
                      playingTrackId === track.id
                        ? stopTrack()
                        : playTrack(track)
                    }
                  >
                    <View style={styles.playButton}>
                      {playingTrackId === track.id ? (
                        <Pause size={20} color="#FFFFFF" />
                      ) : (
                        <Play size={20} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackTitle}>{track.title}</Text>
                      <Text style={styles.trackArtist}>
                        {track.artist} • {Math.floor(track.duration_seconds / 60)}:
                        {String(track.duration_seconds % 60).padStart(2, '0')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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
          </>
        )}
      </ScrollView>
    </View>
  );
}
