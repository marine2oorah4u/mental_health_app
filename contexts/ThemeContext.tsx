import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export const THEMES = {
  calming_ocean: {
    primary: '#0077BE',
    secondary: '#00A8E8',
    accent: '#87CEEB',
    background: '#E3F2FD',
    surface: '#F8FCFF',
    text: '#0D47A1',
    textSecondary: '#1565C0',
    border: '#90CAF9',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
  forest_peace: {
    primary: '#2E7D32',
    secondary: '#4CAF50',
    accent: '#81C784',
    background: '#E8F5E9',
    surface: '#F1F8E9',
    text: '#1B5E20',
    textSecondary: '#33691E',
    border: '#A5D6A7',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
  },
  warm_sunset: {
    primary: '#D84315',
    secondary: '#FF6F00',
    accent: '#FFB74D',
    background: '#FBE9E7',
    surface: '#FFF3E0',
    text: '#BF360C',
    textSecondary: '#E64A19',
    border: '#FFCCBC',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
  },
  soft_lavender: {
    primary: '#7B1FA2',
    secondary: '#9C27B0',
    accent: '#BA68C8',
    background: '#F3E5F5',
    surface: '#FCE4EC',
    text: '#4A148C',
    textSecondary: '#6A1B9A',
    border: '#CE93D8',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
  },
  midnight: {
    primary: '#1E88E5',
    secondary: '#42A5F5',
    accent: '#64B5F6',
    background: '#0A1929',
    surface: '#132F4C',
    text: '#E3F2FD',
    textSecondary: '#B0BEC5',
    border: '#1E3A5F',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
  },
  high_contrast: {
    primary: '#000000',
    secondary: '#212121',
    accent: '#424242',
    background: '#F5F5F5',
    surface: '#FAFAFA',
    text: '#000000',
    textSecondary: '#212121',
    border: '#9E9E9E',
    success: '#1B5E20',
    warning: '#E65100',
    error: '#B71C1C',
  },
  scout_colors: {
    primary: '#003F87',
    secondary: '#CE1126',
    accent: '#FFD700',
    background: '#E8EAF6',
    surface: '#F3F4F9',
    text: '#1A237E',
    textSecondary: '#3F51B5',
    border: '#9FA8DA',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#CE1126',
  },
  campfire: {
    primary: '#D2691E',
    secondary: '#FF4500',
    accent: '#FFD700',
    background: '#2C1810',
    surface: '#3D2415',
    text: '#FFF4E6',
    textSecondary: '#D2B48C',
    border: '#8B4513',
    success: '#9ACD32',
    warning: '#FFA500',
    error: '#DC143C',
  },
  darker: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    accent: '#CF6679',
    background: '#000000',
    surface: '#121212',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
    success: '#4CAF50',
    warning: '#FFA726',
    error: '#CF6679',
  },
  olive_green: {
    primary: '#6B8E23',
    secondary: '#808000',
    accent: '#9ACD32',
    background: '#2C3021',
    surface: '#3A4029',
    text: '#E8F0D5',
    textSecondary: '#C5D1A8',
    border: '#556B2F',
    success: '#7CB342',
    warning: '#F57C00',
    error: '#D32F2F',
  },
};

export type ThemeName = keyof typeof THEMES;
export type FontSize = 'small' | 'medium' | 'large' | 'extra_large';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeContextType {
  themeName: ThemeName | 'custom';
  theme: ThemeColors;
  fontSize: FontSize;
  customTheme: ThemeColors | null;
  setTheme: (name: ThemeName) => void;
  setCustomTheme: (colors: ThemeColors) => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName | 'custom'>('forest_peace');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [customTheme, setCustomThemeState] = useState<ThemeColors | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('theme_preference, font_size, custom_theme_data')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          if (profile.custom_theme_data) {
            setCustomThemeState(profile.custom_theme_data as ThemeColors);
          }
          if (profile.theme_preference) {
            setThemeNameState(profile.theme_preference as ThemeName | 'custom');
          }
          if (profile.font_size) {
            setFontSizeState(profile.font_size as FontSize);
          }
        }
      } else {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        const savedCustomTheme = await AsyncStorage.getItem('customTheme');

        if (savedCustomTheme) {
          setCustomThemeState(JSON.parse(savedCustomTheme));
        }
        if (savedTheme) setThemeNameState(savedTheme as ThemeName | 'custom');
        if (savedFontSize) setFontSizeState(savedFontSize as FontSize);
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  };

  const setTheme = async (name: ThemeName) => {
    setThemeNameState(name);
    await AsyncStorage.setItem('theme', name);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ theme_preference: name })
        .eq('id', user.id);
    }
  };

  const setCustomTheme = async (colors: ThemeColors) => {
    setCustomThemeState(colors);
    setThemeNameState('custom');
    await AsyncStorage.setItem('customTheme', JSON.stringify(colors));
    await AsyncStorage.setItem('theme', 'custom');

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          theme_preference: 'custom',
          custom_theme_data: colors
        })
        .eq('id', user.id);
    }
  };

  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    await AsyncStorage.setItem('fontSize', size);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ font_size: size })
        .eq('id', user.id);
    }
  };

  const currentTheme = themeName === 'custom' && customTheme ? customTheme : THEMES[themeName as ThemeName] || THEMES.forest_peace;

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme: currentTheme,
        fontSize,
        customTheme,
        setTheme,
        setCustomTheme,
        setFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const getFontSize = (
  size: FontSize,
  variant: 'xsmall' | 'small' | 'body' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'heading' | 'title'
) => {
  const sizes = {
    small: {
      xsmall: 10,
      small: 11,
      body: 12,
      medium: 13,
      large: 14,
      xlarge: 16,
      xxlarge: 18,
      heading: 16,
      title: 20,
    },
    medium: {
      xsmall: 11,
      small: 12,
      body: 14,
      medium: 15,
      large: 16,
      xlarge: 18,
      xxlarge: 20,
      heading: 18,
      title: 24,
    },
    large: {
      xsmall: 12,
      small: 14,
      body: 16,
      medium: 17,
      large: 18,
      xlarge: 20,
      xxlarge: 24,
      heading: 22,
      title: 28,
    },
    extra_large: {
      xsmall: 14,
      small: 16,
      body: 18,
      medium: 19,
      large: 20,
      xlarge: 24,
      xxlarge: 28,
      heading: 26,
      title: 32,
    },
  };
  return sizes[size][variant];
};
