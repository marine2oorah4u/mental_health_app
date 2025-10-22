import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Wind, Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AchievementCelebration from '@/components/AchievementCelebration';
import AnimatedReanimated, { FadeIn } from 'react-native-reanimated';
import { FloatingCircles, BreathingCircle, LeafDecoration } from '@/components/Illustrations';

const { width } = Dimensions.get('window');

const BREATHING_PATTERNS = [
  {
    name: '4-7-8 Relaxation',
    description: 'Helps reduce anxiety and fall asleep',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
  },
  {
    name: 'Box Breathing',
    description: 'Used by Navy SEALs for stress management',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    cycles: 5,
  },
  {
    name: 'Simple Breath',
    description: 'Basic breathing for quick calm',
    inhale: 4,
    exhale: 4,
    cycles: 6,
  },
];

export default function BreathingScreen() {
  const { theme, fontSize } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [celebrationAchievement, setCelebrationAchievement] = useState<any>(null);
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfter'>('inhale');
  const [countdown, setCountdown] = useState(selectedPattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      resetAnimation();
    }
  }, [isActive, phase]);

  const startBreathingCycle = () => {
    const duration = countdown * 1000;

    if (phase === 'inhale' || phase === 'holdAfter') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (phase === 'exhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const resetAnimation = () => {
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0.6);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isActive && countdown === 0) {
      moveToNextPhase();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, countdown]);

  const moveToNextPhase = () => {
    if (phase === 'inhale') {
      if (selectedPattern.hold) {
        setPhase('hold');
        setCountdown(selectedPattern.hold);
      } else {
        setPhase('exhale');
        setCountdown(selectedPattern.exhale);
      }
    } else if (phase === 'hold') {
      setPhase('exhale');
      setCountdown(selectedPattern.exhale);
    } else if (phase === 'exhale') {
      if (selectedPattern.holdAfter) {
        setPhase('holdAfter');
        setCountdown(selectedPattern.holdAfter);
      } else {
        completeCycle();
      }
    } else if (phase === 'holdAfter') {
      completeCycle();
    }
  };

  const completeCycle = async () => {
    if (currentCycle < selectedPattern.cycles) {
      setCurrentCycle(currentCycle + 1);
      setPhase('inhale');
      setCountdown(selectedPattern.inhale);
    } else {
      setIsActive(false);
      setCurrentCycle(1);
      setPhase('inhale');
      setCountdown(selectedPattern.inhale);

      if (user) {
        await trackBreathingCompletion(user.id);
      }
    }
  };

  const trackBreathingCompletion = async (userId: string) => {
    const { data: stats } = await supabase
      .from('user_stats')
      .select('breathing_exercises_completed')
      .eq('user_id', userId)
      .maybeSingle();

    const currentCount = stats?.breathing_exercises_completed || 0;
    const newCount = currentCount + 1;

    await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        breathing_exercises_completed: newCount,
        updated_at: new Date().toISOString(),
      });

    await checkAchievements(userId, newCount);
  };

  const checkAchievements = async (userId: string, count: number) => {
    const achievementIds = {
      first: '5da75f41-1c95-4665-aaf1-4e9e539adb33',
      milestone: '6d604373-554f-423e-8ff1-f9421f0bf124',
    };

    let achievementId = null;
    if (count === 1) achievementId = achievementIds.first;
    else if (count === 20) achievementId = achievementIds.milestone;

    if (!achievementId) return;

    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .maybeSingle();

    if (!existing) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId,
      });

      const { data: achievement } = await supabase
        .from('achievements')
        .select('name, description, points, category')
        .eq('id', achievementId)
        .single();

      if (achievement) {
        setCelebrationAchievement(achievement);
      }
    }
  };

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setCurrentCycle(1);
    setPhase('inhale');
    setCountdown(selectedPattern.inhale);
    resetAnimation();
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdAfter':
        return 'Hold';
      default:
        return '';
    }
  };

  const isDark = theme.text === '#FFFFFF';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    decorativeElements: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 0,
    },
    leafBottomLeft: {
      position: 'absolute',
      bottom: 50,
      left: 10,
      transform: [{ rotate: '15deg' }],
      opacity: 0.3,
    },
    leafBottomRight: {
      position: 'absolute',
      bottom: 80,
      right: 15,
      transform: [{ rotate: '-15deg' }],
      opacity: 0.3,
    },
    headerGradient: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
      padding: 8,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
    },
    exerciseSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    breathingCircle: {
      width: width * 0.7,
      height: width * 0.7,
      borderRadius: (width * 0.7) / 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
      overflow: 'hidden',
    },
    phaseText: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 16,
    },
    countdownText: {
      fontSize: 72,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    cycleText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      marginBottom: 32,
    },
    controls: {
      flexDirection: 'row',
      gap: 16,
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    playButton: {
      backgroundColor: theme.primary,
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    patternsContainer: {
      width: '100%',
    },
    patternsTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    patternCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    patternCardActive: {
      borderColor: theme.primary,
    },
    patternName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    patternDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <FloatingCircles isDark={isDark} />

      <View style={styles.decorativeElements}>
        <AnimatedReanimated entering={FadeIn.duration(1000).delay(400)} style={styles.leafBottomLeft}>
          <LeafDecoration size={50} color={isDark ? '#10B981' : '#059669'} />
        </AnimatedReanimated>
        <AnimatedReanimated entering={FadeIn.duration(1000).delay(600)} style={styles.leafBottomRight}>
          <LeafDecoration size={45} color={isDark ? '#34D399' : '#10B981'} />
        </AnimatedReanimated>
      </View>

      <AchievementCelebration
        achievement={celebrationAchievement}
        onClose={() => setCelebrationAchievement(null)}
      />

      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breathing Exercise</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.exerciseSection}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: (width * 0.7) / 2,
              }}
            />
            <Text style={styles.phaseText}>{getPhaseText()}</Text>
            <Text style={styles.countdownText}>{countdown}</Text>
          </Animated.View>

          <Text style={styles.cycleText}>
            Cycle {currentCycle} of {selectedPattern.cycles}
          </Text>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={resetBreathing}>
              <RotateCcw size={24} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={toggleBreathing}
            >
              {isActive ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <View style={[styles.controlButton, { opacity: 0 }]} />
          </View>
        </View>

        {!isActive && (
          <View style={styles.patternsContainer}>
            <Text style={styles.patternsTitle}>Choose a Pattern</Text>
            {BREATHING_PATTERNS.map((pattern, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.patternCard,
                  selectedPattern.name === pattern.name && styles.patternCardActive,
                ]}
                onPress={() => {
                  setSelectedPattern(pattern);
                  setPhase('inhale');
                  setCountdown(pattern.inhale);
                  setCurrentCycle(1);
                  resetAnimation();
                }}
              >
                <Text style={styles.patternName}>{pattern.name}</Text>
                <Text style={styles.patternDescription}>{pattern.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <AchievementCelebration
        achievement={celebrationAchievement}
        onDismiss={() => setCelebrationAchievement(null)}
      />
    </View>
  );
}
