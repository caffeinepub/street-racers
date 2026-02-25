import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Trophy, Clock, Car } from 'lucide-react';
import { useLeaderboard } from '../hooks/useQueries';
import { CarType, GameMode } from '../backend';

function formatTime(ms: number): string {
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const msRem = ms % 1000;
  return `${m}:${String(s).padStart(2, '0')}.${String(msRem).padStart(3, '0')}`;
}

function getCarName(car: CarType): string {
  if (car === CarType.sport) return 'GT-R / M5';
  if (car === CarType.classic) return 'Porsche 911';
  if (car === CarType.truck) return 'Truck';
  return 'Unknown';
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<CarType>(CarType.sport);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.singlePlayer);

  const { data: scores, isLoading } = useLeaderboard(selectedCar, selectedMode);

  const carOptions = [
    { value: CarType.sport, label: 'Sport (GT-R / M5)' },
    { value: CarType.classic, label: 'Classic (911)' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
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

      <div className="relative z-10 w-full max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-muted-foreground hover:text-neon-red transition-colors font-racing tracking-wider"
          >
            <ChevronLeft className="w-5 h-5" /> BACK
          </button>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-neon-gold" />
            <h1 className="font-racing text-3xl font-black tracking-widest text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #ffd700, #ff8800)' }}>
              LEADERBOARD
            </h1>
          </div>
          <div className="w-20" />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex gap-2">
            {carOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedCar(opt.value)}
                className={`px-4 py-2 font-racing tracking-widest text-xs transition-all duration-200 border ${
                  selectedCar === opt.value
                    ? 'border-neon-gold text-neon-gold bg-neon-gold/10'
                    : 'border-white/20 text-muted-foreground hover:border-white/40'
                }`}
              >
                <Car className="w-3 h-3 inline mr-1" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scores table */}
        <div className="rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-white/10">
            <span className="font-racing text-xs tracking-widest text-muted-foreground">RANK</span>
            <span className="font-racing text-xs tracking-widest text-muted-foreground">DRIVER</span>
            <span className="font-racing text-xs tracking-widest text-muted-foreground">CAR</span>
            <span className="font-racing text-xs tracking-widest text-muted-foreground">BEST LAP</span>
          </div>

          {isLoading ? (
            <div className="px-4 py-8 text-center text-muted-foreground font-racing tracking-widest text-sm">
              LOADING...
            </div>
          ) : !scores || scores.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground font-racing tracking-widest text-sm">NO RECORDS YET</p>
              <p className="text-muted-foreground text-xs mt-1">Complete a race to set a time!</p>
            </div>
          ) : (
            scores.slice(0, 10).map((entry, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-white/5 last:border-0 items-center"
                style={{
                  background: i === 0 ? 'rgba(255,215,0,0.05)' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-racing text-sm font-bold"
                    style={{
                      color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#666',
                    }}
                  >
                    {getOrdinal(i + 1)}
                  </span>
                </div>
                <span className="font-mono text-xs text-white truncate">
                  {entry.player.toString().slice(0, 8)}...
                </span>
                <span className="font-racing text-xs text-muted-foreground">
                  {getCarName(entry.car)}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neon-gold" />
                  <span className="font-mono text-xs text-neon-gold">{formatTime(entry.time)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-mono">
          Showing top 10 best lap times
        </p>
      </div>
    </div>
  );
}
