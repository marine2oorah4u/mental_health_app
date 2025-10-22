import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  MessageCircle,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    icon: Heart,
    title: 'Welcome to Your Wellness Journey',
    description: 'A safe space designed to support your mental health and personal growth.',
    gradient: ['#F472B6', '#EC4899'],
  },
  {
    icon: MessageCircle,
    title: 'Meet Your AI Companion',
    description: 'Chat with your personalized companion for support, encouragement, and guidance anytime.',
    gradient: ['#60A5FA', '#3B82F6'],
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Monitor your mood, set goals, and celebrate achievements on your wellness path.',
    gradient: ['#34D399', '#10B981'],
  },
  {
    icon: Sparkles,
    title: 'Personalize Your Experience',
    description: 'Customize themes, sounds, and features to create your perfect wellness environment.',
    gradient: ['#A78BFA', '#8B5CF6'],
  },
];

export default function OnboardingScreen() {
  const { theme, fontSize } = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const currentSlide = ONBOARDING_STEPS[currentStep];
  const Icon = currentSlide.icon;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    skipButton: {
      position: 'absolute',
      top: 60,
      right: 20,
      zIndex: 10,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: `${theme.surface}80`,
    },
    skipText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.text,
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
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    description: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 20,
    },
    footer: {
      padding: 32,
      paddingBottom: 48,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
    },
    activeDot: {
      width: 24,
      backgroundColor: theme.primary,
    },
    nextButton: {
      borderRadius: 16,
      overflow: 'hidden',
    },
    nextButtonGradient: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
      marginRight: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View
        key={currentStep}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(200)}
        style={styles.content}
      >
        <LinearGradient
          colors={currentSlide.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Icon size={60} color="#FFFFFF" />
        </LinearGradient>

        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
            </Text>
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <CheckCircle2 size={20} color="#FFFFFF" />
            ) : (
              <ArrowRight size={20} color="#FFFFFF" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
