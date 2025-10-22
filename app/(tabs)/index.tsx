import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Heart,
  Wind,
  MessageCircle,
  BookOpen,
  Music,
  Sparkles,
  TrendingUp,
  Calendar,
  Smile,
  Brain,
  Bell,
  Menu,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  gradient: string[];
  route: string;
  category: 'wellness' | 'daily' | 'tools';
}

const FEATURES: FeatureCard[] = [
  {
    id: 'checkin',
    title: 'Daily Check-in',
    subtitle: 'Start your day right',
    icon: Calendar,
    gradient: ['#667eea', '#764ba2'],
    route: '/(tabs)/daily-checkin',
    category: 'daily',
  },
  {
    id: 'companion',
    title: 'Talk to Companion',
    subtitle: 'Your AI wellness friend',
    icon: MessageCircle,
    gradient: ['#f093fb', '#f5576c'],
    route: '/(tabs)/companion',
    category: 'wellness',
  },
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    subtitle: 'Calm your mind',
    icon: Wind,
    gradient: ['#4facfe', '#00f2fe'],
    route: '/(tabs)/breathing',
    category: 'wellness',
  },
  {
    id: 'journal',
    title: 'Journal',
    subtitle: 'Write your thoughts',
    icon: BookOpen,
    gradient: ['#43e97b', '#38f9d7'],
    route: '/(tabs)/journal',
    category: 'tools',
  },
  {
    id: 'mood',
    title: 'Mood Tracker',
    subtitle: 'Track your emotions',
    icon: Smile,
    gradient: ['#fa709a', '#fee140'],
    route: '/(tabs)/mood-tracker',
    category: 'tools',
  },
  {
    id: 'affirmations',
    title: 'Affirmations',
    subtitle: 'Daily positive vibes',
    icon: Sparkles,
    gradient: ['#30cfd0', '#330867'],
    route: '/(tabs)/affirmations',
    category: 'daily',
  },
  {
    id: 'sounds',
    title: 'Calming Sounds',
    subtitle: 'Relax and unwind',
    icon: Music,
    gradient: ['#a8edea', '#fed6e3'],
    route: '/(tabs)/sounds',
    category: 'wellness',
  },
  {
    id: 'medications',
    title: 'Medications',
    subtitle: 'Manage reminders',
    icon: Bell,
    gradient: ['#ff9a9e', '#fecfef'],
    route: '/(tabs)/medications',
    category: 'tools',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.username) {
      setUserName(profile.username);
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: checkin } = await supabase
      .from('daily_checkins')
      .select('streak')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (checkin?.streak) {
      setCurrentStreak(checkin.streak);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.userName}>{userName || 'Welcome'}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Menu size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {currentStreak > 0 && (
          <View style={styles.streakCard}>
            <TrendingUp size={20} color="#FFD700" />
            <Text style={styles.streakText}>
              {currentStreak} day streak!
            </Text>
            <Sparkles size={20} color="#FFD700" />
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Daily Activities
          </Text>
          <View style={styles.cardGrid}>
            {FEATURES.filter((f) => f.category === 'daily').map((feature) => (
              <FeatureCardComponent
                key={feature.id}
                feature={feature}
                onPress={() => router.push(feature.route as any)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Wellness Tools
          </Text>
          <View style={styles.cardGrid}>
            {FEATURES.filter((f) => f.category === 'wellness').map(
              (feature) => (
                <FeatureCardComponent
                  key={feature.id}
                  feature={feature}
                  onPress={() => router.push(feature.route as any)}
                />
              )
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            More Tools
          </Text>
          <View style={styles.cardGrid}>
            {FEATURES.filter((f) => f.category === 'tools').map((feature) => (
              <FeatureCardComponent
                key={feature.id}
                feature={feature}
                onPress={() => router.push(feature.route as any)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.crisisButton, { backgroundColor: theme.error }]}
          onPress={() => router.push('/(tabs)/crisis-resources')}
        >
          <Heart size={20} color="#FFFFFF" />
          <Text style={styles.crisisText}>Need Help Now?</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function FeatureCardComponent({
  feature,
  onPress,
}: {
  feature: FeatureCard;
  onPress: () => void;
}) {
  const Icon = feature.icon;

  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <LinearGradient
        colors={feature.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardIcon}>
          <Icon size={28} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{feature.title}</Text>
          <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardGrid: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  crisisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    marginTop: 8,
  },
  crisisText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
