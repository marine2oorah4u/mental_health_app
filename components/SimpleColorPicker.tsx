import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SimpleColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8B88B', '#FAD390', '#6C5CE7', '#A29BFE',
  '#FD79A8', '#FDCB6E', '#00B894', '#00CEC9',
  '#E17055', '#74B9FF', '#A29BFE', '#FD79A8',
];

export default function SimpleColorPicker({ selectedColor, onSelectColor }: SimpleColorPickerProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
    },
    colorOption: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: theme.primary,
    },
  });

  return (
    <View style={styles.container}>
      {PRESET_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.colorOptionSelected,
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
  );
}
