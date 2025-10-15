import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ColorMode, UserSettings } from '../types';
import { themes, highContrastOverrides } from '../styles/themes';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  settings: UserSettings;
  updateTheme: (theme: Theme) => void;
  updateColorMode: (mode: ColorMode) => void;
  updateFontSize: (size: UserSettings['fontSize']) => void;
  toggleHighContrast: () => void;
  toggleDyslexiaFont: () => void;
  toggleReducedMotion: () => void;
  currentColors: ReturnType<typeof getCurrentColors>;
}

const defaultSettings: UserSettings = {
  theme: 'campfire',
  colorMode: 'system',
  fontSize: 'medium',
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
  language: 'en',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentColors(settings: UserSettings) {
  const theme = themes[settings.theme];
  const systemMode = getSystemColorMode();
  const activeMode = settings.colorMode === 'system' ? systemMode : settings.colorMode;

  let colors = theme[activeMode];

  if (settings.highContrast) {
    colors = { ...colors, ...highContrastOverrides[activeMode] };
  }

  return { ...colors, mode: activeMode };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;

    const saved = localStorage.getItem('scoutInclusionSettings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const currentColors = getCurrentColors(settings);

  const saveSettingsToDatabase = async (newSettings: UserSettings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const settingsData = {
        user_id: user.id,
        theme: newSettings.theme,
        color_mode: newSettings.colorMode,
        font_size: newSettings.fontSize,
        high_contrast: newSettings.highContrast,
        dyslexia_font: newSettings.dyslexiaFont,
        reduced_motion: newSettings.reducedMotion,
        language: newSettings.language,
      };

      if (existing) {
        await supabase
          .from('user_settings')
          .update(settingsData)
          .eq('user_id', user.id);
      } else {
        await supabase.from('user_settings').insert(settingsData);
      }
    } catch (error) {
      console.error('Error saving settings to database:', error);
    }
  };

  useEffect(() => {
    const loadSettingsFromDatabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          const loadedSettings: UserSettings = {
            theme: data.theme as Theme,
            colorMode: data.color_mode as ColorMode,
            fontSize: data.font_size as UserSettings['fontSize'],
            highContrast: data.high_contrast,
            dyslexiaFont: data.dyslexia_font,
            reducedMotion: data.reduced_motion,
            language: data.language,
          };
          setSettings(loadedSettings);
        }
      } catch (error) {
        console.error('Error loading settings from database:', error);
      }
    };

    loadSettingsFromDatabase();
  }, []);

  useEffect(() => {
    localStorage.setItem('scoutInclusionSettings', JSON.stringify(settings));
    saveSettingsToDatabase(settings);

    // Apply theme to document
    const root = document.documentElement;
    const colors = getCurrentColors(settings);

    Object.entries(colors).forEach(([key, value]) => {
      if (key !== 'mode') {
        root.style.setProperty(`--color-${key}`, value);
      }
    });

    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize]);

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.style.setProperty('--font-family', 'OpenDyslexic, Arial, sans-serif');
    } else {
      root.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-speed', '0s');
    } else {
      root.style.setProperty('--transition-speed', '0.2s');
    }

    // Dark mode class
    if (colors.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  // Listen for system color scheme changes
  useEffect(() => {
    if (settings.colorMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSettings(s => ({ ...s })); // Trigger re-render

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.colorMode]);

  const updateTheme = (theme: Theme) => {
    const newSettings = { ...settings, theme };
    setSettings(newSettings);
  };

  const updateColorMode = (colorMode: ColorMode) => {
    const newSettings = { ...settings, colorMode };
    setSettings(newSettings);
  };

  const updateFontSize = (fontSize: UserSettings['fontSize']) => {
    const newSettings = { ...settings, fontSize };
    setSettings(newSettings);
  };

  const toggleHighContrast = () => {
    const newSettings = { ...settings, highContrast: !settings.highContrast };
    setSettings(newSettings);
  };

  const toggleDyslexiaFont = () => {
    const newSettings = { ...settings, dyslexiaFont: !settings.dyslexiaFont };
    setSettings(newSettings);
  };

  const toggleReducedMotion = () => {
    const newSettings = { ...settings, reducedMotion: !settings.reducedMotion };
    setSettings(newSettings);
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateTheme,
        updateColorMode,
        updateFontSize,
        toggleHighContrast,
        toggleDyslexiaFont,
        toggleReducedMotion,
        currentColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
