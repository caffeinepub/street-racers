import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { CarConfig } from '../../types/car';

interface CarProps {
  config: CarConfig;
  position?: [number, number, number];
  rotation?: number;
  groupRef?: React.RefObject<THREE.Group>;
}

export default function Car({ config, position = [0, 0, 0], rotation = 0, groupRef }: CarProps) {
  const internalRef = useRef<THREE.Group>(null);
  const ref = groupRef || internalRef;

  const bodyColor = useMemo(() => new THREE.Color(config.color), [config.color]);
  const accentColor = useMemo(() => new THREE.Color(config.accentColor), [config.accentColor]);
  const wheelColor = new THREE.Color('#1a1a1a');
  const rimColor = new THREE.Color('#888888');
  const glassColor = new THREE.Color('#88ccff');
  const lightColor = new THREE.Color('#ffee88');
  const tailLightColor = new THREE.Color('#ff2200');

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.8, 0.45, 4.2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cabin / roof */}
      <mesh castShadow position={[0, 0.78, 0.2]}>
        <boxGeometry args={[1.5, 0.42, 2.2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.78, 1.35]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.3, 0.38, 0.05]} />
        <meshStandardMaterial color={glassColor} transparent opacity={0.6} metalness={0.1} roughness={0.05} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.78, -0.95]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.3, 0.38, 0.05]} />
        <meshStandardMaterial color={glassColor} transparent opacity={0.6} metalness={0.1} roughness={0.05} />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 0.6, 1.8]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[1.75, 0.08, 1.2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Trunk */}
      <mesh castShadow position={[0, 0.6, -1.8]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[1.75, 0.08, 1.0]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Spoiler */}
      <mesh castShadow position={[0, 0.85, -2.0]}>
        <boxGeometry args={[1.6, 0.06, 0.35]} />
        <meshStandardMaterial color={accentColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Spoiler supports */}
      <mesh position={[-0.6, 0.72, -2.0]}>
        <boxGeometry args={[0.06, 0.22, 0.06]} />
        <meshStandardMaterial color={accentColor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 0.72, -2.0]}>
        <boxGeometry args={[0.06, 0.22, 0.06]} />
        <meshStandardMaterial color={accentColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Front bumper */}
      <mesh castShadow position={[0, 0.22, 2.2]}>
        <boxGeometry args={[1.8, 0.28, 0.15]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Rear bumper */}
      <mesh castShadow position={[0, 0.22, -2.2]}>
        <boxGeometry args={[1.8, 0.28, 0.15]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.55, 0.38, 2.28]}>
        <boxGeometry args={[0.4, 0.14, 0.05]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.55, 0.38, 2.28]}>
        <boxGeometry args={[0.4, 0.14, 0.05]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={1.5} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.55, 0.38, -2.28]}>
        <boxGeometry args={[0.4, 0.14, 0.05]} />
        <meshStandardMaterial color={tailLightColor} emissive={tailLightColor} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.55, 0.38, -2.28]}>
        <boxGeometry args={[0.4, 0.14, 0.05]} />
        <meshStandardMaterial color={tailLightColor} emissive={tailLightColor} emissiveIntensity={1.5} />
      </mesh>

      {/* Side skirts */}
      <mesh position={[-0.92, 0.18, 0]}>
        <boxGeometry args={[0.06, 0.12, 3.6]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.92, 0.18, 0]}>
        <boxGeometry args={[0.06, 0.12, 3.6]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Wheels - Front Left */}
      <group position={[-0.95, 0.28, 1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
          <meshStandardMaterial color={wheelColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
          <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Wheels - Front Right */}
      <group position={[0.95, 0.28, 1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
          <meshStandardMaterial color={wheelColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
          <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Wheels - Rear Left */}
      <group position={[-0.95, 0.28, -1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
          <meshStandardMaterial color={wheelColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
          <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Wheels - Rear Right */}
      <group position={[0.95, 0.28, -1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
          <meshStandardMaterial color={wheelColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
          <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
