import { useRef, useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as THREE from 'three';
import Scene from '../components/game/Scene';
import PlayerCar from '../components/game/PlayerCar';
import AICar from '../components/game/AICar';
import FollowCamera from '../components/game/FollowCamera';
import HUD from '../components/game/HUD';
import CountdownOverlay from '../components/game/CountdownOverlay';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useRaceLogic } from '../hooks/useRaceLogic';
import { useGameContext } from '../context/GameContext';
import { CAR_CONFIGS } from '../types/car';
import { TRACK_WAYPOINTS } from '../components/game/trackData';

const AI_CARS = [
  { id: 'ai1', carIdx: 1, difficulty: 0.78, startOffset: 2 },
  { id: 'ai2', carIdx: 2, difficulty: 0.72, startOffset: 4 },
];

const TOTAL_LAPS = 3;

function getStartPos(index: number): [number, number, number] {
  const wp = TRACK_WAYPOINTS[0];
  const next = TRACK_WAYPOINTS[1];
  const dir = new THREE.Vector3(next[0] - wp[0], 0, next[2] - wp[2]).normalize();
  const right = new THREE.Vector3(-dir.z, 0, dir.x);
  const offsets = [0, -3, 3];
  const offset = right.clone().multiplyScalar(offsets[index] || 0);
  return [wp[0] + offset.x, 0.5, wp[2] + offset.z];
}

function getStartRotation(): number {
  const wp = TRACK_WAYPOINTS[0];
  const next = TRACK_WAYPOINTS[1];
  return Math.atan2(next[0] - wp[0], next[2] - wp[2]);
}

export default function SinglePlayerRace() {
  const navigate = useNavigate();
  const { selectedCar, setRaceResults } = useGameContext();
  const controls = useKeyboardControls();
  const playerCarRef = useRef<THREE.Group>(null!);

  // Store refs properly as RefObjects
  const aiCarRefs = useRef<React.RefObject<THREE.Group>[]>(
    AI_CARS.map(() => ({ current: null! }))
  );

  const [raceStarted, setRaceStarted] = useState(false);
  const [playerSpeed, setPlayerSpeed] = useState(0);

  const carIds = ['player', ...AI_CARS.map((a) => a.id)];
  const { raceState, startRace, updateCarPosition } = useRaceLogic(carIds, TOTAL_LAPS);

  const handleCountdownComplete = useCallback(() => {
    setRaceStarted(true);
    startRace();
  }, [startRace]);

  const handlePlayerPosition = useCallback(
    (pos: THREE.Vector3) => {
      updateCarPosition('player', pos);
    },
    [updateCarPosition]
  );

  const handleAIPosition = useCallback(
    (id: string) => (pos: THREE.Vector3) => {
      updateCarPosition(id, pos);
    },
    [updateCarPosition]
  );

  const startRot = getStartRotation();
  const playerState = raceState.cars['player'];

  // Navigate to finish when race is done
  if (raceState.finished && playerState?.finished) {
    const results = Object.values(raceState.cars)
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        playerName: c.id === 'player' ? 'Player 1' : `AI ${c.id.replace('ai', '')}`,
        car:
          c.id === 'player'
            ? selectedCar
            : CAR_CONFIGS[AI_CARS.find((a) => a.id === c.id)?.carIdx || 0],
        position: c.position,
        bestLapTime: c.bestLapTime === Infinity ? 0 : c.bestLapTime,
        totalTime: c.finishTime,
        mode: 'single' as const,
      }));
    setRaceResults(results);
    navigate({ to: '/race/finish' });
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-black">
      <Scene style={{ width: '100%', height: '100%' }}>
        <PlayerCar
          config={selectedCar}
          startPosition={getStartPos(0)}
          startRotation={startRot}
          controlsRef={controls}
          carRef={playerCarRef}
          onPositionUpdate={handlePlayerPosition}
          onSpeedUpdate={setPlayerSpeed}
          raceStarted={raceStarted}
        />
        {AI_CARS.map((ai, i) => (
          <AICar
            key={ai.id}
            config={CAR_CONFIGS[ai.carIdx]}
            startPosition={getStartPos(i + 1)}
            startRotation={startRot}
            carRef={aiCarRefs.current[i]}
            onPositionUpdate={handleAIPosition(ai.id)}
            raceStarted={raceStarted}
            difficulty={ai.difficulty}
            startOffset={ai.startOffset}
          />
        ))}
        <FollowCamera target={playerCarRef} />
      </Scene>

      {/* HUD */}
      {playerState && (
        <HUD
          speed={playerSpeed}
          currentLap={playerState.lap}
          totalLaps={TOTAL_LAPS}
          position={playerState.position || 1}
          totalCars={carIds.length}
          elapsed={raceState.elapsed}
          bestLap={playerState.bestLapTime === Infinity ? 0 : playerState.bestLapTime}
        />
      )}

      {/* Countdown */}
      {!raceStarted && <CountdownOverlay onComplete={handleCountdownComplete} />}

      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="absolute top-3 left-1/2 -translate-x-1/2 mt-12 text-xs font-racing tracking-widest text-muted-foreground hover:text-white transition-colors px-3 py-1 border border-white/10 hover:border-white/30 rounded-sm"
      >
        ← MENU
      </button>
    </div>
  );
}
