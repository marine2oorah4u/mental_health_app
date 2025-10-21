import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Sparkles, Heart, Wind, Zap, Star } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedCompanionProps {
  companionType?: 'orb' | 'animal' | 'humanoid';
  emotion?: 'idle' | 'listening' | 'speaking' | 'happy' | 'concerned' | 'celebrating';
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  onPress?: () => void;
}

export default function AnimatedCompanion({
  companionType = 'orb',
  emotion = 'idle',
  primaryColor,
  secondaryColor,
  size = 120,
  onPress,
}: AnimatedCompanionProps) {
  const { theme } = useTheme();
  const [showParticles, setShowParticles] = useState(false);

  const mainColor = primaryColor || theme.primary;
  const accentColor = secondaryColor || theme.secondary;

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const glowIntensity = useSharedValue(0.3);

  useEffect(() => {
    switch (emotion) {
      case 'idle':
        scale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        glowIntensity.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 2000 }),
            withTiming(0.3, { duration: 2000 })
          ),
          -1,
          false
        );
        break;

      case 'listening':
        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 800 }),
            withTiming(1, { duration: 800 })
          ),
          -1,
          false
        );
        glowIntensity.value = 0.7;
        break;

      case 'speaking':
        scale.value = withRepeat(
          withSequence(
            withTiming(1.08, { duration: 400 }),
            withTiming(1.02, { duration: 400 }),
            withTiming(1.08, { duration: 400 }),
            withTiming(1, { duration: 400 })
          ),
          -1,
          false
        );
        glowIntensity.value = 0.6;
        break;

      case 'happy':
        scale.value = withSpring(1.15, { damping: 8, stiffness: 100 });
        rotation.value = withSequence(
          withTiming(-10, { duration: 200 }),
          withTiming(10, { duration: 400 }),
          withTiming(0, { duration: 200 })
        );
        glowIntensity.value = 0.9;
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
        break;

      case 'concerned':
        scale.value = withTiming(0.95, { duration: 500 });
        glowIntensity.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 500 }),
            withTiming(0.6, { duration: 500 })
          ),
          -1,
          false
        );
        break;

      case 'celebrating':
        scale.value = withRepeat(
          withSequence(
            withSpring(1.3, { damping: 5 }),
            withSpring(1.1, { damping: 5 }),
            withSpring(1.2, { damping: 5 }),
            withSpring(1, { damping: 8 })
          ),
          2,
          false
        );
        rotation.value = withSequence(
          withTiming(360, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 0 })
        );
        glowIntensity.value = 1;
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 3000);
        break;
    }
  }, [emotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowIntensity.value,
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1.1, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
    onPress?.();
  };

  const renderCompanion = () => {
    if (companionType === 'orb') {
      return (
        <View style={styles.orbContainer}>
          <Animated.View
            style={[
              styles.orb,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: mainColor,
                shadowColor: mainColor,
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 20,
                elevation: 10,
              },
              glowStyle,
              animatedStyle,
            ]}
          >
            <View style={styles.orbCore}>
              <Sparkles size={size * 0.4} color={accentColor} />
            </View>
          </Animated.View>

          {showParticles && (
            <View style={styles.particlesContainer}>
              <Animated.View style={[styles.particle, { top: -10, left: -10 }]}>
                <Star size={16} color={mainColor} fill={mainColor} />
              </Animated.View>
              <Animated.View style={[styles.particle, { top: -15, right: -10 }]}>
                <Heart size={14} color={accentColor} fill={accentColor} />
              </Animated.View>
              <Animated.View style={[styles.particle, { bottom: -10, left: 5 }]}>
                <Sparkles size={12} color={mainColor} />
              </Animated.View>
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.container}>
      {renderCompanion()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
  },
});
