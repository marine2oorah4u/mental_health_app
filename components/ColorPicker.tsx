import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const { theme, fontSize } = useTheme();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  };

  const rgb = hexToRgb(color);
  const [r, setR] = useState(rgb.r);
  const [g, setG] = useState(rgb.g);
  const [b, setB] = useState(rgb.b);

  const updateColor = (newR: number, newG: number, newB: number) => {
    setR(newR);
    setG(newG);
    setB(newB);
    onChange(rgbToHex(newR, newG, newB));
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    colorPreview: {
      width: '100%',
      height: 50,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: theme.border,
    },
    sliderContainer: {
      marginBottom: 8,
    },
    sliderLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 4,
    },
    sliderRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    slider: {
      flex: 1,
      height: 40,
    },
    value: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      width: 40,
      textAlign: 'right',
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.colorPreview, { backgroundColor: color }]} />

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Red</Text>
        <View style={styles.sliderRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={r}
            onValueChange={(value) => updateColor(value, g, b)}
            minimumTrackTintColor="#FF0000"
            maximumTrackTintColor={theme.border}
            thumbTintColor="#FF0000"
          />
          <Text style={styles.value}>{Math.round(r)}</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Green</Text>
        <View style={styles.sliderRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={g}
            onValueChange={(value) => updateColor(r, value, b)}
            minimumTrackTintColor="#00FF00"
            maximumTrackTintColor={theme.border}
            thumbTintColor="#00FF00"
          />
          <Text style={styles.value}>{Math.round(g)}</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Blue</Text>
        <View style={styles.sliderRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={b}
            onValueChange={(value) => updateColor(r, g, value)}
            minimumTrackTintColor="#0000FF"
            maximumTrackTintColor={theme.border}
            thumbTintColor="#0000FF"
          />
          <Text style={styles.value}>{Math.round(b)}</Text>
        </View>
      </View>
    </View>
  );
}

export default ColorPicker;
