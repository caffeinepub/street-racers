import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CAR_CONFIGS, CarConfig } from '../types/car';

export interface RaceResult {
  playerName: string;
  car: CarConfig;
  position: number;
  bestLapTime: number;
  totalTime: number;
  mode: 'single' | 'multiplayer';
}

interface GameContextType {
  selectedCar: CarConfig;
  setSelectedCar: (car: CarConfig) => void;
  selectedCarP2: CarConfig;
  setSelectedCarP2: (car: CarConfig) => void;
  raceResults: RaceResult[];
  setRaceResults: (results: RaceResult[]) => void;
  totalLaps: number;
  setTotalLaps: (laps: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [selectedCar, setSelectedCar] = useState<CarConfig>(CAR_CONFIGS[0]);
  const [selectedCarP2, setSelectedCarP2] = useState<CarConfig>(CAR_CONFIGS[1]);
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [totalLaps, setTotalLaps] = useState(3);

  return (
    <GameContext.Provider
      value={{
        selectedCar,
        setSelectedCar,
        selectedCarP2,
        setSelectedCarP2,
        raceResults,
        setRaceResults,
        totalLaps,
        setTotalLaps,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
