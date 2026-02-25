import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trophy, RotateCcw, Home, Clock, Medal } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { useSubmitScore } from '../hooks/useQueries';
import { CarType, GameMode } from '../backend';

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '--:--.---';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getMedalColor(pos: number): string {
  if (pos === 1) return '#ffd700';
  if (pos === 2) return '#c0c0c0';
  if (pos === 3) return '#cd7f32';
  return '#666666';
}

function carIdToCarType(carId: string): CarType {
  if (carId === 'gtr') return CarType.sport;
  if (carId === '911') return CarType.classic;
  if (carId === 'm5') return CarType.sport;
  return CarType.sport;
}

export default function RaceFinish() {
  const navigate = useNavigate();
  const { raceResults } = useGameContext();
  const { mutate: submitScore } = useSubmitScore();
  const submitted = useRef(false);

  const playerResults = raceResults.filter((r) => r.playerName.startsWith('Player'));
  const isMultiplayer = raceResults.some((r) => r.mode === 'multiplayer');

  useEffect(() => {
    if (submitted.current || raceResults.length === 0) return;
    submitted.current = true;

    // Submit scores for human players
    playerResults.forEach((result) => {
      if (result.bestLapTime > 0) {
        submitScore({
          car: carIdToCarType(result.car.id),
          mode: isMultiplayer ? GameMode.singlePlayer : GameMode.singlePlayer,
          time: Math.round(result.bestLapTime * 1000),
        });
      }
    });
  }, []);

  if (raceResults.length === 0) {
    navigate({ to: '/' });
    return null;
  }

  const winner = raceResults[0];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050508 0%, #0a0a14 50%, #080510 100%)' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/menu-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl px-6 py-8 flex flex-col items-center gap-8">
        {/* Winner announcement */}
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-neon-gold" />
            <h1 className="font-racing text-4xl font-black tracking-widest text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #ffd700, #ff8800)' }}>
              RACE COMPLETE
            </h1>
            <Trophy className="w-8 h-8 text-neon-gold" />
          </div>
          <p className="text-muted-foreground font-racing tracking-widest text-sm">
            {winner.playerName} wins in {winner.car.fullName}!
          </p>
        </div>

        {/* Results table */}
        <div className="w-full rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="grid grid-cols-5 gap-2 px-4 py-2 border-b border-white/10">
            <span className="font-racing text-xs tracking-widest text-muted-foreground">POS</span>
            <span className="font-racing text-xs tracking-widest text-muted-foreground col-span-2">DRIVER</span>
            <span className="font-racing text-xs tracking-widest text-muted-foreground">BEST LAP</span>
            <span className="font-racing text-xs tracking-widest text-muted-foreground">TIME</span>
          </div>
          {raceResults.map((result, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-white/5 last:border-0 items-center"
              style={{
                background: result.playerName.startsWith('Player') ? 'rgba(255,34,68,0.05)' : 'transparent',
              }}
            >
              <div className="flex items-center gap-2">
                <Medal className="w-4 h-4" style={{ color: getMedalColor(result.position) }} />
                <span className="font-racing text-sm font-bold" style={{ color: getMedalColor(result.position) }}>
                  {getOrdinal(result.position)}
                </span>
              </div>
              <div className="col-span-2">
                <div className="font-racing text-sm text-white">{result.playerName}</div>
                <div className="text-xs text-muted-foreground">{result.car.fullName}</div>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neon-gold" />
                <span className="font-mono text-xs text-neon-gold">{formatTime(result.bestLapTime)}</span>
              </div>
              <div className="font-mono text-xs text-muted-foreground">{formatTime(result.totalTime)}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate({ to: isMultiplayer ? '/race/multiplayer' : '/race/single' })}
            className="flex items-center gap-2 px-6 py-3 font-racing tracking-widest text-sm border border-neon-red/50 text-neon-red hover:bg-neon-red/10 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" /> RACE AGAIN
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 px-6 py-3 font-racing tracking-widest text-sm race-btn"
          >
            <Home className="w-4 h-4" /> MAIN MENU
          </button>
          <button
            onClick={() => navigate({ to: '/leaderboard' })}
            className="flex items-center gap-2 px-6 py-3 font-racing tracking-widest text-sm border border-neon-gold/50 text-neon-gold hover:bg-neon-gold/10 transition-all duration-200"
          >
            <Trophy className="w-4 h-4" /> LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
