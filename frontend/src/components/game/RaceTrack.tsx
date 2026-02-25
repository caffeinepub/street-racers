import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { TRACK_WAYPOINTS, TRACK_WIDTH } from './trackData';

function buildTrackGeometry() {
  const points = TRACK_WAYPOINTS.map((p) => new THREE.Vector3(p[0], 0, p[2]));
  points.push(points[0]); // close the loop

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  const halfW = TRACK_WIDTH / 2;
  let totalLength = 0;
  const segLengths: number[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    segLengths.push(points[i].distanceTo(points[i + 1]));
    totalLength += segLengths[i];
  }

  // suppress unused warning
  void totalLength;

  let uvV = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dir = p1.clone().sub(p0).normalize();
    const right = new THREE.Vector3(-dir.z, 0, dir.x);

    const l0 = p0.clone().addScaledVector(right, -halfW);
    const r0 = p0.clone().addScaledVector(right, halfW);
    const l1 = p1.clone().addScaledVector(right, -halfW);
    const r1 = p1.clone().addScaledVector(right, halfW);

    const base = i * 4;
    positions.push(l0.x, 0, l0.z, r0.x, 0, r0.z, l1.x, 0, l1.z, r1.x, 0, r1.z);
    normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);

    const uvV1 = uvV + segLengths[i] / TRACK_WIDTH;
    uvs.push(0, uvV, 1, uvV, 0, uvV1, 1, uvV1);
    uvV = uvV1;

    indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

function buildBarriers() {
  const points = TRACK_WAYPOINTS.map((p) => new THREE.Vector3(p[0], 0, p[2]));
  points.push(points[0]);
  const halfW = TRACK_WIDTH / 2 + 1.5;
  const barriers: { pos: THREE.Vector3; rot: number; len: number }[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dir = p1.clone().sub(p0).normalize();
    const right = new THREE.Vector3(-dir.z, 0, dir.x);
    const mid = p0.clone().add(p1).multiplyScalar(0.5);
    const len = p0.distanceTo(p1);
    const angle = Math.atan2(dir.x, dir.z);

    barriers.push(
      { pos: mid.clone().addScaledVector(right, -halfW), rot: angle, len },
      { pos: mid.clone().addScaledVector(right, halfW), rot: angle, len }
    );
  }
  return barriers;
}

export default function RaceTrack() {
  const trackGeo = useMemo(() => buildTrackGeometry(), []);
  const barriers = useMemo(() => buildBarriers(), []);

  // Always call hooks unconditionally at the top level
  const [trackTexture, terrainTexture] = useTexture([
    '/assets/generated/track-texture.dim_512x512.png',
    '/assets/generated/terrain-texture.dim_512x512.png',
  ]);

  // Configure texture wrapping
  if (trackTexture) {
    trackTexture.wrapS = trackTexture.wrapT = THREE.RepeatWrapping;
    trackTexture.repeat.set(1, 4);
  }
  if (terrainTexture) {
    terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
    terrainTexture.repeat.set(20, 20);
  }

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial
          color="#2d5a1b"
          map={terrainTexture}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Track surface */}
      <mesh geometry={trackGeo} receiveShadow position={[0, 0.01, 0]}>
        <meshStandardMaterial
          color="#333333"
          map={trackTexture}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Start/Finish line */}
      <mesh position={[0, 0.03, -80]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_WIDTH, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Barriers */}
      {barriers.map((b, i) => (
        <mesh
          key={i}
          position={[b.pos.x, 0.5, b.pos.z]}
          rotation={[0, b.rot, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b.len, 1.0, 0.4]} />
          <meshStandardMaterial
            color={i % 4 < 2 ? '#cc0000' : '#ffffff'}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Track markings - center dashes */}
      {TRACK_WAYPOINTS.map((wp, i) => {
        const next = TRACK_WAYPOINTS[(i + 1) % TRACK_WAYPOINTS.length];
        const mid = [(wp[0] + next[0]) / 2, 0.03, (wp[2] + next[2]) / 2] as [number, number, number];
        const dir = new THREE.Vector3(next[0] - wp[0], 0, next[2] - wp[2]).normalize();
        const angle = Math.atan2(dir.x, dir.z);
        return (
          <mesh key={`mark-${i}`} position={mid} rotation={[-Math.PI / 2, 0, -angle]}>
            <planeGeometry args={[0.3, 3]} />
            <meshStandardMaterial color="#ffff00" />
          </mesh>
        );
      })}

      {/* Grandstands */}
      {[
        { pos: [0, 0, -100] as [number, number, number], rot: 0 },
        { pos: [0, 0, 100] as [number, number, number], rot: Math.PI },
        { pos: [95, 0, 0] as [number, number, number], rot: -Math.PI / 2 },
        { pos: [-95, 0, 0] as [number, number, number], rot: Math.PI / 2 },
      ].map((gs, i) => (
        <group key={`gs-${i}`} position={gs.pos} rotation={[0, gs.rot, 0]}>
          <mesh castShadow position={[0, 3, 0]}>
            <boxGeometry args={[30, 6, 8]} />
            <meshStandardMaterial color="#555566" roughness={0.8} />
          </mesh>
          <mesh position={[0, 6.5, -2]}>
            <boxGeometry args={[30, 1, 0.3]} />
            <meshStandardMaterial color="#cc2200" />
          </mesh>
        </group>
      ))}

      {/* Trees */}
      {[
        [-30, 0, -95], [30, 0, -95], [-30, 0, 95], [30, 0, 95],
        [-95, 0, -30], [-95, 0, 30], [95, 0, -30], [95, 0, 30],
        [-60, 0, -90], [60, 0, -90], [-60, 0, 90], [60, 0, 90],
        [-90, 0, -60], [-90, 0, 60], [90, 0, -60], [90, 0, 60],
      ].map((t, i) => (
        <group key={`tree-${i}`} position={[t[0], 0, t[2]]}>
          <mesh castShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 4, 6]} />
            <meshStandardMaterial color="#5c3d1e" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 5.5, 0]}>
            <coneGeometry args={[2.5, 5, 7]} />
            <meshStandardMaterial color="#1a5c1a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
