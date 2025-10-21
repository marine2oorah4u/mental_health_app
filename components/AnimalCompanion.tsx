import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimalCompanionProps {
  animalType?: 'cat' | 'dog' | 'bird' | 'bunny';
  emotion?: 'idle' | 'listening' | 'speaking' | 'happy' | 'concerned' | 'excited' | 'thinking';
  size?: number;
  onPress?: () => void;
}

export default function AnimalCompanion({
  animalType = 'cat',
  emotion = 'idle',
  size = 120,
  onPress,
}: AnimalCompanionProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    // Idle breathing animation
    if (emotion === 'idle') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    // Listening pulse
    if (emotion === 'listening') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    }

    // Speaking/excited bounce
    if (emotion === 'speaking' || emotion === 'excited') {
      bounce.value = withRepeat(
        withSequence(
          withSpring(-10, { damping: 8, stiffness: 100 }),
          withSpring(0, { damping: 8, stiffness: 100 })
        ),
        -1,
        false
      );
    }

    // Happy wiggle
    if (emotion === 'happy') {
      rotation.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 300 }),
          withTiming(-10, { duration: 600 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      );
    }

    // Thinking sway
    if (emotion === 'thinking') {
      rotation.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    return () => {
      scale.value = 1;
      rotation.value = 0;
      bounce.value = 0;
    };
  }, [emotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
      { translateY: bounce.value },
    ],
  }));

  const getAnimalEmoji = () => {
    const animals = {
      cat: '🐱',
      dog: '🐶',
      bird: '🐦',
      bunny: '🐰',
    };
    return animals[animalType];
  };

  // Get emotion indicator emoji
  const getEmotionIndicator = () => {
    const indicators: Record<string, string> = {
      listening: '🎤',
      speaking: '💬',
      thinking: '💭',
      happy: '✨',
      excited: '🎉',
      concerned: '💙',
    };
    return indicators[emotion] || '';
  };

  const indicator = getEmotionIndicator();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.container, animatedStyle, { width: size, height: size }]}>
        {/* Animal character - clean, just the animal */}
        <View style={styles.animalBody}>
          <Animated.Text style={{ fontSize: size * 0.8, textAlign: 'center' }}>
            {getAnimalEmoji()}
          </Animated.Text>
        </View>

        {/* Emotion indicator floating above */}
        {indicator && (
          <View style={[styles.indicator, { top: -size * 0.15, alignSelf: 'center' }]}>
            <Animated.Text style={{ fontSize: size * 0.25 }}>
              {indicator}
            </Animated.Text>
          </View>
        )}

        {/* Glow effect based on emotion */}
        <View
          style={[
            styles.glow,
            {
              backgroundColor:
                emotion === 'happy' ? '#FFD700' :
                emotion === 'concerned' ? '#87CEEB' :
                emotion === 'excited' ? '#FF69B4' :
                emotion === 'listening' ? '#98FB98' :
                emotion === 'speaking' ? '#FFA500' :
                '#E6E6FA',
              opacity: 0.3,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  animalBody: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalHead: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalEmoji: {
    textAlign: 'center',
  },
  expressionOverlay: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  indicator: {
    position: 'absolute',
    top: -15,
    left: -15,
  },
  glow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 1000,
    zIndex: -1,
  },
});
