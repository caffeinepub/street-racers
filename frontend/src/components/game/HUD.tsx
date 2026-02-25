interface HUDProps {
  speed: number;
  currentLap: number;
  totalLaps: number;
  position: number;
  totalCars: number;
  elapsed: number;
  bestLap: number;
  player?: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds === 0) return '--:--.---';
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

export default function HUD({
  speed,
  currentLap,
  totalLaps,
  position,
  totalCars,
  elapsed,
  bestLap,
  player,
}: HUDProps) {
  const displayLap = Math.min(currentLap + 1, totalLaps);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top center - Lap info */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="hud-panel px-4 py-1.5 rounded-sm">
          <span className="text-neon-gold font-racing text-sm tracking-widest">
            LAP {displayLap} / {totalLaps}
          </span>
        </div>
      </div>

      {/* Top left - Position */}
      <div className="absolute top-3 left-3">
        <div className="hud-panel px-3 py-1.5 rounded-sm">
          <div className="text-neon-red font-racing text-2xl font-bold leading-none">
            {getOrdinal(position)}
          </div>
          <div className="text-muted-hud text-xs tracking-wider">of {totalCars}</div>
        </div>
      </div>

      {/* Top right - Timer */}
      <div className="absolute top-3 right-3">
        <div className="hud-panel px-3 py-1.5 rounded-sm text-right">
          <div className="text-hud-white font-mono text-sm">{formatTime(elapsed)}</div>
          <div className="text-neon-gold font-mono text-xs">
            BEST {formatTime(bestLap)}
          </div>
        </div>
      </div>

      {/* Bottom right - Speedometer */}
      <div className="absolute bottom-4 right-4">
        <div className="hud-panel px-4 py-2 rounded-sm text-right">
          <div className="text-hud-white font-racing text-4xl font-bold leading-none">
            {Math.round(speed)}
          </div>
          <div className="text-muted-hud text-xs tracking-widest">KM/H</div>
        </div>
      </div>

      {/* Bottom left - Player label */}
      {player && (
        <div className="absolute bottom-4 left-4">
          <div className="hud-panel px-3 py-1.5 rounded-sm">
            <span className="text-neon-gold font-racing text-sm tracking-widest">{player}</span>
          </div>
        </div>
      )}
    </div>
  );
}
