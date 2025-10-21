import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Package, Sparkles, Trash2 } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import AnimalCompanion from '@/components/AnimalCompanion';

interface Decoration {
  id: string;
  name: string;
  emoji: string;
  category: string;
  size: number;
  rarity: string;
}

interface PlacedDecoration {
  id: string;
  decoration_id: string;
  position_x: number;
  position_y: number;
  emoji: string;
  name: string;
  size: number;
}

const GRID_SIZE = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = (SCREEN_WIDTH - 64) / GRID_SIZE;

export default function CompanionRoomScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [unlockedDecorations, setUnlockedDecorations] = useState<Decoration[]>([]);
  const [placedDecorations, setPlacedDecorations] = useState<PlacedDecoration[]>([]);
  const [selectedDecoration, setSelectedDecoration] = useState<Decoration | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [companionAppearance, setCompanionAppearance] = useState<any>(null);

  useEffect(() => {
    loadUnlockedDecorations();
    loadRoomLayout();
    loadCompanionAppearance();
  }, []);

  const loadCompanionAppearance = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('companion_appearance')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setCompanionAppearance(data);
    }
  };

  const loadUnlockedDecorations = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_unlocked_decorations')
      .select(`
        decoration_id,
        decoration_catalog (
          id,
          name,
          emoji,
          category,
          size,
          rarity
        )
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      const decorations = data
        .map((item: any) => ({
          id: item.decoration_catalog.id,
          name: item.decoration_catalog.name,
          emoji: item.decoration_catalog.emoji,
          category: item.decoration_catalog.category,
          size: item.decoration_catalog.size,
          rarity: item.decoration_catalog.rarity,
        }))
        .filter((d: Decoration) => d.id);

      setUnlockedDecorations(decorations);
    }
  };

  const loadRoomLayout = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_room_layout')
      .select(`
        id,
        decoration_id,
        position_x,
        position_y,
        decoration_catalog (
          emoji,
          name,
          size
        )
      `)
      .eq('user_id', user.id)
      .eq('is_visible', true);

    if (!error && data) {
      const placed = data.map((item: any) => ({
        id: item.id,
        decoration_id: item.decoration_id,
        position_x: item.position_x,
        position_y: item.position_y,
        emoji: item.decoration_catalog?.emoji || '❓',
        name: item.decoration_catalog?.name || 'Unknown',
        size: item.decoration_catalog?.size || 1,
      }));

      setPlacedDecorations(placed);
    }
  };

  const placeDecoration = async (x: number, y: number) => {
    if (!selectedDecoration || !user?.id) return;

    // Check if space is occupied
    const isOccupied = placedDecorations.some(
      (dec) =>
        x >= dec.position_x &&
        x < dec.position_x + Math.sqrt(dec.size) &&
        y >= dec.position_y &&
        y < dec.position_y + Math.sqrt(dec.size)
    );

    if (isOccupied) {
      alert('This space is occupied!');
      return;
    }

    const { data, error } = await supabase
      .from('user_room_layout')
      .insert({
        user_id: user.id,
        decoration_id: selectedDecoration.id,
        position_x: x,
        position_y: y,
      })
      .select()
      .single();

    if (!error && data) {
      await loadRoomLayout();
      setSelectedDecoration(null);
    }
  };

  const removeDecoration = async (decorationId: string) => {
    const { error} = await supabase
      .from('user_room_layout')
      .delete()
      .eq('id', decorationId);

    if (!error) {
      await loadRoomLayout();
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700';
      case 'rare':
        return '#9333EA';
      case 'common':
      default:
        return theme.textSecondary;
    }
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
    modeToggle: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginVertical: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 4,
    },
    modeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
    },
    modeButtonActive: {
      backgroundColor: theme.primary,
    },
    modeButtonText: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.text,
      fontWeight: '600',
    },
    modeButtonTextActive: {
      color: '#FFFFFF',
    },
    roomContainer: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
    },
    roomTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
    },
    grid: {
      width: GRID_SIZE * CELL_SIZE,
      height: GRID_SIZE * CELL_SIZE,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
    },
    gridRow: {
      flexDirection: 'row',
    },
    gridCell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      borderWidth: 0.5,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridCellActive: {
      backgroundColor: `${theme.primary}20`,
    },
    decoration: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    decorationEmoji: {
      textAlign: 'center',
    },
    deleteButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: '#DC2626',
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    decorationsList: {
      marginHorizontal: 16,
      marginBottom: 100,
    },
    decorationsTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
    },
    decorationsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    decorationCard: {
      width: (SCREEN_WIDTH - 64) / 4,
      aspectRatio: 1,
      backgroundColor: theme.surface,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    decorationCardSelected: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    decorationCardRare: {
      borderColor: '#9333EA',
    },
    decorationCardLegendary: {
      borderColor: '#FFD700',
    },
    companionContainer: {
      position: 'absolute',
      zIndex: 10,
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
        <Text style={styles.headerTitle}>Your Room</Text>
        <Text style={styles.headerSubtitle}>
          Design your companion's space
        </Text>
      </LinearGradient>

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, !editMode && styles.modeButtonActive]}
          onPress={() => setEditMode(false)}
        >
          <Home size={20} color={!editMode ? '#FFFFFF' : theme.text} />
          <Text
            style={[
              styles.modeButtonText,
              !editMode && styles.modeButtonTextActive,
            ]}
          >
            View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, editMode && styles.modeButtonActive]}
          onPress={() => setEditMode(true)}
        >
          <Package size={20} color={editMode ? '#FFFFFF' : theme.text} />
          <Text
            style={[
              styles.modeButtonText,
              editMode && styles.modeButtonTextActive,
            ]}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.roomContainer}>
          <Text style={styles.roomTitle}>
            {editMode ? 'Tap a cell to place' : 'Your Cozy Room'}
          </Text>

          <View style={styles.grid}>
            {/* Grid cells */}
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <View key={y} style={styles.gridRow}>
                {Array.from({ length: GRID_SIZE }).map((_, x) => (
                  <TouchableOpacity
                    key={`${x}-${y}`}
                    style={[
                      styles.gridCell,
                      selectedDecoration && editMode && styles.gridCellActive,
                    ]}
                    onPress={() => editMode && placeDecoration(x, y)}
                    disabled={!editMode || !selectedDecoration}
                  />
                ))}
              </View>
            ))}

            {/* Placed decorations */}
            {placedDecorations.map((dec) => (
              <View
                key={dec.id}
                style={[
                  styles.decoration,
                  {
                    left: dec.position_x * CELL_SIZE,
                    top: dec.position_y * CELL_SIZE,
                    width: CELL_SIZE * Math.sqrt(dec.size),
                    height: CELL_SIZE * Math.sqrt(dec.size),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.decorationEmoji,
                    { fontSize: CELL_SIZE * 0.7 * Math.sqrt(dec.size) },
                  ]}
                >
                  {dec.emoji}
                </Text>
                {editMode && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeDecoration(dec.id)}
                  >
                    <Trash2 size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Companion - always in center */}
            {!editMode && companionAppearance && (
              <View
                style={[
                  styles.companionContainer,
                  {
                    left: GRID_SIZE * CELL_SIZE / 2 - 35,
                    top: GRID_SIZE * CELL_SIZE / 2 - 35,
                  },
                ]}
              >
                <AnimalCompanion
                  animalType={companionAppearance.species || 'cat'}
                  emotion="idle"
                  size={70}
                />
              </View>
            )}
          </View>
        </View>

        {editMode && (
          <View style={styles.decorationsList}>
            <Text style={styles.decorationsTitle}>
              {selectedDecoration
                ? `Selected: ${selectedDecoration.name}`
                : 'Choose a decoration'}
            </Text>

            <View style={styles.decorationsGrid}>
              {unlockedDecorations.map((dec) => (
                <TouchableOpacity
                  key={dec.id}
                  style={[
                    styles.decorationCard,
                    selectedDecoration?.id === dec.id &&
                      styles.decorationCardSelected,
                    dec.rarity === 'rare' && styles.decorationCardRare,
                    dec.rarity === 'legendary' && styles.decorationCardLegendary,
                  ]}
                  onPress={() => setSelectedDecoration(dec)}
                >
                  <Text style={{ fontSize: 32 }}>{dec.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: theme.textSecondary,
                      marginTop: 4,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {dec.name}
                  </Text>
                  {dec.rarity !== 'common' && (
                    <Sparkles
                      size={12}
                      color={getRarityColor(dec.rarity)}
                      style={{ position: 'absolute', top: 4, right: 4 }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
