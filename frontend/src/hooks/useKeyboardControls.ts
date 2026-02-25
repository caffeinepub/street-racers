import { useEffect, useRef } from 'react';

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export function useKeyboardControls() {
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
        case 'KeyW': case 'ArrowUp': controls.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': controls.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': controls.current.left = true; break;
        case 'KeyD': case 'ArrowRight': controls.current.right = true; break;
        case 'Space': controls.current.brake = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': controls.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': controls.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': controls.current.left = false; break;
        case 'KeyD': case 'ArrowRight': controls.current.right = false; break;
        case 'Space': controls.current.brake = false; break;
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
