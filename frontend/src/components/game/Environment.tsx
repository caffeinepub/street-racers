import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Environment() {
  const skyTexture = useTexture('/assets/generated/skybox-night.dim_2048x1024.png');

  return (
    <group>
      {/* Sky sphere */}
      <mesh>
        <sphereGeometry args={[300, 32, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          map={skyTexture}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Stadium lights */}
      {[
        [-85, 0, -85], [85, 0, -85], [-85, 0, 85], [85, 0, 85],
      ].map((pos, i) => (
        <group key={`light-${i}`} position={[pos[0], 0, pos[2]]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.6, 18, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 9.5, 0]}>
            <boxGeometry args={[4, 0.5, 1.5]} />
            <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={2} />
          </mesh>
          <pointLight
            position={[0, 10, 0]}
            intensity={80}
            distance={60}
            color="#fffaee"
            castShadow
          />
        </group>
      ))}
    </group>
  );
}
