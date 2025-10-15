import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Phone, MessageSquare, Globe, AlertCircle, Heart } from 'lucide-react-native';

const CRISIS_RESOURCES = [
  {
    id: '1',
    name: 'National Suicide Prevention Lifeline',
    contact: '988',
    type: 'phone',
    description: '24/7 free and confidential support for people in distress',
    region: 'United States',
    color: '#EF4444',
  },
  {
    id: '2',
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    type: 'text',
    description: 'Free, 24/7 crisis support via text message',
    region: 'United States',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'SAMHSA National Helpline',
    contact: '1-800-662-4357',
    type: 'phone',
    description: 'Substance abuse and mental health services',
    region: 'United States',
    color: '#8B5CF6',
  },
  {
    id: '4',
    name: 'Veterans Crisis Line',
    contact: '988 (Press 1)',
    type: 'phone',
    description: 'Support for veterans and their families',
    region: 'United States',
    color: '#10B981',
  },
  {
    id: '5',
    name: 'Trevor Project',
    contact: '1-866-488-7386',
    type: 'phone',
    description: 'Crisis support for LGBTQ+ youth',
    region: 'United States',
    color: '#EC4899',
  },
  {
    id: '6',
    name: 'International Association for Suicide Prevention',
    contact: 'https://www.iasp.info/resources/Crisis_Centres/',
    type: 'web',
    description: 'Global directory of crisis centers',
    region: 'International',
    color: '#3B82F6',
  },
];

export default function CrisisResourcesScreen() {
  const { theme, fontSize } = useTheme();
  const router = useRouter();

  const handleContact = (resource: typeof CRISIS_RESOURCES[0]) => {
    if (resource.type === 'phone') {
      const phoneNumber = resource.contact.replace(/[^0-9]/g, '');
      Alert.alert(
        resource.name,
        `Call ${resource.contact}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => Linking.openURL(`tel:${phoneNumber}`),
          },
        ]
      );
    } else if (resource.type === 'text') {
      Alert.alert(
        resource.name,
        resource.contact,
        [{ text: 'OK' }]
      );
    } else if (resource.type === 'web') {
      Linking.openURL(resource.contact);
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
    urgentCard: {
      backgroundColor: '#EF444420',
      borderLeftWidth: 4,
      borderLeftColor: '#EF4444',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    urgentTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: '#EF4444',
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    urgentText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      lineHeight: 22,
    },
    emergencyButton: {
      backgroundColor: '#EF4444',
      borderRadius: 16,
      padding: 20,
      marginTop: 12,
      alignItems: 'center',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    emergencyButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      marginTop: 8,
    },
    resourceCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    resourceHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    resourceInfo: {
      flex: 1,
    },
    resourceName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    resourceRegion: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 8,
    },
    resourceDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      lineHeight: 20,
      marginBottom: 12,
    },
    contactButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    contactButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
    },
    noteCard: {
      backgroundColor: `${theme.primary}15`,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      marginBottom: 32,
    },
    noteText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      lineHeight: 20,
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return Phone;
      case 'text':
        return MessageSquare;
      case 'web':
        return Globe;
      default:
        return Phone;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Crisis Resources</Text>
          <Text style={styles.headerSubtitle}>Help is available 24/7</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.urgentCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <AlertCircle size={24} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.urgentTitle}>If You're in Crisis</Text>
          </View>
          <Text style={styles.urgentText}>
            If you're thinking about suicide, are worried about a friend or loved one, or would
            like emotional support, these resources are available 24/7.
          </Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleContact(CRISIS_RESOURCES[0])}
          >
            <Heart size={24} color="#FFFFFF" style={{ marginBottom: 8 }} />
            <Text style={styles.emergencyButtonText}>Call 988 - Suicide & Crisis Lifeline</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Available Resources</Text>

        {CRISIS_RESOURCES.map((resource) => {
          const Icon = getIcon(resource.type);
          return (
            <View key={resource.id} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${resource.color}20` }]}>
                  <Icon size={24} color={resource.color} />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceName}>{resource.name}</Text>
                  <Text style={styles.resourceRegion}>{resource.region}</Text>
                </View>
              </View>

              <Text style={styles.resourceDescription}>{resource.description}</Text>

              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: resource.color }]}
                onPress={() => handleContact(resource)}
              >
                <Text style={styles.contactButtonText}>{resource.contact}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💙 Remember: Reaching out for help is a sign of strength, not weakness. These resources
            are staffed by trained professionals who care and want to help. You're not alone.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
