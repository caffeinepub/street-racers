import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Zap, Gauge, Navigation } from 'lucide-react';
import { CAR_CONFIGS } from '../types/car';
import { useGameContext } from '../context/GameContext';

function StatBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-5">{icon}</span>
      <span className="text-xs font-racing tracking-widest text-muted-foreground w-20 uppercase">{label}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value * 10}%`,
            background: 'linear-gradient(90deg, #ff2244, #ffd700)',
          }}
        />
      </div>
      <span className="text-neon-gold font-mono text-sm w-6 text-right">{value}</span>
    </div>
  );
}

export default function CarSelection() {
  const navigate = useNavigate();
  const { selectedCar, setSelectedCar, selectedCarP2, setSelectedCarP2 } = useGameContext();
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [p1Idx, setP1Idx] = useState(CAR_CONFIGS.findIndex((c) => c.id === selectedCar.id));
  const [p2Idx, setP2Idx] = useState(CAR_CONFIGS.findIndex((c) => c.id === selectedCarP2.id));

  const currentIdx = activePlayer === 1 ? p1Idx : p2Idx;
  const currentCar = CAR_CONFIGS[currentIdx];

  const prev = () => {
    const newIdx = (currentIdx - 1 + CAR_CONFIGS.length) % CAR_CONFIGS.length;
    if (activePlayer === 1) setP1Idx(newIdx);
    else setP2Idx(newIdx);
  };

  const next = () => {
    const newIdx = (currentIdx + 1) % CAR_CONFIGS.length;
    if (activePlayer === 1) setP1Idx(newIdx);
    else setP2Idx(newIdx);
  };

  const confirm = () => {
    setSelectedCar(CAR_CONFIGS[p1Idx]);
    setSelectedCarP2(CAR_CONFIGS[p2Idx]);
    navigate({ to: '/' });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050508 0%, #0a0a14 50%, #080510 100%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/menu-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-muted-foreground hover:text-neon-red transition-colors font-racing tracking-wider"
          >
            <ChevronLeft className="w-5 h-5" /> BACK
          </button>
          <h1
            className="font-racing text-3xl font-black tracking-widest text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #ff2244, #ffd700)' }}
          >
            SELECT YOUR CAR
          </h1>
          <div className="w-20" />
        </div>

        {/* Player tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2].map((p) => (
            <button
              key={p}
              onClick={() => setActivePlayer(p as 1 | 2)}
              className={`px-6 py-2 font-racing tracking-widest text-sm transition-all duration-200 border ${
                activePlayer === p
                  ? 'border-neon-red text-neon-red bg-neon-red/10'
                  : 'border-white/20 text-muted-foreground hover:border-white/40'
              }`}
            >
              PLAYER {p}
            </button>
          ))}
        </div>

        {/* Car showcase */}
        <div className="flex items-center gap-6">
          <button onClick={prev} className="nav-arrow-btn">
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="flex-1 flex flex-col items-center gap-6">
            {/* Car preview */}
            <div
              className="relative w-full max-w-md h-48 flex items-center justify-center rounded-sm overflow-hidden"
              style={{
                border: `2px solid ${currentCar.accentColor}44`,
                background: `radial-gradient(ellipse at center, ${currentCar.accentColor}15, transparent 70%)`,
              }}
            >
              <img
                src={currentCar.previewImage}
                alt={currentCar.fullName}
                className="w-full h-full object-contain p-4 transition-all duration-300"
                style={{ filter: `drop-shadow(0 0 20px ${currentCar.accentColor}88)` }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Color swatch */}
              <div
                className="absolute bottom-3 right-3 w-6 h-6 rounded-full border-2 border-white/30"
                style={{ background: currentCar.color }}
              />
            </div>

            {/* Car name */}
            <div className="text-center">
              <h2 className="font-racing text-4xl font-black tracking-widest text-white">
                {currentCar.name}
              </h2>
              <p className="text-muted-foreground font-racing tracking-widest text-sm mt-1">
                {currentCar.fullName}
              </p>
            </div>

            {/* Stats */}
            <div
              className="w-full max-w-sm flex flex-col gap-3 p-4 rounded-sm"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <StatBar label="Top Speed" value={currentCar.topSpeed} icon={<Gauge className="w-4 h-4" />} />
              <StatBar label="Acceleration" value={currentCar.acceleration} icon={<Zap className="w-4 h-4" />} />
              <StatBar label="Handling" value={currentCar.handling} icon={<Navigation className="w-4 h-4" />} />
            </div>

            {/* Car dots */}
            <div className="flex gap-2">
              {CAR_CONFIGS.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    background: i === currentIdx ? currentCar.accentColor : 'rgba(255,255,255,0.2)',
                    transform: i === currentIdx ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <button onClick={next} className="nav-arrow-btn">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Selected summary */}
        <div className="mt-6 flex gap-4 justify-center">
          {[
            { label: 'P1', car: CAR_CONFIGS[p1Idx], active: activePlayer === 1 },
            { label: 'P2', car: CAR_CONFIGS[p2Idx], active: activePlayer === 2 },
          ].map(({ label, car, active }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-2 rounded-sm transition-all duration-200"
              style={{
                border: `1px solid ${active ? car.accentColor : 'rgba(255,255,255,0.1)'}`,
                background: active ? `${car.accentColor}10` : 'transparent',
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: car.color, border: `1px solid ${car.accentColor}` }}
              />
              <span className="font-racing text-xs tracking-widest text-muted-foreground">{label}:</span>
              <span className="font-racing text-sm tracking-wider text-white">{car.name}</span>
            </div>
          ))}
        </div>

        {/* Confirm button */}
        <div className="mt-8 flex justify-center">
          <button onClick={confirm} className="race-btn px-12 py-4 font-racing text-lg tracking-widest">
            CONFIRM SELECTION
          </button>
        </div>
      </div>
    </div>
  );
}
