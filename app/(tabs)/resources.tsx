import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Globe, AlertCircle, ExternalLink, Heart } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface Resource {
  id: string;
  category_id: string;
  title: string;
  description: string;
  url: string | null;
  phone: string | null;
  is_crisis: boolean;
  is_24_7: boolean;
  countries: string[];
}

export default function ResourcesScreen() {
  const { theme, fontSize } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [categoriesResult, resourcesResult] = await Promise.all([
      supabase
        .from('resource_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true }),
      supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true }),
    ]);

    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
      if (categoriesResult.data.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesResult.data[0].id);
      }
    }

    if (resourcesResult.data) {
      setResources(resourcesResult.data);
    }

    setLoading(false);
  };

  const handlePhoneCall = (phone: string, title: string) => {
    Alert.alert(
      'Call ' + title,
      'This will open your phone to call: ' + phone,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            const phoneNumber = phone.replace(/[^0-9]/g, '');
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ]
    );
  };

  const handleOpenURL = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const filteredResources = resources.filter(
    (r) => r.category_id === selectedCategory
  );

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

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
    crisisBar: {
      backgroundColor: '#DC2626',
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    crisisText: {
      flex: 1,
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
    },
    crisisButton: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    crisisButtonText: {
      color: '#DC2626',
      fontWeight: '700',
      fontSize: getFontSize(fontSize, 'small'),
    },
    categoriesScroll: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    categoryCard: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: theme.surface,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    categoryCardActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    categoryIcon: {
      fontSize: getFontSize(fontSize, 'large'),
    },
    categoryName: {
      fontSize: getFontSize(fontSize, 'medium'),
      fontWeight: '600',
      color: theme.text,
    },
    resourcesList: {
      padding: 16,
    },
    resourceCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    resourceCardCrisis: {
      borderLeftColor: '#DC2626',
      backgroundColor: '#FEF2F2',
    },
    resourceHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
      gap: 8,
    },
    resourceTitle: {
      flex: 1,
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: '#DC2626',
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'xsmall'),
      fontWeight: '700',
    },
    badge247: {
      backgroundColor: '#10B981',
    },
    resourceDescription: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      gap: 8,
    },
    actionButtonPhone: {
      backgroundColor: '#10B981',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: getFontSize(fontSize, 'medium'),
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.textSecondary,
      textAlign: 'center',
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
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSubtitle}>
          Help when you need it most
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.crisisBar}
        onPress={() => handlePhoneCall('988', '988 Crisis Line')}
      >
        <AlertCircle size={24} color="#FFFFFF" />
        <Text style={styles.crisisText}>
          In crisis? Call 988 now for immediate help
        </Text>
        <View style={styles.crisisButton}>
          <Text style={styles.crisisButtonText}>CALL</Text>
        </View>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory === category.id && styles.categoryCardActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.resourcesList} showsVerticalScrollIndicator={false}>
        {filteredResources.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color={theme.textSecondary} />
            <Text style={styles.emptyText}>
              No resources in this category yet
            </Text>
          </View>
        ) : (
          filteredResources.map((resource) => (
            <View
              key={resource.id}
              style={[
                styles.resourceCard,
                resource.is_crisis && styles.resourceCardCrisis,
              ]}
            >
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                {resource.is_crisis && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>CRISIS</Text>
                  </View>
                )}
                {resource.is_24_7 && (
                  <View style={[styles.badge, styles.badge247]}>
                    <Text style={styles.badgeText}>24/7</Text>
                  </View>
                )}
              </View>

              {resource.description && (
                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
              )}

              <View style={styles.actionsRow}>
                {resource.phone && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonPhone]}
                    onPress={() => handlePhoneCall(resource.phone!, resource.title)}
                  >
                    <Phone size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                )}
                {resource.url && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenURL(resource.url!)}
                  >
                    <ExternalLink size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Visit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
