import { useNavigate } from '@tanstack/react-router';
import { Trophy, Users, Car, Play, ChevronRight } from 'lucide-react';

export default function MainMenu() {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Single Player',
      icon: <Play className="w-5 h-5" />,
      action: () => navigate({ to: '/race/single' }),
      accent: 'neon-red',
    },
    {
      label: 'Local Multiplayer',
      icon: <Users className="w-5 h-5" />,
      action: () => navigate({ to: '/race/multiplayer' }),
      accent: 'neon-gold',
    },
    {
      label: 'Car Selection',
      icon: <Car className="w-5 h-5" />,
      action: () => navigate({ to: '/car-selection' }),
      accent: 'neon-blue',
    },
    {
      label: 'Leaderboard',
      icon: <Trophy className="w-5 h-5" />,
      action: () => navigate({ to: '/leaderboard' }),
      accent: 'neon-gold',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #050508 0%, #0a0a14 50%, #080510 100%)',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/menu-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,34,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,34,68,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        transform: 'perspective(500px) rotateX(30deg)',
        transformOrigin: 'bottom',
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ff2244, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ffd700, transparent)' }} />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <img
            src="/assets/generated/logo.dim_600x150.png"
            alt="Apex Racers"
            className="w-full max-w-sm object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 className="font-racing text-5xl font-black tracking-widest text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #ff2244, #ffd700)' }}>
            APEX RACERS
          </h1>
          <p className="text-muted-foreground font-racing tracking-[0.3em] text-sm uppercase">
            Street Racing Championship
          </p>
        </div>

        {/* Menu buttons */}
        <nav className="flex flex-col gap-3 w-full">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              className="menu-btn group flex items-center justify-between px-6 py-4 w-full"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-neon-red group-hover:text-neon-gold transition-colors duration-200">
                  {item.icon}
                </span>
                <span className="font-racing text-lg tracking-widest text-white group-hover:text-neon-gold transition-colors duration-200">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-neon-red transition-all duration-200 group-hover:translate-x-1" />
            </button>
          ))}
        </nav>

        {/* Controls hint */}
        <div className="text-center text-muted-foreground text-xs font-mono tracking-wider">
          <p>P1: WASD + SPACE (brake) &nbsp;|&nbsp; P2: ARROWS + RSHIFT (brake)</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Apex Racers &nbsp;·&nbsp; Built with{' '}
          <span className="text-neon-red">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'apex-racers')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-gold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
