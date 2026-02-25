import { useState, useEffect } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [count, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        key={count}
        className="font-racing text-9xl font-black animate-countdown"
        style={{
          color: count === 0 ? '#00ff88' : count === 1 ? '#ff4400' : '#ffd700',
          textShadow: `0 0 40px currentColor, 0 0 80px currentColor`,
        }}
      >
        {count === 0 ? 'GO!' : count}
      </div>
    </div>
  );
}
