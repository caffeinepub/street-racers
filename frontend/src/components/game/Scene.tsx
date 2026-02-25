import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RaceTrack from './RaceTrack';
import Environment from './Environment';

interface SceneProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Scene({ children, style }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ fov: 65, near: 0.5, far: 600, position: [0, 8, -20] }}
      style={{ background: '#0a0a1a', ...style }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.4} color="#334466" />
        <directionalLight
          position={[50, 80, 30]}
          intensity={1.8}
          color="#fffaee"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={300}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
        />
        <hemisphereLight args={['#334466', '#1a2a0a', 0.5]} />

        <Environment />
        <RaceTrack />
        {children}
      </Suspense>
    </Canvas>
  );
}
