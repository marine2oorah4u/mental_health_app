import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, Ellipse, Polygon, Line } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';

// Pattern 1: Floating Botanical (like login)
export function BotanicalPattern({ isDark = false }: { isDark?: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Floating circles */}
      <View style={{ position: 'absolute', top: 100, left: 20 }}>
        <Svg width={40} height={40} viewBox="0 0 40 40">
          <Circle cx="20" cy="20" r="18" fill="#60A5FA" opacity={0.3} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', top: 200, right: 30 }}>
        <Svg width={35} height={35} viewBox="0 0 35 35">
          <Circle cx="17.5" cy="17.5" r="15" fill="#34D399" opacity={0.3} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', top: 350, left: 60 }}>
        <Svg width={30} height={30} viewBox="0 0 30 30">
          <Circle cx="15" cy="15" r="13" fill="#F472B6" opacity={0.25} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', bottom: 220, right: 50 }}>
        <Svg width={45} height={45} viewBox="0 0 45 45">
          <Circle cx="22.5" cy="22.5" r="20" fill="#FCD34D" opacity={0.25} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', top: 500, right: 80 }}>
        <Svg width={25} height={25} viewBox="0 0 25 25">
          <Circle cx="12.5" cy="12.5" r="11" fill="#818CF8" opacity={0.3} />
        </Svg>
      </View>

      {/* Leaf decorations */}
      <Animated.View entering={FadeIn.duration(1000).delay(200)} style={{ position: 'absolute', top: 120, left: -5, transform: [{ rotate: '-25deg' }] }}>
        <Svg width={60} height={60} viewBox="0 0 100 100">
          <Path d="M50 10 Q80 30 85 60 Q85 80 70 90 Q60 85 50 95 Q50 60 50 10" fill="#10B981" opacity={0.4} />
          <Path d="M50 10 Q20 30 15 60 Q15 80 30 90 Q40 85 50 95" fill="#10B981" opacity={0.3} />
        </Svg>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(1000).delay(400)} style={{ position: 'absolute', top: 280, right: -5, transform: [{ rotate: '35deg' }] }}>
        <Svg width={50} height={50} viewBox="0 0 100 100">
          <Path d="M50 10 Q80 30 85 60 Q85 80 70 90 Q60 85 50 95 Q50 60 50 10" fill="#34D399" opacity={0.4} />
        </Svg>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(1000).delay(600)} style={{ position: 'absolute', bottom: 200, left: 20 }}>
        <Svg width={40} height={40} viewBox="0 0 100 100">
          <Path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#FCD34D" opacity={0.5} />
        </Svg>
      </Animated.View>
    </View>
  );
}

// Pattern 2: Geometric Minimalist
export function GeometricPattern({ isDark = false }: { isDark?: boolean }) {
  const lineColor = isDark ? '#6B7280' : '#E5E7EB';
  const accentColor = isDark ? '#60A5FA' : '#3B82F6';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {/* Grid lines */}
        <Line x1="0" y1="100" x2="100%" y2="100" stroke={lineColor} strokeWidth="1" opacity={0.3} />
        <Line x1="0" y1="200" x2="100%" y2="200" stroke={lineColor} strokeWidth="1" opacity={0.3} />
        <Line x1="0" y1="300" x2="100%" y2="300" stroke={lineColor} strokeWidth="1" opacity={0.3} />
        <Line x1="0" y1="400" x2="100%" y2="400" stroke={lineColor} strokeWidth="1" opacity={0.3} />

        {/* Accent shapes */}
        <Circle cx="30" cy="150" r="8" fill={accentColor} opacity={0.4} />
        <Rect x="80%" y="250" width="15" height="15" fill="#34D399" opacity={0.4} />
        <Polygon points="50,320 60,340 40,340" fill="#F472B6" opacity={0.4} />
        <Circle cx="90%" cy="450" r="12" fill="#FCD34D" opacity={0.4} />
      </Svg>
    </View>
  );
}

// Pattern 3: Wavy Organic
export function WavyPattern({ isDark = false }: { isDark?: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {/* Wavy lines */}
        <Path
          d="M 0 100 Q 100 80 200 100 T 400 100"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
          opacity={0.3}
        />
        <Path
          d="M 0 200 Q 100 180 200 200 T 400 200"
          stroke="#34D399"
          strokeWidth="2"
          fill="none"
          opacity={0.3}
        />
        <Path
          d="M 0 300 Q 100 280 200 300 T 400 300"
          stroke="#F472B6"
          strokeWidth="2"
          fill="none"
          opacity={0.25}
        />
        <Path
          d="M 0 400 Q 100 380 200 400 T 400 400"
          stroke="#FCD34D"
          strokeWidth="2"
          fill="none"
          opacity={0.25}
        />

        {/* Floating orbs */}
        <Circle cx="10%" cy="150" r="20" fill="#60A5FA" opacity={0.15} />
        <Circle cx="85%" cy="280" r="35" fill="#34D399" opacity={0.12} />
        <Circle cx="40%" cy="420" r="25" fill="#F472B6" opacity={0.15} />
      </Svg>
    </View>
  );
}

// Pattern 4: Dots Grid
export function DotsPattern({ isDark = false }: { isDark?: boolean }) {
  const dotColor = isDark ? '#6B7280' : '#D1D5DB';
  const dots = [];

  for (let y = 50; y < 700; y += 40) {
    for (let x = 20; x < 400; x += 40) {
      dots.push(
        <Circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="2"
          fill={dotColor}
          opacity={0.4}
        />
      );
    }
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {dots}

        {/* Accent circles */}
        <Circle cx="15%" cy="180" r="30" fill="#60A5FA" opacity={0.15} />
        <Circle cx="80%" cy="320" r="40" fill="#34D399" opacity={0.12} />
        <Circle cx="50%" cy="480" r="35" fill="#F472B6" opacity={0.15} />
      </Svg>
    </View>
  );
}

// Pattern 5: Abstract Blobs
export function BlobsPattern({ isDark = false }: { isDark?: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {/* Organic blob shapes */}
        <Ellipse
          cx="10%"
          cy="120"
          rx="60"
          ry="80"
          fill="#60A5FA"
          opacity={0.15}
          transform="rotate(-20 40 120)"
        />
        <Ellipse
          cx="85%"
          cy="250"
          rx="70"
          ry="50"
          fill="#34D399"
          opacity={0.15}
          transform="rotate(30 340 250)"
        />
        <Ellipse
          cx="30%"
          cy="400"
          rx="55"
          ry="75"
          fill="#F472B6"
          opacity={0.12}
          transform="rotate(15 120 400)"
        />
        <Ellipse
          cx="75%"
          cy="550"
          rx="65"
          ry="45"
          fill="#FCD34D"
          opacity={0.15}
          transform="rotate(-25 300 550)"
        />

        {/* Small accent circles */}
        <Circle cx="50%" cy="180" r="15" fill="#818CF8" opacity={0.3} />
        <Circle cx="20%" cy="320" r="12" fill="#34D399" opacity={0.3} />
        <Circle cx="90%" cy="450" r="18" fill="#F472B6" opacity={0.3} />
      </Svg>
    </View>
  );
}

// Pattern 6: Confetti
export function ConfettiPattern({ isDark = false }: { isDark?: boolean }) {
  const colors = ['#60A5FA', '#34D399', '#F472B6', '#FCD34D', '#818CF8', '#FB923C'];
  const confetti = [];

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 100;
    const y = (i * 25) + Math.random() * 20;
    const size = 8 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 360;

    confetti.push(
      <Rect
        key={i}
        x={`${x}%`}
        y={y}
        width={size}
        height={size / 2}
        fill={color}
        opacity={0.4}
        transform={`rotate(${rotation} ${x} ${y})`}
      />
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {confetti}
      </Svg>
    </View>
  );
}
