import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Sparkles, Heart, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DailyInspiration {
  id: string;
  content: string;
  author: string;
  category: 'prayer' | 'verse' | 'quote';
}

const INSPIRATIONS: DailyInspiration[] = [
  {
    id: '1',
    content: 'Grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference.',
    author: 'Serenity Prayer',
    category: 'prayer',
  },
  {
    id: '2',
    content: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    author: 'Joshua 1:9',
    category: 'verse',
  },
  {
    id: '3',
    content: 'May I be filled with loving kindness. May I be well. May I be peaceful and at ease. May I be happy.',
    author: 'Buddhist Loving-Kindness Prayer',
    category: 'prayer',
  },
  {
    id: '4',
    content: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
    author: 'John 14:27',
    category: 'verse',
  },
  {
    id: '5',
    content: 'You are not your thoughts. You are the awareness behind your thoughts. When you realize this, a profound peace arises within you.',
    author: 'Mindfulness Teaching',
    category: 'quote',
  },
  {
    id: '6',
    content: 'Cast all your anxiety on Him because He cares for you.',
    author: '1 Peter 5:7',
    category: 'verse',
  },
  {
    id: '7',
    content: 'May today there be peace within. May you trust that you are exactly where you are meant to be. May you not forget the infinite possibilities that are born of faith in yourself and others.',
    author: 'Prayer for Peace',
    category: 'prayer',
  },
  {
    id: '8',
    content: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    author: 'Psalm 34:18',
    category: 'verse',
  },
  {
    id: '9',
    content: 'Be gentle with yourself. You are doing the best you can. Healing is not linear. Rest when you need to. You are worthy of love and care.',
    author: 'Self-Compassion Prayer',
    category: 'prayer',
  },
  {
    id: '10',
    content: 'For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.',
    author: 'Jeremiah 29:11',
    category: 'verse',
  },
];

export default function DailyInspirationScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [currentInspiration, setCurrentInspiration] = useState<DailyInspiration | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDailyInspiration();
    loadFavorites();
  }, []);

  const loadDailyInspiration = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % INSPIRATIONS.length;
    setCurrentInspiration(INSPIRATIONS[index]);
  };

  const loadFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_preferences')
      .select('favorite_inspirations')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.favorite_inspirations) {
      setFavorites(data.favorite_inspirations);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !currentInspiration) return;

    const newFavorites = favorites.includes(currentInspiration.id)
      ? favorites.filter(id => id !== currentInspiration.id)
      : [...favorites, currentInspiration.id];

    setFavorites(newFavorites);

    await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        favorite_inspirations: newFavorites,
      });
  };

  const getNewInspiration = () => {
    setRefreshing(true);
    const randomIndex = Math.floor(Math.random() * INSPIRATIONS.length);
    setCurrentInspiration(INSPIRATIONS[randomIndex]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prayer':
        return '#EC4899';
      case 'verse':
        return theme.primary;
      case 'quote':
        return theme.secondary;
      default:
        return theme.text;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'prayer':
        return 'Prayer';
      case 'verse':
        return 'Scripture';
      case 'quote':
        return 'Wisdom';
      default:
        return '';
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
      paddingBottom: 32,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    inspirationCard: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 32,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 20,
    },
    categoryText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: '#FFFFFF',
    },
    inspirationText: {
      fontSize: getFontSize(fontSize, 'large'),
      lineHeight: getFontSize(fontSize, 'large') * 1.6,
      color: theme.text,
      marginBottom: 20,
      fontStyle: 'italic',
    },
    author: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      fontWeight: '600',
      textAlign: 'right',
    },
    actionRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    actionButton: {
      flex: 1,
      backgroundColor: `${theme.primary}15`,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    favoriteButton: {
      backgroundColor: `${theme.accent}15`,
    },
    actionButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.primary,
    },
    favoriteText: {
      color: theme.accent,
    },
    infoCard: {
      backgroundColor: `${theme.primary}10`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    infoText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      lineHeight: 22,
      textAlign: 'center',
    },
  });

  if (!currentInspiration) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(currentInspiration.id);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Daily Inspiration</Text>
        <Text style={styles.headerSubtitle}>Find peace and strength today</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getNewInspiration} />
        }
      >
        <Animated.View entering={FadeIn.duration(800)}>
          <View style={styles.inspirationCard}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(currentInspiration.category) },
              ]}
            >
              <Text style={styles.categoryText}>
                {getCategoryLabel(currentInspiration.category)}
              </Text>
            </View>

            <Text style={styles.inspirationText}>{currentInspiration.content}</Text>

            <Text style={styles.author}>— {currentInspiration.author}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, isFavorite && styles.favoriteButton]}
                onPress={toggleFavorite}
              >
                <Heart
                  size={20}
                  color={isFavorite ? theme.accent : theme.primary}
                  fill={isFavorite ? theme.accent : 'none'}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    isFavorite && styles.favoriteText,
                  ]}
                >
                  {isFavorite ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={getNewInspiration}
              >
                <RefreshCw size={20} color={theme.primary} />
                <Text style={styles.actionButtonText}>New One</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.infoCard}>
          <Sparkles
            size={24}
            color={theme.primary}
            style={{ alignSelf: 'center', marginBottom: 12 }}
          />
          <Text style={styles.infoText}>
            A new inspiration is waiting for you each day. Pull down to refresh or tap "New One" for more inspiration anytime.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
