import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Construction,
  Rocket,
  Sparkles,
  Home,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CompanionEnvironmentScreen() {
  const { theme, fontSize } = useTheme();
  const router = useRouter();

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
      padding: 32,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: `${theme.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: getFontSize(fontSize, 'body') * 1.6,
      marginBottom: 32,
    },
    featureList: {
      alignSelf: 'stretch',
      marginBottom: 32,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    featureText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginLeft: 16,
      flex: 1,
    },
    backButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 24,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    backButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
      color: '#FFFFFF',
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
          <Construction size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Environment Customization</Text>
            <Text style={styles.headerSubtitle}>Coming Soon</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Rocket size={56} color={theme.primary} />
        </View>

        <Text style={styles.title}>Under Construction</Text>

        <Text style={styles.description}>
          We're building an amazing feature that will let you customize Buddy's environment with
          different themes, weather effects, and ambient sounds!
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Sparkles size={24} color={theme.primary} />
            <Text style={styles.featureText}>Choose from beautiful environment themes</Text>
          </View>
          <View style={styles.featureItem}>
            <Sparkles size={24} color={theme.primary} />
            <Text style={styles.featureText}>Customize colors, lighting, and weather</Text>
          </View>
          <View style={styles.featureItem}>
            <Sparkles size={24} color={theme.primary} />
            <Text style={styles.featureText}>Add ambient sounds to your chats</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
