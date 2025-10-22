/**
 * Companion Plugin System
 *
 * This framework allows external 3D companion implementations to be plugged in.
 *
 * To add a 3D companion:
 * 1. Create a component that implements CompanionPluginComponent interface
 * 2. Register it with registerCompanionPlugin()
 * 3. The app will automatically use it if enabled
 *
 * Example:
 * ```typescript
 * import { registerCompanionPlugin } from '@/lib/companionPlugin';
 * import My3DCompanion from './My3DCompanion';
 *
 * registerCompanionPlugin({
 *   id: 'three-js-companion',
 *   name: '3D Companion (Three.js)',
 *   component: My3DCompanion,
 *   requires3D: true,
 * });
 * ```
 */

import React from 'react';

export interface CompanionEmotion {
  type: 'idle' | 'listening' | 'speaking' | 'happy' | 'concerned' | 'excited' | 'thinking';
  intensity?: number; // 0-1, for subtle vs intense emotions
}

export interface CompanionPluginProps {
  // Animal type
  animalType: 'cat' | 'dog' | 'bird' | 'bunny' | string;

  // Current emotion
  emotion: CompanionEmotion | string;

  // Size in pixels
  size: number;

  // Colors for customization
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Interaction callback
  onPress?: () => void;

  // Animation settings
  animationSpeed?: number;

  // Environment context (for lighting, shadows, etc.)
  environment?: {
    theme: string;
    lighting: string;
    ambientColor: string;
  };
}

export interface CompanionPluginComponent {
  // The React component
  (props: CompanionPluginProps): React.ReactElement;
}

export interface CompanionPlugin {
  // Unique identifier
  id: string;

  // Display name
  name: string;

  // Description
  description?: string;

  // The component to render
  component: CompanionPluginComponent;

  // Does this require 3D capabilities?
  requires3D?: boolean;

  // Minimum version requirements
  minVersion?: string;

  // Supported animal types (if limited)
  supportedAnimals?: string[];

  // Custom settings/config
  settings?: Record<string, any>;
}

// Plugin registry
const plugins: Map<string, CompanionPlugin> = new Map();

// Default/fallback plugin ID
let defaultPluginId: string | null = null;

/**
 * Register a companion plugin
 */
export function registerCompanionPlugin(plugin: CompanionPlugin): void {
  if (plugins.has(plugin.id)) {
    console.warn(`[CompanionPlugin] Plugin "${plugin.id}" already registered. Overwriting.`);
  }

  plugins.set(plugin.id, plugin);
  console.log(`[CompanionPlugin] Registered: ${plugin.name} (${plugin.id})`);

  // If this is the first plugin, make it default
  if (!defaultPluginId) {
    defaultPluginId = plugin.id;
  }
}

/**
 * Get a plugin by ID
 */
export function getCompanionPlugin(pluginId: string): CompanionPlugin | null {
  return plugins.get(pluginId) || null;
}

/**
 * Get all registered plugins
 */
export function getAllCompanionPlugins(): CompanionPlugin[] {
  return Array.from(plugins.values());
}

/**
 * Get the default/active plugin
 */
export function getActiveCompanionPlugin(): CompanionPlugin | null {
  if (!defaultPluginId) return null;
  return plugins.get(defaultPluginId) || null;
}

/**
 * Set the active plugin
 */
export function setActiveCompanionPlugin(pluginId: string): boolean {
  if (!plugins.has(pluginId)) {
    console.error(`[CompanionPlugin] Plugin "${pluginId}" not found`);
    return false;
  }

  defaultPluginId = pluginId;
  console.log(`[CompanionPlugin] Active plugin set to: ${pluginId}`);
  return true;
}

/**
 * Unregister a plugin
 */
export function unregisterCompanionPlugin(pluginId: string): boolean {
  const existed = plugins.delete(pluginId);

  if (existed) {
    console.log(`[CompanionPlugin] Unregistered: ${pluginId}`);

    // If this was the active plugin, reset to first available
    if (defaultPluginId === pluginId) {
      const firstPlugin = plugins.keys().next();
      defaultPluginId = firstPlugin.done ? null : firstPlugin.value;
    }
  }

  return existed;
}

/**
 * Check if 3D is supported
 */
export function is3DSupported(): boolean {
  // Check for WebGL support
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch (e) {
    return false;
  }
}

/**
 * Get compatible plugins for current environment
 */
export function getCompatiblePlugins(): CompanionPlugin[] {
  const has3D = is3DSupported();

  return Array.from(plugins.values()).filter(plugin => {
    // If plugin requires 3D but we don't have it, exclude
    if (plugin.requires3D && !has3D) {
      return false;
    }

    return true;
  });
}
