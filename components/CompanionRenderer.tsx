/**
 * CompanionRenderer - Dynamic companion renderer using plugin system
 *
 * This component automatically uses the active companion plugin.
 * Defaults to 2D AnimalCompanion if no plugin is registered.
 */

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import AnimalCompanion from './AnimalCompanion';
import {
  getActiveCompanionPlugin,
  CompanionPlugin,
  CompanionPluginProps,
} from '@/lib/companionPlugin';

export default function CompanionRenderer(props: CompanionPluginProps) {
  const [activePlugin, setActivePlugin] = useState<CompanionPlugin | null>(null);

  useEffect(() => {
    // Get the currently active plugin
    const plugin = getActiveCompanionPlugin();
    setActivePlugin(plugin);
  }, []);

  // If a plugin is registered, use it
  if (activePlugin) {
    const PluginComponent = activePlugin.component;
    return <PluginComponent {...props} />;
  }

  // Fallback to default 2D AnimalCompanion
  // Convert emotion string to proper type
  const emotionType = typeof props.emotion === 'string'
    ? props.emotion as 'idle' | 'listening' | 'speaking' | 'happy' | 'concerned' | 'excited' | 'thinking'
    : props.emotion.type;

  return (
    <View>
      <AnimalCompanion
        animalType={props.animalType as 'cat' | 'dog' | 'bird' | 'bunny'}
        emotion={emotionType}
        size={props.size}
        onPress={props.onPress}
      />
    </View>
  );
}
