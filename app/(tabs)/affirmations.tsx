import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Heart,
  RefreshCw,
  Bookmark,
  Share2,
  Filter,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');

interface Affirmation {
  id: string;
  text: string;
  category: string;
  is_favorite?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  self_love: '#EC4899',
  strength: '#8B5CF6',
  peace: '#06B6D4',
  gratitude: '#F59E0B',
  motivation: '#10B981',
  healing: '#6366F1',
};

const CATEGORY_LABELS: Record<string, string> = {
  self_love: 'Self Love',
  strength: 'Strength',
  peace: 'Peace',
  gratitude: 'Gratitude',
  motivation: 'Motivation',
  healing: 'Healing',
};

export default function AffirmationsScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [allAffirmations, setAllAffirmations] = useState<Affirmation[]>([]);

  useEffect(() => {
    loadAffirmations();
    if (user) {
      loadFavorites();
    }
  }, [user, selectedCategory, showFavorites]);

  const loadAffirmations = async () => {
    let query = supabase
      .from('affirmations')
      .select('*')
      .eq('is_active', true);

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (data && data.length > 0) {
      if (showFavorites && user) {
        // Filter to only show favorites
        const { data: userAffData } = await supabase
          .from('user_affirmations')
          .select('affirmation_id')
          .eq('user_id', user.id)
          .eq('is_favorite', true);

        const favoriteIds = new Set(userAffData?.map((ua) => ua.affirmation_id) || []);
        const favAffirmations = data.filter((aff) => favoriteIds.has(aff.id));

        if (favAffirmations.length > 0) {
          setAllAffirmations(favAffirmations);
          setCurrentAffirmation(
            favAffirmations[Math.floor(Math.random() * favAffirmations.length)]
          );
        } else {
          setAllAffirmations([]);
          setCurrentAffirmation(null);
        }
      } else {
        setAllAffirmations(data);
        setCurrentAffirmation(data[Math.floor(Math.random() * data.length)]);
      }
    }
  };

  const loadFavorites = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_affirmations')
      .select('affirmation_id')
      .eq('user_id', user.id)
      .eq('is_favorite', true);

    if (data) {
      setFavorites(data.map((ua) => ua.affirmation_id));
    }
  };

  const getNextAffirmation = () => {
    if (allAffirmations.length === 0) return;

    const availableAffirmations = allAffirmations.filter(
      (aff) => aff.id !== currentAffirmation?.id
    );

    if (availableAffirmations.length > 0) {
      const next =
        availableAffirmations[Math.floor(Math.random() * availableAffirmations.length)];
      setCurrentAffirmation(next);
      trackAffirmationView(next.id);
    }
  };

  const trackAffirmationView = async (affirmationId: string) => {
    if (!user?.id) return;

    const { data: existing } = await supabase
      .from('user_affirmations')
      .select('*')
      .eq('user_id', user.id)
      .eq('affirmation_id', affirmationId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_affirmations')
        .update({
          last_seen_at: new Date().toISOString(),
          seen_count: existing.seen_count + 1,
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('user_affirmations').insert({
        user_id: user.id,
        affirmation_id: affirmationId,
        seen_count: 1,
      });
    }
  };

  const toggleFavorite = async () => {
    if (!user?.id || !currentAffirmation) return;

    const isFavorite = favorites.includes(currentAffirmation.id);

    const { data: existing } = await supabase
      .from('user_affirmations')
      .select('*')
      .eq('user_id', user.id)
      .eq('affirmation_id', currentAffirmation.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_affirmations')
        .update({ is_favorite: !isFavorite })
        .eq('id', existing.id);
    } else {
      await supabase.from('user_affirmations').insert({
        user_id: user.id,
        affirmation_id: currentAffirmation.id,
        is_favorite: true,
      });
    }

    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== currentAffirmation.id));
    } else {
      setFavorites([...favorites, currentAffirmation.id]);
    }
  };

  const categoryColor = currentAffirmation
    ? CATEGORY_COLORS[currentAffirmation.category]
    : theme.primary;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.95,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    affirmationCard: {
      width: width - 48,
      minHeight: 300,
      borderRadius: 24,
      padding: 32,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    affirmationText: {
      fontSize: getFontSize(fontSize, 'xlarge'),
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: getFontSize(fontSize, 'xlarge') * 1.5,
      marginBottom: 24,
    },
    categoryBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    categoryText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: '#FFFFFF',
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      marginTop: 32,
    },
    actionButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    favoriteButton: {
      backgroundColor: '#EC4899',
    },
    nextButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.primary,
    },
    filterSection: {
      padding: 20,
    },
    filterTitle: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    categoryScroll: {
      marginBottom: 12,
    },
    categoryButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: theme.surface,
    },
    categoryButtonActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}15`,
    },
    categoryButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    toggleButtonActive: {
      backgroundColor: `${theme.primary}15`,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    toggleText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 16,
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Sparkles size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Daily Affirmations</Text>
            <Text style={styles.headerSubtitle}>Positive reminders for your mind</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          <TouchableOpacity
            style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryButtonText}>All</Text>
          </TouchableOpacity>
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={styles.categoryButtonText}>{CATEGORY_LABELS[cat]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {user && (
          <TouchableOpacity
            style={[styles.toggleButton, showFavorites && styles.toggleButtonActive]}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <Heart
              size={20}
              color={showFavorites ? theme.primary : theme.textSecondary}
              fill={showFavorites ? theme.primary : 'none'}
            />
            <Text style={styles.toggleText}>Show Favorites Only</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {currentAffirmation ? (
          <>
            <LinearGradient
              colors={[categoryColor, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.affirmationCard}
            >
              <Text style={styles.affirmationText}>{currentAffirmation.text}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {CATEGORY_LABELS[currentAffirmation.category]}
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.actionsRow}>
              {user && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    favorites.includes(currentAffirmation.id) && styles.favoriteButton,
                  ]}
                  onPress={toggleFavorite}
                >
                  <Heart
                    size={24}
                    color="#FFFFFF"
                    fill={favorites.includes(currentAffirmation.id) ? '#FFFFFF' : 'none'}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.actionButton, styles.nextButton]} onPress={getNextAffirmation}>
                <RefreshCw size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Heart size={64} color={theme.textSecondary} />
            <Text style={styles.emptyText}>
              {showFavorites
                ? 'No favorite affirmations yet.\nTap the heart on affirmations you love!'
                : 'No affirmations available.\nCheck back soon!'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
