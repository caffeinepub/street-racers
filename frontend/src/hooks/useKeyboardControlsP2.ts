import { useEffect, useRef } from 'react';
import { Controls } from './useKeyboardControls';

export function useKeyboardControlsP2() {
  const controls = useRef<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp': controls.current.forward = true; break;
        case 'ArrowDown': controls.current.backward = true; break;
        case 'ArrowLeft': controls.current.left = true; break;
        case 'ArrowRight': controls.current.right = true; break;
        case 'ShiftRight': controls.current.brake = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp': controls.current.forward = false; break;
        case 'ArrowDown': controls.current.backward = false; break;
        case 'ArrowLeft': controls.current.left = false; break;
        case 'ArrowRight': controls.current.right = false; break;
        case 'ShiftRight': controls.current.brake = false; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
}
