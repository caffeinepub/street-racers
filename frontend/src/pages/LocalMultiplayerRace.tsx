import { useRef, useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RaceTrack from '../components/game/RaceTrack';
import Environment from '../components/game/Environment';
import PlayerCar from '../components/game/PlayerCar';
import AICar from '../components/game/AICar';
import FollowCamera from '../components/game/FollowCamera';
import HUD from '../components/game/HUD';
import CountdownOverlay from '../components/game/CountdownOverlay';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useKeyboardControlsP2 } from '../hooks/useKeyboardControlsP2';
import { useRaceLogic } from '../hooks/useRaceLogic';
import { useGameContext } from '../context/GameContext';
import { CAR_CONFIGS, CarConfig } from '../types/car';
import { TRACK_WAYPOINTS } from '../components/game/trackData';
import { Controls } from '../hooks/useKeyboardControls';

const AI_CARS = [
  { id: 'ai1', carIdx: 0, difficulty: 0.7, startOffset: 3 },
];

const TOTAL_LAPS = 3;

function getStartPos(index: number): [number, number, number] {
  const wp = TRACK_WAYPOINTS[0];
  const next = TRACK_WAYPOINTS[1];
  const dir = new THREE.Vector3(next[0] - wp[0], 0, next[2] - wp[2]).normalize();
  const right = new THREE.Vector3(-dir.z, 0, dir.x);
  const offsets = [-3, 3, 0];
  const offset = right.clone().multiplyScalar(offsets[index] || 0);
  return [wp[0] + offset.x, 0.5, wp[2] + offset.z];
}

function getStartRotation(): number {
  const wp = TRACK_WAYPOINTS[0];
  const next = TRACK_WAYPOINTS[1];
  return Math.atan2(next[0] - wp[0], next[2] - wp[2]);
}

interface RaceSceneProps {
  p1CarRef: React.RefObject<THREE.Group>;
  p2CarRef: React.RefObject<THREE.Group>;
  aiCarRefs: React.MutableRefObject<React.RefObject<THREE.Group>[]>;
  p1Controls: React.RefObject<Controls>;
  p2Controls: React.RefObject<Controls>;
  raceStarted: boolean;
  onP1Pos: (pos: THREE.Vector3) => void;
  onP2Pos: (pos: THREE.Vector3) => void;
  onAIPos: (id: string) => (pos: THREE.Vector3) => void;
  onP1Speed: (s: number) => void;
  onP2Speed: (s: number) => void;
  followTarget: React.RefObject<THREE.Group>;
  selectedCar: CarConfig;
  selectedCarP2: CarConfig;
}

function RaceScene({
  p1CarRef,
  p2CarRef,
  aiCarRefs,
  p1Controls,
  p2Controls,
  raceStarted,
  onP1Pos,
  onP2Pos,
  onAIPos,
  onP1Speed,
  onP2Speed,
  followTarget,
  selectedCar,
  selectedCarP2,
}: RaceSceneProps) {
  const startRot = getStartRotation();
  return (
    <>
      <ambientLight intensity={0.4} color="#334466" />
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.8}
        color="#fffaee"
        castShadow
        shadow-mapSize={[1024, 1024]}
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
      <PlayerCar
        config={selectedCar}
        startPosition={getStartPos(0)}
        startRotation={startRot}
        controlsRef={p1Controls}
        carRef={p1CarRef}
        onPositionUpdate={onP1Pos}
        onSpeedUpdate={onP1Speed}
        raceStarted={raceStarted}
      />
      <PlayerCar
        config={selectedCarP2}
        startPosition={getStartPos(1)}
        startRotation={startRot}
        controlsRef={p2Controls}
        carRef={p2CarRef}
        onPositionUpdate={onP2Pos}
        onSpeedUpdate={onP2Speed}
        raceStarted={raceStarted}
      />
      {AI_CARS.map((ai, i) => (
        <AICar
          key={ai.id}
          config={CAR_CONFIGS[ai.carIdx]}
          startPosition={getStartPos(i + 2)}
          startRotation={startRot}
          carRef={aiCarRefs.current[i]}
          onPositionUpdate={onAIPos(ai.id)}
          raceStarted={raceStarted}
          difficulty={ai.difficulty}
          startOffset={ai.startOffset}
        />
      ))}
      <FollowCamera target={followTarget} />
    </>
  );
}

export default function LocalMultiplayerRace() {
  const navigate = useNavigate();
  const { selectedCar, selectedCarP2, setRaceResults } = useGameContext();
  const p1Controls = useKeyboardControls();
  const p2Controls = useKeyboardControlsP2();

  const p1CarRef = useRef<THREE.Group>(null!);
  const p2CarRef = useRef<THREE.Group>(null!);

  // Store refs properly as RefObjects
  const aiCarRefs = useRef<React.RefObject<THREE.Group>[]>(
    AI_CARS.map(() => ({ current: null! }))
  );

  const [raceStarted, setRaceStarted] = useState(false);
  const [p1Speed, setP1Speed] = useState(0);
  const [p2Speed, setP2Speed] = useState(0);

  const carIds = ['p1', 'p2', ...AI_CARS.map((a) => a.id)];
  const { raceState, startRace, updateCarPosition } = useRaceLogic(carIds, TOTAL_LAPS);

  const handleCountdownComplete = useCallback(() => {
    setRaceStarted(true);
    startRace();
  }, [startRace]);

  const handleP1Pos = useCallback(
    (pos: THREE.Vector3) => updateCarPosition('p1', pos),
    [updateCarPosition]
  );
  const handleP2Pos = useCallback(
    (pos: THREE.Vector3) => updateCarPosition('p2', pos),
    [updateCarPosition]
  );
  const handleAIPos = useCallback(
    (id: string) => (pos: THREE.Vector3) => updateCarPosition(id, pos),
    [updateCarPosition]
  );

  const p1State = raceState.cars['p1'];
  const p2State = raceState.cars['p2'];

  if (raceState.finished) {
    const results = Object.values(raceState.cars)
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        playerName:
          c.id === 'p1' ? 'Player 1' : c.id === 'p2' ? 'Player 2' : `AI ${c.id.replace('ai', '')}`,
        car:
          c.id === 'p1'
            ? selectedCar
            : c.id === 'p2'
            ? selectedCarP2
            : CAR_CONFIGS[AI_CARS.find((a) => a.id === c.id)?.carIdx || 0],
        position: c.position,
        bestLapTime: c.bestLapTime === Infinity ? 0 : c.bestLapTime,
        totalTime: c.finishTime,
        mode: 'multiplayer' as const,
      }));
    setRaceResults(results);
    navigate({ to: '/race/finish' });
  }

  const sharedCanvasProps = {
    shadows: true,
    camera: {
      fov: 65,
      near: 0.5,
      far: 600,
      position: [0, 8, -20] as [number, number, number],
    },
    gl: { antialias: true, powerPreference: 'high-performance' as const },
    style: { background: '#0a0a1a', width: '100%', height: '100%' },
  };

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Player 1 viewport - top half */}
      <div className="relative flex-1 border-b-2 border-neon-red/50">
        <Canvas {...sharedCanvasProps}>
          <Suspense fallback={null}>
            <RaceScene
              p1CarRef={p1CarRef}
              p2CarRef={p2CarRef}
              aiCarRefs={aiCarRefs}
              p1Controls={p1Controls}
              p2Controls={p2Controls}
              raceStarted={raceStarted}
              onP1Pos={handleP1Pos}
              onP2Pos={handleP2Pos}
              onAIPos={handleAIPos}
              onP1Speed={setP1Speed}
              onP2Speed={setP2Speed}
              followTarget={p1CarRef}
              selectedCar={selectedCar}
              selectedCarP2={selectedCarP2}
            />
          </Suspense>
        </Canvas>
        {p1State && (
          <HUD
            speed={p1Speed}
            currentLap={p1State.lap}
            totalLaps={TOTAL_LAPS}
            position={p1State.position || 1}
            totalCars={carIds.length}
            elapsed={raceState.elapsed}
            bestLap={p1State.bestLapTime === Infinity ? 0 : p1State.bestLapTime}
            player="PLAYER 1 · WASD"
          />
        )}
      </div>

      {/* Player 2 viewport - bottom half */}
      <div className="relative flex-1">
        <Canvas {...sharedCanvasProps}>
          <Suspense fallback={null}>
            <RaceScene
              p1CarRef={p1CarRef}
              p2CarRef={p2CarRef}
              aiCarRefs={aiCarRefs}
              p1Controls={p1Controls}
              p2Controls={p2Controls}
              raceStarted={raceStarted}
              onP1Pos={handleP1Pos}
              onP2Pos={handleP2Pos}
              onAIPos={handleAIPos}
              onP1Speed={setP1Speed}
              onP2Speed={setP2Speed}
              followTarget={p2CarRef}
              selectedCar={selectedCar}
              selectedCarP2={selectedCarP2}
            />
          </Suspense>
        </Canvas>
        {p2State && (
          <HUD
            speed={p2Speed}
            currentLap={p2State.lap}
            totalLaps={TOTAL_LAPS}
            position={p2State.position || 2}
            totalCars={carIds.length}
            elapsed={raceState.elapsed}
            bestLap={p2State.bestLapTime === Infinity ? 0 : p2State.bestLapTime}
            player="PLAYER 2 · ARROWS"
          />
        )}
      </div>

      {/* Countdown */}
      {!raceStarted && <CountdownOverlay onComplete={handleCountdownComplete} />}

      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-racing tracking-widest text-muted-foreground hover:text-white transition-colors px-3 py-1 border border-white/10 hover:border-white/30 rounded-sm z-50"
      >
        ← MENU
      </button>
    </div>
  );
}
