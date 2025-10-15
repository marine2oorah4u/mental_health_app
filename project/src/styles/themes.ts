// Warm, Comfy Color Themes for Scout Inclusion Platform

export interface ColorTheme {
  name: string;
  description: string;
  light: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    background: string;
    backgroundAlt: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    background: string;
    backgroundAlt: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const themes: Record<string, ColorTheme> = {
  campfire: {
    name: 'Campfire Warm',
    description: 'Cozy warmth of a campfire gathering',
    light: {
      primary: '#FF6B35', // Bright flame orange
      primaryHover: '#E85D2E',
      secondary: '#FFB84D', // Ember gold
      secondaryHover: '#F0A83C',
      accent: '#FF9F45', // Warm glow
      background: '#FFF9F5', // Light smoke
      backgroundAlt: '#FFEFE6',
      surface: '#FFFFFF',
      text: '#2D1B15', // Charcoal text
      textMuted: '#6B5550',
      border: '#E8D5CF',
      success: '#65A30D',
      warning: '#EA580C',
      error: '#DC2626',
      info: '#0284C7',
    },
    dark: {
      primary: '#FF7F50', // Coral flame
      primaryHover: '#FF6B35',
      secondary: '#FFD700', // Golden flame
      secondaryHover: '#FFC700',
      accent: '#FFA07A', // Light salmon
      background: '#1A0F0A', // Night around fire
      backgroundAlt: '#2D1F19',
      surface: '#3D2F28',
      text: '#FFF5EE',
      textMuted: '#D6C5BE',
      border: '#57433C',
      success: '#84CC16',
      warning: '#FF9F45',
      error: '#FF6B6B',
      info: '#87CEEB',
    },
  },

  forest: {
    name: 'Forest Comfort',
    description: 'Peaceful woodland tranquility',
    light: {
      primary: '#6B8E72', // Muted sage green
      primaryHover: '#5A7A61',
      secondary: '#7E9266', // Muted olive
      secondaryHover: '#6B7B56',
      accent: '#8B9B6B', // Soft sage
      background: '#F7F9F5', // Soft natural white
      backgroundAlt: '#F0F4ED',
      surface: '#FFFFFF',
      text: '#1C1917',
      textMuted: '#78716C',
      border: '#E2E8F0',
      success: '#5E8A5E',
      warning: '#D4904D',
      error: '#B85B5B',
      info: '#5B8A9B',
    },
    dark: {
      primary: '#8BA88E', // Soft sage
      primaryHover: '#7A9A7D',
      secondary: '#9BA87D',
      secondaryHover: '#ADB892',
      accent: '#B8C89C',
      background: '#1A1F1C', // Deep forest
      backgroundAlt: '#232B26',
      surface: '#2D3832',
      text: '#F0FDF4',
      textMuted: '#C5D9CA',
      border: '#3F5447',
      success: '#7FA87F',
      warning: '#D4A76F',
      error: '#C87F7F',
      info: '#7FA8B8',
    },
  },

  twilight: {
    name: 'Twilight Camp',
    description: 'That magical hour at camp',
    light: {
      primary: '#7C3AED', // Soft purple
      primaryHover: '#6D28D9',
      secondary: '#2563EB', // Dusk blue
      secondaryHover: '#1D4ED8',
      accent: '#F59E0B', // Sunset gold
      background: '#FAF5FF', // Soft lavender white
      backgroundAlt: '#F3E8FF',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    dark: {
      primary: '#A78BFA', // Bright purple
      primaryHover: '#8B5CF6',
      secondary: '#60A5FA',
      secondaryHover: '#93C5FD',
      accent: '#FBBF24',
      background: '#1A1625', // Deep twilight
      backgroundAlt: '#2D2438',
      surface: '#3D3451',
      text: '#F9FAFB',
      textMuted: '#E5E7EB',
      border: '#4C4563',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
  },

  classic: {
    name: 'Classic Scout',
    description: 'Traditional warmth with modern comfort',
    light: {
      primary: '#DC2626', // Warm red
      primaryHover: '#B91C1C',
      secondary: '#1E40AF', // Navy
      secondaryHover: '#1E3A8A',
      accent: '#D97706', // Scout tan
      background: '#FEF7EF', // Warm off-white
      backgroundAlt: '#FEF2E0',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
      border: '#E5E7EB',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0284C7',
    },
    dark: {
      primary: '#F87171', // Bright red
      primaryHover: '#EF4444',
      secondary: '#60A5FA',
      secondaryHover: '#93C5FD',
      accent: '#FBBF24',
      background: '#18181B', // Deep charcoal
      backgroundAlt: '#27272A',
      surface: '#3F3F46',
      text: '#FAFAFA',
      textMuted: '#D4D4D8',
      border: '#52525B',
      success: '#10B981',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#38BDF8',
    },
  },

  sky: {
    name: 'Sky Calm',
    description: 'Clear blue skies and fresh air',
    light: {
      primary: '#3B82F6', // Bright blue
      primaryHover: '#2563EB',
      secondary: '#60A5FA', // Light blue
      secondaryHover: '#3B82F6',
      accent: '#93C5FD', // Pale blue
      background: '#EFF6FF', // Sky wash
      backgroundAlt: '#DBEAFE',
      surface: '#FFFFFF',
      text: '#1E3A8A',
      textMuted: '#3B82F6',
      border: '#BFDBFE',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    dark: {
      primary: '#60A5FA', // Bright sky
      primaryHover: '#3B82F6',
      secondary: '#93C5FD', // Pale blue
      secondaryHover: '#60A5FA',
      accent: '#BFDBFE', // Very pale blue
      background: '#0A1628', // Night sky
      backgroundAlt: '#162447',
      surface: '#1E3A5F',
      text: '#EFF6FF',
      textMuted: '#BFDBFE',
      border: '#2D4A6F',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
  },

  sunset: {
    name: 'Sunset Glow',
    description: 'Warm evening colors as the sun sets',
    light: {
      primary: '#FF6B9D', // Pink sunset
      primaryHover: '#E85A8B',
      secondary: '#FF9A56', // Peach sky
      secondaryHover: '#F08744',
      accent: '#FFD93D', // Golden hour
      background: '#FFF5F7', // Soft pink
      backgroundAlt: '#FFE8ED',
      surface: '#FFFFFF',
      text: '#2D1820',
      textMuted: '#6B5058',
      border: '#E8CFD8',
      success: '#7BCF7B',
      warning: '#FFB84D',
      error: '#FF6B6B',
      info: '#6BB6FF',
    },
    dark: {
      primary: '#FF7FAA', // Bright pink
      primaryHover: '#FF6B9D',
      secondary: '#FFB380', // Warm orange
      secondaryHover: '#FFA56B',
      accent: '#FFE066', // Warm yellow
      background: '#1A0A12', // Deep twilight
      backgroundAlt: '#2D1A24',
      surface: '#3D2833',
      text: '#FFF0F5',
      textMuted: '#D6C0CA',
      border: '#573844',
      success: '#90E690',
      warning: '#FFD280',
      error: '#FF8080',
      info: '#80CAFF',
    },
  },

  ocean: {
    name: 'Ocean Blue',
    description: 'Refreshing waves and clear skies',
    light: {
      primary: '#0EA5E9', // Bright sky blue
      primaryHover: '#0284C7',
      secondary: '#06B6D4', // Cyan water
      secondaryHover: '#0891B2',
      accent: '#10B981', // Sea green
      background: '#F0F9FF', // Light sky
      backgroundAlt: '#E0F2FE',
      surface: '#FFFFFF',
      text: '#0F172A',
      textMuted: '#475569',
      border: '#CBD5E1',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
    },
    dark: {
      primary: '#38BDF8', // Bright blue
      primaryHover: '#0EA5E9',
      secondary: '#22D3EE', // Bright cyan
      secondaryHover: '#06B6D4',
      accent: '#34D399', // Bright sea green
      background: '#0C1821', // Deep ocean
      backgroundAlt: '#162838',
      surface: '#1E3A4F',
      text: '#F0F9FF',
      textMuted: '#BAE6FD',
      border: '#2D5066',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#38BDF8',
    },
  },

  meadow: {
    name: 'Spring Meadow',
    description: 'Fresh grass and wildflowers',
    light: {
      primary: '#84CC16', // Bright lime
      primaryHover: '#65A30D',
      secondary: '#22C55E', // Grass green
      secondaryHover: '#16A34A',
      accent: '#FDE047', // Bright yellow
      background: '#F7FEE7', // Pale lime
      backgroundAlt: '#ECFCCB',
      surface: '#FFFFFF',
      text: '#14532D',
      textMuted: '#4D7C0F',
      border: '#D9F99D',
      success: '#22C55E',
      warning: '#FACC15',
      error: '#EF4444',
      info: '#3B82F6',
    },
    dark: {
      primary: '#A3E635', // Bright lime
      primaryHover: '#84CC16',
      secondary: '#4ADE80', // Bright green
      secondaryHover: '#22C55E',
      accent: '#FEF08A', // Pale yellow
      background: '#0F1F0F', // Dark forest floor
      backgroundAlt: '#1A2E1A',
      surface: '#254025',
      text: '#F7FEE7',
      textMuted: '#BEF264',
      border: '#365F36',
      success: '#4ADE80',
      warning: '#FDE047',
      error: '#F87171',
      info: '#60A5FA',
    },
  },

  sunrise: {
    name: 'Morning Sunrise',
    description: 'Fresh start with warm dawn colors',
    light: {
      primary: '#F59E0B', // Golden sun
      primaryHover: '#D97706',
      secondary: '#FB923C', // Warm orange
      secondaryHover: '#F97316',
      accent: '#FBBF24', // Bright gold
      background: '#FFFBEB', // Pale morning
      backgroundAlt: '#FEF3C7',
      surface: '#FFFFFF',
      text: '#78350F',
      textMuted: '#92400E',
      border: '#FDE68A',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#3B82F6',
    },
    dark: {
      primary: '#FCD34D', // Bright gold
      primaryHover: '#FBBF24',
      secondary: '#FDBA74', // Warm peach
      secondaryHover: '#FB923C',
      accent: '#FEF08A', // Pale yellow
      background: '#1F1708', // Pre-dawn dark
      backgroundAlt: '#2D2410',
      surface: '#3D3418',
      text: '#FFFBEB',
      textMuted: '#FDE68A',
      border: '#524517',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
  },
};

export const highContrastOverrides = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#0000FF',
    border: '#000000',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    primary: '#FFFF00',
    border: '#FFFFFF',
  },
};
