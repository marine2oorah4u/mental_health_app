import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Music,
  Package,
  LifeBuoy,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type Tab = 'resources' | 'music' | 'decorations';

export default function AdminPanel() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('resources');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);

  // Simple password check
  const ADMIN_PASSWORD = 'wellness2025'; // Change this!

  useEffect(() => {
    if (isAuthorized) {
      loadResources();
      loadCategories();
    }
  }, [isAuthorized]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      Alert.alert('Error', 'Incorrect password');
    }
  };

  const loadResources = async () => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setResources(data);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('resource_categories')
      .select('*')
      .order('order_index');
    if (data) setCategories(data);
  };

  const deleteResource = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this resource?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('resources').delete().eq('id', id);
            loadResources();
          },
        },
      ]
    );
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
    loginContainer: {
      padding: 40,
      alignItems: 'center',
    },
    loginInput: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      width: '100%',
      marginBottom: 16,
    },
    loginButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      width: '100%',
      alignItems: 'center',
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'medium'),
      fontWeight: '700',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      padding: 16,
      gap: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.text,
    },
    tabTextActive: {
      color: '#FFFFFF',
    },
    content: {
      padding: 16,
    },
    addButton: {
      backgroundColor: theme.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      marginBottom: 16,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'medium'),
      fontWeight: '700',
    },
    resourceCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    resourceTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
    },
    resourceDescription: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.textSecondary,
      marginBottom: 12,
    },
    resourceActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      gap: 4,
    },
    editButton: {
      backgroundColor: '#3B82F6',
    },
    deleteButton: {
      backgroundColor: '#DC2626',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
    },
    infoText: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.textSecondary,
      textAlign: 'center',
      padding: 40,
    },
  });

  if (!isAuthorized) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Manage app content</Text>
        </LinearGradient>

        <View style={styles.loginContainer}>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter admin password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtitle}>Manage app content</Text>
      </LinearGradient>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.tabActive]}
          onPress={() => setActiveTab('resources')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'resources' && styles.tabTextActive,
            ]}
          >
            Resources
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'music' && styles.tabActive]}
          onPress={() => setActiveTab('music')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'music' && styles.tabTextActive,
            ]}
          >
            Music
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'decorations' && styles.tabActive]}
          onPress={() => setActiveTab('decorations')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'decorations' && styles.tabTextActive,
            ]}
          >
            Decorations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'resources' && (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                Alert.alert(
                  'Add Resource',
                  'Use Supabase dashboard or SQL to add new resources for now.'
                );
              }}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Resource</Text>
            </TouchableOpacity>

            {resources.map((resource) => (
              <View key={resource.id} style={styles.resourceCard}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                {resource.description && (
                  <Text style={styles.resourceDescription}>
                    {resource.description}
                  </Text>
                )}
                <View style={styles.resourceActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteResource(resource.id)}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'music' && (
          <Text style={styles.infoText}>
            Music management coming soon. For now, use Supabase dashboard to add/edit music packs and tracks.
          </Text>
        )}

        {activeTab === 'decorations' && (
          <Text style={styles.infoText}>
            Decoration management coming soon. For now, use Supabase dashboard to add/edit decorations.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
