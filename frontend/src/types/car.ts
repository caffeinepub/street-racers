export interface CarConfig {
  id: string;
  name: string;
  fullName: string;
  color: string;
  accentColor: string;
  topSpeed: number;       // 1-10
  acceleration: number;  // 1-10
  handling: number;      // 1-10
  previewImage: string;
  // Physics multipliers
  maxSpeed: number;       // actual max speed units/s
  accelForce: number;     // acceleration force
  turnSpeed: number;      // turning speed
  brakeForce: number;     // braking force
}

export const CAR_CONFIGS: CarConfig[] = [
  {
    id: 'gtr',
    name: 'GT-R',
    fullName: 'Nissan GT-R',
    color: '#3a3f4a',
    accentColor: '#ff2244',
    topSpeed: 9,
    acceleration: 8,
    handling: 8,
    previewImage: '/assets/generated/car-gtr-preview.dim_400x200.png',
    maxSpeed: 42,
    accelForce: 28,
    turnSpeed: 1.8,
    brakeForce: 35,
  },
  {
    id: '911',
    name: '911',
    fullName: 'Porsche 911',
    color: '#c0c0c0',
    accentColor: '#ffd700',
    topSpeed: 8,
    acceleration: 7,
    handling: 9,
    previewImage: '/assets/generated/car-911-preview.dim_400x200.png',
    maxSpeed: 38,
    accelForce: 24,
    turnSpeed: 2.1,
    brakeForce: 32,
  },
  {
    id: 'm5',
    name: 'M5',
    fullName: 'BMW M5',
    color: '#111111',
    accentColor: '#00aaff',
    topSpeed: 9,
    acceleration: 9,
    handling: 7,
    previewImage: '/assets/generated/car-m5-preview.dim_400x200.png',
    maxSpeed: 44,
    accelForce: 32,
    turnSpeed: 1.6,
    brakeForce: 38,
  },
];
