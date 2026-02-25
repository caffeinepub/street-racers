import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Car from './Car';
import { CarConfig } from '../../types/car';
import { Controls } from '../../hooks/useKeyboardControls';
import { TRACK_WAYPOINTS } from './trackData';

interface PlayerCarProps {
  config: CarConfig;
  startPosition: [number, number, number];
  startRotation?: number;
  controlsRef: React.RefObject<Controls>;
  carRef: React.RefObject<THREE.Group>;
  onPositionUpdate?: (pos: THREE.Vector3) => void;
  onSpeedUpdate?: (speed: number) => void;
  raceStarted: boolean;
}

export default function PlayerCar({
  config,
  startPosition,
  startRotation = 0,
  controlsRef,
  carRef,
  onPositionUpdate,
  onSpeedUpdate,
  raceStarted,
}: PlayerCarProps) {
  const velocity = useRef(0);
  const rotationY = useRef(startRotation);
  const positionRef = useRef(new THREE.Vector3(...startPosition));
  const wheelRotation = useRef(0);

  useEffect(() => {
    positionRef.current.set(...startPosition);
    rotationY.current = startRotation;
    velocity.current = 0;
    if (carRef.current) {
      carRef.current.position.set(...startPosition);
      carRef.current.rotation.y = startRotation;
    }
  }, []);

  useFrame((_, delta) => {
    if (!carRef.current || !raceStarted) return;

    const ctrl = controlsRef.current;
    const dt = Math.min(delta, 0.05);

    // Acceleration / braking
    if (ctrl.forward) {
      velocity.current = Math.min(velocity.current + config.accelForce * dt, config.maxSpeed);
    } else if (ctrl.backward) {
      velocity.current = Math.max(velocity.current - config.accelForce * 0.7 * dt, -config.maxSpeed * 0.4);
    } else {
      // Natural deceleration
      velocity.current *= 0.97;
      if (Math.abs(velocity.current) < 0.05) velocity.current = 0;
    }

    if (ctrl.brake) {
      velocity.current *= 0.92;
    }

    // Steering (only when moving)
    const speedFactor = Math.abs(velocity.current) / config.maxSpeed;
    const turnAmount = config.turnSpeed * dt * speedFactor * (velocity.current >= 0 ? 1 : -1);

    if (ctrl.left) {
      rotationY.current += turnAmount;
    }
    if (ctrl.right) {
      rotationY.current -= turnAmount;
    }

    // Move forward in facing direction
    const dir = new THREE.Vector3(
      Math.sin(rotationY.current),
      0,
      Math.cos(rotationY.current)
    );
    positionRef.current.addScaledVector(dir, velocity.current * dt);
    positionRef.current.y = 0.5;

    // Wheel spin animation
    wheelRotation.current += velocity.current * dt * 2;

    // Apply to mesh
    carRef.current.position.copy(positionRef.current);
    carRef.current.rotation.y = rotationY.current;

    // Animate wheels
    const wheels = [
      carRef.current.children.find((_, i) => i >= 10 && i <= 13),
    ];
    // Simple wheel spin via group children
    carRef.current.traverse((child) => {
      if (child.name === 'wheel') {
        (child as THREE.Mesh).rotation.x = wheelRotation.current;
      }
    });

    onPositionUpdate?.(positionRef.current.clone());
    onSpeedUpdate?.(Math.abs(velocity.current) * 3.6); // convert to km/h approx
  });

  return (
    <Car
      config={config}
      position={startPosition}
      rotation={startRotation}
      groupRef={carRef}
    />
  );
}
