# Adding a 3D Companion Plugin

Your app now has a plugin system that allows external 3D companion implementations!

## Quick Start

### 1. Install 3D Dependencies

For Three.js + React Three Fiber:
```bash
npm install three @react-three/fiber @react-three/drei
npm install @types/three --save-dev
```

For other 3D libraries, install according to their documentation.

### 2. Create Your 3D Companion Component

Create a file like `components/ThreeJSCompanion.tsx`:

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { CompanionPluginProps } from '@/lib/companionPlugin';

export default function ThreeJSCompanion(props: CompanionPluginProps) {
  const { animalType, emotion, size } = props;

  return (
    <Canvas style={{ width: size, height: size }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      {/* Your 3D model here */}
      <Animal3DModel
        type={animalType}
        emotion={emotion}
        {...props}
      />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

function Animal3DModel({ type, emotion, ...props }: any) {
  // Load your 3D model
  const { scene } = useGLTF(`/models/${type}.glb`);

  // Apply emotion-based animations
  // Your animation logic here

  return <primitive object={scene} {...props} />;
}
```

### 3. Register Your Plugin

In your `app/_layout.tsx` or component initialization:

```typescript
import { registerCompanionPlugin } from '@/lib/companionPlugin';
import ThreeJSCompanion from '@/components/ThreeJSCompanion';

// Register your 3D companion
registerCompanionPlugin({
  id: 'threejs-companion',
  name: '3D Companion (Three.js)',
  description: 'Fully animated 3D companion using Three.js',
  component: ThreeJSCompanion,
  requires3D: true,
  supportedAnimals: ['cat', 'dog', 'bird', 'bunny'],
});
```

### 4. Replace AnimalCompanion with CompanionRenderer

Update your companion screens to use `CompanionRenderer`:

```typescript
import CompanionRenderer from '@/components/CompanionRenderer';

// In your component:
<CompanionRenderer
  animalType="cat"
  emotion="happy"
  size={140}
  onPress={() => console.log('Companion tapped!')}
/>
```

## Plugin API

### CompanionPluginProps

Your component receives these props:

```typescript
{
  animalType: 'cat' | 'dog' | 'bird' | 'bunny' | string;
  emotion: CompanionEmotion | string;
  size: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  onPress?: () => void;
  animationSpeed?: number;
  environment?: {
    theme: string;
    lighting: string;
    ambientColor: string;
  };
}
```

### Emotions

Handle these emotion states:
- `idle` - Resting/breathing animation
- `listening` - Active listening state
- `speaking` - Talking/responding
- `happy` - Joyful expression
- `concerned` - Supportive/caring
- `excited` - Energetic celebration
- `thinking` - Contemplative state

### Emotion Intensity

For advanced implementations:
```typescript
const emotion = {
  type: 'happy',
  intensity: 0.8 // 0-1, where 1 is maximum
};
```

## Example: Unity WebGL Companion

### 1. Export Unity Project as WebGL

In Unity:
- Build Settings → WebGL
- Player Settings → Compression Format: Disabled
- Build your companion scene

### 2. Create Unity Wrapper Component

```typescript
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { CompanionPluginProps } from '@/lib/companionPlugin';

export default function UnityCompanion(props: CompanionPluginProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unityInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Unity
    const script = document.createElement('script');
    script.src = '/unity/Build/UnityLoader.js';
    script.onload = () => {
      // @ts-ignore
      unityInstanceRef.current = UnityLoader.instantiate(
        containerRef.current,
        '/unity/Build/companion.json'
      );
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (unityInstanceRef.current) {
        unityInstanceRef.current.Quit();
      }
    };
  }, []);

  // Send emotion changes to Unity
  useEffect(() => {
    if (unityInstanceRef.current) {
      unityInstanceRef.current.SendMessage(
        'CompanionController',
        'SetEmotion',
        props.emotion
      );
    }
  }, [props.emotion]);

  return (
    <View style={{ width: props.size, height: props.size }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}
```

### 3. Register Unity Plugin

```typescript
registerCompanionPlugin({
  id: 'unity-companion',
  name: '3D Companion (Unity)',
  description: 'High-quality 3D companion built in Unity',
  component: UnityCompanion,
  requires3D: true,
});
```

## Multiple Plugins

You can register multiple plugins and let users choose:

```typescript
// In settings screen
import { getAllCompanionPlugins, setActiveCompanionPlugin } from '@/lib/companionPlugin';

const plugins = getAllCompanionPlugins();

// Show list of plugins
plugins.forEach(plugin => {
  console.log(plugin.name, plugin.description);
});

// User selects one
setActiveCompanionPlugin('threejs-companion');
```

## Testing Your Plugin

1. Check if 3D is supported:
```typescript
import { is3DSupported } from '@/lib/companionPlugin';

if (is3DSupported()) {
  console.log('3D is available!');
}
```

2. Test emotions:
```typescript
const emotions = ['idle', 'listening', 'speaking', 'happy', 'concerned', 'excited'];

emotions.forEach(emotion => {
  // Your companion should smoothly transition between emotions
});
```

3. Test interactions:
```typescript
<CompanionRenderer
  animalType="cat"
  emotion="idle"
  size={140}
  onPress={() => {
    // Should trigger animation or response
    console.log('Companion clicked!');
  }}
/>
```

## Performance Tips

1. **Lazy load 3D assets**: Only load when needed
2. **Reduce polygon count**: Keep models under 10k triangles
3. **Use texture atlases**: Combine textures to reduce draw calls
4. **Limit animations**: Use bone-based animations, avoid blend shapes
5. **Test on mobile**: Ensure 60fps on low-end devices

## Community Plugins

Share your plugins! Create a repo with:
- Your companion component
- Required 3D assets
- Installation instructions
- Registration code

Users can then:
```bash
npm install your-companion-plugin
```

And register it in their app.

## Need Help?

- Check `/lib/companionPlugin.ts` for full API
- Look at `AnimalCompanion.tsx` for 2D reference
- Test with `CompanionRenderer` before deploying

Happy building! 🎨
