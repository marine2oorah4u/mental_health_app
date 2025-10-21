import { View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { Trophy } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Achievement {
  name: string;
  description: string;
  points: number;
  category: string;
}

interface Props {
  achievement: Achievement | null;
  onDismiss: () => void;
}

const ConfettiPiece = ({ delay, side, shape }: { delay: number; side: 'left' | 'right'; shape: 'circle' | 'square' | 'rectangle' }) => {
  const startX = side === 'left' ? -50 : SCREEN_WIDTH + 50;
  const centerY = SCREEN_HEIGHT * 0.5;
  const startY = centerY + (Math.random() - 0.5) * 600;

  const arcDistance = SCREEN_WIDTH * 0.4 + Math.random() * (SCREEN_WIDTH * 0.2);
  const midX = side === 'left' ? startX + arcDistance : startX - arcDistance;
  const peakY = startY - 100 - Math.random() * 100;

  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 200 }));

    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(midX, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(midX, {
          duration: 400,
        }),
        withTiming(midX + (side === 'left' ? 20 : -20), {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        })
      )
    );

    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(peakY, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(peakY, {
          duration: 400,
        }),
        withTiming(SCREEN_HEIGHT + 100, {
          duration: 2200,
          easing: Easing.in(Easing.cubic),
        })
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * 3, {
          duration: 2400,
          easing: Easing.linear,
        }),
        2,
        false
      )
    );

    opacity.value = withDelay(
      delay + 3400,
      withTiming(0, { duration: 400 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B731', '#FF1744', '#00E676', '#FF69B4', '#9C27B0', '#FFC107', '#E91E63', '#00BCD4'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  let width = 8;
  let height = 8;
  let borderRadius = 0;

  if (shape === 'circle') {
    width = 6 + Math.random() * 6;
    height = width;
    borderRadius = width / 2;
  } else if (shape === 'square') {
    width = 6 + Math.random() * 6;
    height = width;
    borderRadius = 1;
  } else {
    width = 8 + Math.random() * 8;
    height = 4 + Math.random() * 4;
    borderRadius = 1;
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width,
          height,
          borderRadius,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const Streamer = ({ delay, side }: { delay: number; side: 'left' | 'right' }) => {
  const startX = side === 'left' ? -40 : SCREEN_WIDTH + 40;
  const centerY = SCREEN_HEIGHT * 0.5;
  const startY = centerY + (Math.random() - 0.5) * 500;

  const horizontalDistance = SCREEN_WIDTH * 0.85 + Math.random() * (SCREEN_WIDTH * 0.3);
  const endX = side === 'left' ? startX + horizontalDistance : startX - horizontalDistance;
  const pauseY = startY;

  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const rotate = useSharedValue(side === 'left' ? 30 : -30);
  const scaleX = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scaleX.value = withDelay(delay, withTiming(1, { duration: 200 }));

    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(endX, {
          duration: 1000,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(endX, {
          duration: 300,
        }),
        withTiming(endX + (side === 'left' ? 30 : -30), {
          duration: 600,
        })
      )
    );

    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(pauseY, {
          duration: 1000,
        }),
        withTiming(pauseY, {
          duration: 300,
        }),
        withTiming(SCREEN_HEIGHT + 100, {
          duration: 1500,
          easing: Easing.in(Easing.quad),
        })
      )
    );

    rotate.value = withDelay(
      delay,
      withTiming(rotate.value + 360, {
        duration: 2000,
        easing: Easing.linear,
      })
    );

    opacity.value = withDelay(
      delay + 2500,
      withTiming(0, { duration: 300 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scaleX: scaleX.value },
    ],
    opacity: opacity.value,
  }));

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B731', '#FF1744', '#00E676', '#9C27B0', '#E91E63', '#00BCD4'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const width = 12 + Math.random() * 16;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: width,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const Balloon = ({ delay, side }: { delay: number; side: 'left' | 'right' }) => {
  const startX = side === 'left'
    ? Math.random() * (SCREEN_WIDTH * 0.4)
    : SCREEN_WIDTH - Math.random() * (SCREEN_WIDTH * 0.4);
  const startY = SCREEN_HEIGHT + 50;

  const floatX = startX + (Math.random() - 0.5) * 100;
  const endY = -150;

  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const rotate = useSharedValue((Math.random() - 0.5) * 20);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 300 }));

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(floatX + 30, {
            duration: 1500,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
          withTiming(floatX - 30, {
            duration: 1500,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          })
        ),
        -1,
        true
      )
    );

    translateY.value = withDelay(
      delay,
      withTiming(endY, {
        duration: 5000,
        easing: Easing.out(Easing.quad),
      })
    );

    const initialRotation = rotate.value;
    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(initialRotation + 10, {
            duration: 1500,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
          withTiming(initialRotation - 10, {
            duration: 1500,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay + 4500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B731', '#FF1744', '#00E676', '#FF69B4', '#9C27B0', '#FFC107'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 35 + Math.random() * 25;

  return (
    <Animated.View style={[animatedStyle, { position: 'absolute' }]}>
      <View style={{
        width: size,
        height: size * 1.15,
        backgroundColor: color,
        borderRadius: size / 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }} />
      <View style={{
        position: 'absolute',
        bottom: -8,
        left: size / 2 - 1,
        width: 2,
        height: 20,
        backgroundColor: color,
        opacity: 0.6,
      }} />
    </Animated.View>
  );
};

export default function AchievementCelebration({ achievement, onDismiss }: Props) {
  const { theme, fontSize } = useTheme();
  const [visible, setVisible] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (achievement) {
      setVisible(true);

      playCrowdSound();

      const cardTimer = setTimeout(() => {
        setShowCard(true);
        playNotificationSound();
      }, 1200);

      dismissTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 15000);

      return () => {
        clearTimeout(cardTimer);
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
        }
      };
    }
  }, [achievement]);

  const handleDismiss = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }
    setShowCard(false);
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  const playCrowdSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c6ea2cb3.mp3' },
        { shouldPlay: true, volume: 0.5 }
      );

      setTimeout(() => {
        sound.unloadAsync();
      }, 3000);
    } catch (error) {
      console.log('Error playing crowd sound:', error);
    }
  };

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/notification-sound-269266.mp3'),
        { shouldPlay: true, volume: 0.7 }
      );

      setTimeout(() => {
        sound.unloadAsync();
      }, 2000);
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  };

  if (!achievement) return null;

  const categoryColors: Record<string, string> = {
    engagement: '#3B82F6',
    wellness: '#10B981',
    milestone: '#F59E0B',
    special: '#8B5CF6',
  };

  const categoryColor = categoryColors[achievement.category] || theme.primary;

  const shapes: Array<'circle' | 'square' | 'rectangle'> = ['circle', 'square', 'rectangle'];
  const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: showCard ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      width: '100%',
      maxWidth: 340,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 15,
    },
    button: {
      marginTop: 20,
      backgroundColor: categoryColor,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 24,
    },
    buttonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
      color: '#FFFFFF',
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${categoryColor}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: getFontSize(fontSize, 'small'),
      color: categoryColor,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    achievementName: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    description: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    pointsBadge: {
      backgroundColor: categoryColor,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    pointsText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
      color: '#FFFFFF',
    },
    animationContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(300)}
        style={styles.overlay}
      >
        <View style={styles.animationContainer}>
          {Array.from({ length: 120 }).map((_, i) => (
            <ConfettiPiece key={`confetti-left-${i}`} delay={i * 5} side="left" shape={getRandomShape()} />
          ))}
          {Array.from({ length: 120 }).map((_, i) => (
            <ConfettiPiece key={`confetti-right-${i}`} delay={i * 5} side="right" shape={getRandomShape()} />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <Streamer key={`streamer-left-${i}`} delay={i * 20} side="left" />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <Streamer key={`streamer-right-${i}`} delay={i * 20} side="right" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <Balloon key={`balloon-left-${i}`} delay={i * 200} side="left" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <Balloon key={`balloon-right-${i}`} delay={i * 200} side="right" />
          ))}
        </View>

        {showCard && (
          <Animated.View
            entering={ZoomIn.duration(400).springify()}
            exiting={ZoomOut.duration(200)}
            style={styles.card}
          >
            <View style={styles.iconContainer}>
              <Trophy size={40} color={categoryColor} />
            </View>

            <Text style={styles.title}>Achievement Unlocked!</Text>
            <Text style={styles.achievementName}>{achievement.name}</Text>
            <Text style={styles.description}>{achievement.description}</Text>

            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>+{achievement.points} pts</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleDismiss} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Awesome!</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
}
