import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

export function LeafDecoration({ size = 60, color = '#10B981', style }: any) {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 10 Q80 30 85 60 Q85 80 70 90 Q60 85 50 95 Q50 60 50 10"
          fill={color}
          opacity={0.3}
        />
        <Path
          d="M50 10 Q20 30 15 60 Q15 80 30 90 Q40 85 50 95"
          fill={color}
          opacity={0.2}
        />
        <Path
          d="M50 20 L50 85"
          stroke={color}
          strokeWidth="2"
          opacity={0.4}
        />
      </Svg>
    </View>
  );
}

export function SparkleDecoration({ size = 40, color = '#FCD34D', style }: any) {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"
          fill={color}
          opacity={0.6}
        />
        <Circle cx="50" cy="50" r="8" fill={color} opacity={0.8} />
      </Svg>
    </View>
  );
}

export function BrainIllustration({ size = 200, isDark = false }: any) {
  const brainColor = isDark ? '#F9A8D4' : '#F472B6';
  const accentColor = isDark ? '#FDE68A' : '#FCD34D';

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={brainColor} stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#EC4899" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        <Circle cx="100" cy="100" r="85" fill={isDark ? '#2D1B3D' : '#FCE7F3'} opacity={0.5} />

        <Path
          d="M 60 100 Q 50 70 70 50 Q 90 35 110 50 Q 130 70 140 100"
          stroke="url(#brainGrad)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />

        <Path
          d="M 65 110 Q 55 130 70 150 Q 90 165 110 150 Q 130 130 135 110"
          stroke="url(#brainGrad)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />

        <Ellipse cx="75" cy="80" rx="20" ry="28" fill="url(#brainGrad)" opacity={0.7} />
        <Ellipse cx="125" cy="80" rx="20" ry="28" fill="url(#brainGrad)" opacity={0.7} />
        <Ellipse cx="75" cy="120" rx="20" ry="28" fill="url(#brainGrad)" opacity={0.7} />
        <Ellipse cx="125" cy="120" rx="20" ry="28" fill="url(#brainGrad)" opacity={0.7} />

        <Path d="M 70 70 Q 80 60 90 65" stroke={brainColor} strokeWidth="3" fill="none" />
        <Path d="M 110 70 Q 120 60 130 65" stroke={brainColor} strokeWidth="3" fill="none" />
        <Path d="M 70 110 Q 80 120 90 115" stroke={brainColor} strokeWidth="3" fill="none" />
        <Path d="M 110 110 Q 120 120 130 115" stroke={brainColor} strokeWidth="3" fill="none" />

        <Circle cx="45" cy="60" r="25" fill={accentColor} opacity={0.3} />
        <Circle cx="155" cy="60" r="20" fill={accentColor} opacity={0.3} />

        <Path
          d="M 30 50 L 25 35 L 35 32"
          stroke={accentColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="25" cy="30" r="8" fill={accentColor} opacity={0.8} />

        <Circle cx="165" cy="140" r="4" fill={isDark ? '#60A5FA' : '#93C5FD'} opacity={0.6} />
        <Circle cx="175" cy="135" r="3" fill={isDark ? '#34D399' : '#6EE7B7'} opacity={0.6} />
        <Circle cx="170" cy="145" r="3" fill={isDark ? '#F472B6' : '#F9A8D4'} opacity={0.6} />
      </Svg>
    </View>
  );
}

export function FloatingCircles({ isDark = false }: any) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={{ position: 'absolute', top: 100, left: 30 }}>
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Circle cx="10" cy="10" r="8" fill={isDark ? '#60A5FA' : '#93C5FD'} opacity={0.4} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', top: 150, right: 50 }}>
        <Svg width={15} height={15} viewBox="0 0 15 15">
          <Circle cx="7.5" cy="7.5" r="6" fill={isDark ? '#34D399' : '#6EE7B7'} opacity={0.4} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', top: 180, left: 80 }}>
        <Svg width={12} height={12} viewBox="0 0 12 12">
          <Circle cx="6" cy="6" r="5" fill={isDark ? '#F472B6' : '#F9A8D4'} opacity={0.4} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', bottom: 250, right: 40 }}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Circle cx="9" cy="9" r="7" fill={isDark ? '#FCD34D' : '#FDE68A'} opacity={0.3} />
        </Svg>
      </View>
      <View style={{ position: 'absolute', top: 200, right: 100 }}>
        <Svg width={10} height={10} viewBox="0 0 10 10">
          <Circle cx="5" cy="5" r="4" fill={isDark ? '#818CF8' : '#A5B4FC'} opacity={0.4} />
        </Svg>
      </View>
    </View>
  );
}

export function GearDecoration({ size = 40, color = '#6B7280', style }: any) {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 10 L55 30 L75 25 L70 45 L90 50 L70 55 L75 75 L55 70 L50 90 L45 70 L25 75 L30 55 L10 50 L30 45 L25 25 L45 30 Z"
          fill="none"
          stroke={color}
          strokeWidth="4"
          opacity={0.4}
        />
        <Circle cx="50" cy="50" r="15" fill="none" stroke={color} strokeWidth="4" opacity={0.4} />
      </Svg>
    </View>
  );
}

export function AbstractWaves({ isDark = false }: any) {
  const color1 = isDark ? '#4C1D95' : '#DDD6FE';
  const color2 = isDark ? '#1E293B' : '#E0E7FF';

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <Svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none">
        <Path
          d="M0 100 Q100 50 200 100 T400 100 L400 200 L0 200 Z"
          fill={color1}
          opacity={0.2}
        />
        <Path
          d="M0 120 Q100 80 200 120 T400 120 L400 200 L0 200 Z"
          fill={color2}
          opacity={0.3}
        />
      </Svg>
    </View>
  );
}
