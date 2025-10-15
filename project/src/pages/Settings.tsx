import React from 'react';
import {
  Type,
  Eye,
  Zap,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const { settings, updateFontSize, updateColorMode, toggleHighContrast, toggleReducedMotion, updateTheme } = useTheme();

  const fontSizes = [
    { value: 'small' as const, label: 'Small', example: '14px' },
    { value: 'medium' as const, label: 'Medium', example: '16px' },
    { value: 'large' as const, label: 'Large', example: '18px' },
    { value: 'xlarge' as const, label: 'Extra Large', example: '20px' },
  ];

  const colorModes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const themes = [
    { value: 'campfire' as const, label: 'Campfire Warm', color: '#d97706' },
    { value: 'forest' as const, label: 'Forest Comfort', color: '#6B8E72' },
    { value: 'twilight' as const, label: 'Twilight Camp', color: '#7C3AED' },
    { value: 'classic' as const, label: 'Classic Scout', color: '#dc2626' },
    { value: 'sky' as const, label: 'Sky Calm', color: '#6B8FA3' },
    { value: 'sunset' as const, label: 'Sunset Glow', color: '#C17A5F' },
  ];

  return (
    <div className="page-container">
      <div className="settings-container">
        <h1 className="section-title">Accessibility Settings</h1>
        <p className="hero-description">
          Customize the platform to work best for you. All settings are saved automatically.
        </p>

        <div className="settings-sections">
          <section className="settings-section">
            <div className="settings-section-header">
              <Type size={24} />
              <h2 className="settings-section-title">Text Size</h2>
            </div>
            <p className="settings-description">
              Choose a comfortable reading size. This affects all text throughout the platform.
            </p>
            <div className="font-size-options">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => updateFontSize(size.value)}
                  className={`font-size-button ${settings.fontSize === size.value ? 'active' : ''}`}
                >
                  <span className="font-size-label">{size.label}</span>
                  <span className="font-size-example" style={{ fontSize: size.example }}>
                    Aa
                  </span>
                  {settings.fontSize === size.value && (
                    <Check size={20} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <div className="settings-section-header">
              <Palette size={24} />
              <h2 className="settings-section-title">Theme</h2>
            </div>
            <p className="settings-description">
              Choose a color theme that you find comfortable and enjoyable.
            </p>
            <div className="theme-options">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateTheme(theme.value)}
                  className={`theme-button ${settings.theme === theme.value ? 'active' : ''}`}
                >
                  <div
                    className="theme-color-preview"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="theme-label">{theme.label}</span>
                  {settings.theme === theme.value && (
                    <Check size={20} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <div className="settings-section-header">
              <Eye size={24} />
              <h2 className="settings-section-title">Appearance</h2>
            </div>
            <p className="settings-description">
              Choose between light mode, dark mode, or let the system decide.
            </p>
            <div className="color-mode-options">
              {colorModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => updateColorMode(mode.value)}
                    className={`color-mode-button ${settings.colorMode === mode.value ? 'active' : ''}`}
                  >
                    <Icon size={24} />
                    <span>{mode.label}</span>
                    {settings.colorMode === mode.value && (
                      <Check size={20} className="check-icon" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="settings-section">
            <div className="settings-section-header">
              <Eye size={24} />
              <h2 className="settings-section-title">Visual Adjustments</h2>
            </div>
            <div className="toggle-options">
              <button
                onClick={toggleHighContrast}
                className={`toggle-option ${settings.highContrast ? 'active' : ''}`}
              >
                <div className="toggle-option-content">
                  <h3 className="toggle-option-title">High Contrast</h3>
                  <p className="toggle-option-description">
                    Increases contrast between text and background for better readability
                  </p>
                </div>
                <div className={`toggle-switch ${settings.highContrast ? 'on' : 'off'}`}>
                  <div className="toggle-slider" />
                </div>
              </button>
            </div>
          </section>

          <section className="settings-section">
            <div className="settings-section-header">
              <Zap size={24} />
              <h2 className="settings-section-title">Motion</h2>
            </div>
            <div className="toggle-options">
              <button
                onClick={toggleReducedMotion}
                className={`toggle-option ${settings.reducedMotion ? 'active' : ''}`}
              >
                <div className="toggle-option-content">
                  <h3 className="toggle-option-title">Reduce Motion</h3>
                  <p className="toggle-option-description">
                    Minimizes animations and transitions throughout the platform
                  </p>
                </div>
                <div className={`toggle-switch ${settings.reducedMotion ? 'on' : 'off'}`}>
                  <div className="toggle-slider" />
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="settings-footer">
          <p className="settings-note">
            <strong>Note:</strong> All settings are saved automatically to your browser and will
            persist across sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
