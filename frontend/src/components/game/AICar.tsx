import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Car from './Car';
import { CarConfig } from '../../types/car';
import { TRACK_WAYPOINTS } from './trackData';

interface AICarProps {
  config: CarConfig;
  startPosition: [number, number, number];
  startRotation?: number;
  carRef: React.RefObject<THREE.Group>;
  onPositionUpdate?: (pos: THREE.Vector3) => void;
  raceStarted: boolean;
  difficulty?: number; // 0-1
  startOffset?: number; // waypoint offset to stagger start
}

export default function AICar({
  config,
  startPosition,
  startRotation = 0,
  carRef,
  onPositionUpdate,
  raceStarted,
  difficulty = 0.75,
  startOffset = 0,
}: AICarProps) {
  const velocity = useRef(0);
  const rotationY = useRef(startRotation);
  const positionRef = useRef(new THREE.Vector3(...startPosition));
  const currentWpIdx = useRef(startOffset % TRACK_WAYPOINTS.length);

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

    const dt = Math.min(delta, 0.05);
    const targetSpeed = config.maxSpeed * difficulty;

    // Get current target waypoint
    const wpIdx = currentWpIdx.current;
    const wp = TRACK_WAYPOINTS[wpIdx];
    const target = new THREE.Vector3(wp[0], 0, wp[2]);
    const current = new THREE.Vector3(positionRef.current.x, 0, positionRef.current.z);
    const dist = current.distanceTo(target);

    // Advance waypoint
    if (dist < 10) {
      currentWpIdx.current = (wpIdx + 1) % TRACK_WAYPOINTS.length;
    }

    // Steer toward waypoint
    const toTarget = target.clone().sub(current).normalize();
    const targetAngle = Math.atan2(toTarget.x, toTarget.z);
    let angleDiff = targetAngle - rotationY.current;

    // Normalize angle
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const steerStrength = config.turnSpeed * 1.5;
    rotationY.current += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), steerStrength * dt);

    // Speed control - slow down on sharp turns
    const turnFactor = 1 - Math.min(Math.abs(angleDiff) / Math.PI, 1) * 0.5;
    const desiredSpeed = targetSpeed * turnFactor;

    if (velocity.current < desiredSpeed) {
      velocity.current = Math.min(velocity.current + config.accelForce * dt, desiredSpeed);
    } else {
      velocity.current = Math.max(velocity.current - config.brakeForce * dt, desiredSpeed);
    }

    // Move
    const dir = new THREE.Vector3(
      Math.sin(rotationY.current),
      0,
      Math.cos(rotationY.current)
    );
    positionRef.current.addScaledVector(dir, velocity.current * dt);
    positionRef.current.y = 0.5;

    carRef.current.position.copy(positionRef.current);
    carRef.current.rotation.y = rotationY.current;

    onPositionUpdate?.(positionRef.current.clone());
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
