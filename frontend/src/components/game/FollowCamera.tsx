import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FollowCameraProps {
  target: React.RefObject<THREE.Group>;
  offset?: [number, number, number];
}

const _camPos = new THREE.Vector3();
const _lookAt = new THREE.Vector3();

export default function FollowCamera({ target, offset = [0, 5, -12] }: FollowCameraProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (!target.current) return;

    const car = target.current;
    const carPos = car.position;
    const carRot = car.rotation.y;

    // Compute desired camera position behind the car
    const ox = offset[0];
    const oy = offset[1];
    const oz = offset[2];

    const sinR = Math.sin(carRot);
    const cosR = Math.cos(carRot);

    const worldOffsetX = sinR * oz + cosR * ox;
    const worldOffsetZ = cosR * oz - sinR * ox;

    _camPos.set(
      carPos.x + worldOffsetX,
      carPos.y + oy,
      carPos.z + worldOffsetZ
    );

    // Smooth follow
    camera.position.lerp(_camPos, 0.1);

    // Look slightly ahead of the car
    _lookAt.set(
      carPos.x + sinR * 5,
      carPos.y + 1.5,
      carPos.z + cosR * 5
    );
    camera.lookAt(_lookAt);
  });

  return null;
}
