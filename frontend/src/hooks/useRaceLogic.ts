import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { TRACK_WAYPOINTS } from '../components/game/trackData';

export interface CarRaceState {
  id: string;
  lap: number;
  waypointIndex: number;
  finished: boolean;
  finishTime: number;
  bestLapTime: number;
  lapStartTime: number;
  position: number;
}

export interface RaceState {
  started: boolean;
  finished: boolean;
  startTime: number;
  elapsed: number;
  cars: Record<string, CarRaceState>;
}

const TOTAL_LAPS = 3;
const WAYPOINT_RADIUS = 12;

export function useRaceLogic(carIds: string[], totalLaps = TOTAL_LAPS) {
  const [raceState, setRaceState] = useState<RaceState>({
    started: false,
    finished: false,
    startTime: 0,
    elapsed: 0,
    cars: Object.fromEntries(
      carIds.map((id) => [
        id,
        {
          id,
          lap: 0,
          waypointIndex: 0,
          finished: false,
          finishTime: 0,
          bestLapTime: Infinity,
          lapStartTime: 0,
          position: 0,
        },
      ])
    ),
  });

  const raceStateRef = useRef(raceState);
  raceStateRef.current = raceState;

  const startRace = useCallback(() => {
    const now = performance.now();
    setRaceState((prev) => ({
      ...prev,
      started: true,
      startTime: now,
      cars: Object.fromEntries(
        Object.entries(prev.cars).map(([id, car]) => [
          id,
          { ...car, lapStartTime: now },
        ])
      ),
    }));
  }, []);

  const updateCarPosition = useCallback(
    (carId: string, pos: THREE.Vector3) => {
      const state = raceStateRef.current;
      if (!state.started || state.finished) return;

      const carState = state.cars[carId];
      if (!carState || carState.finished) return;

      const now = performance.now();
      const elapsed = (now - state.startTime) / 1000;

      const nextWpIdx = (carState.waypointIndex + 1) % TRACK_WAYPOINTS.length;
      const nextWp = TRACK_WAYPOINTS[nextWpIdx];
      const wpPos = new THREE.Vector3(nextWp[0], 0, nextWp[2]);
      const dist = new THREE.Vector3(pos.x, 0, pos.z).distanceTo(wpPos);

      if (dist < WAYPOINT_RADIUS) {
        const newWpIdx = nextWpIdx;
        let newLap = carState.lap;
        let newBestLap = carState.bestLapTime;
        let newLapStart = carState.lapStartTime;
        let finished = false;
        let finishTime = carState.finishTime;

        // Completed a full lap when waypoint wraps around
        if (newWpIdx === 0) {
          newLap += 1;
          const lapTime = (now - carState.lapStartTime) / 1000;
          if (lapTime < newBestLap) newBestLap = lapTime;
          newLapStart = now;

          if (newLap >= totalLaps) {
            finished = true;
            finishTime = elapsed;
          }
        }

        setRaceState((prev) => {
          const updatedCars = {
            ...prev.cars,
            [carId]: {
              ...prev.cars[carId],
              waypointIndex: newWpIdx,
              lap: newLap,
              bestLapTime: newBestLap,
              lapStartTime: newLapStart,
              finished,
              finishTime,
            },
          };

          // Recalculate positions
          const sorted = Object.values(updatedCars).sort((a, b) => {
            if (a.finished && !b.finished) return -1;
            if (!a.finished && b.finished) return 1;
            if (a.lap !== b.lap) return b.lap - a.lap;
            return b.waypointIndex - a.waypointIndex;
          });
          sorted.forEach((c, i) => {
            updatedCars[c.id] = { ...updatedCars[c.id], position: i + 1 };
          });

          const allFinished = Object.values(updatedCars).every((c) => c.finished);

          return {
            ...prev,
            elapsed,
            finished: allFinished,
            cars: updatedCars,
          };
        });
      } else {
        setRaceState((prev) => ({
          ...prev,
          elapsed,
        }));
      }
    },
    []
  );

  return { raceState, startRace, updateCarPosition, totalLaps };
}
