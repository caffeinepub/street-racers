// Oval-ish race track waypoints [x, y, z]
// These define the center line of the track
export const TRACK_WAYPOINTS: [number, number, number][] = [
  [0, 0, -80],
  [20, 0, -75],
  [45, 0, -65],
  [65, 0, -45],
  [75, 0, -20],
  [75, 0, 0],
  [75, 0, 20],
  [65, 0, 45],
  [45, 0, 65],
  [20, 0, 75],
  [0, 0, 80],
  [-20, 0, 75],
  [-45, 0, 65],
  [-65, 0, 45],
  [-75, 0, 20],
  [-75, 0, 0],
  [-75, 0, -20],
  [-65, 0, -45],
  [-45, 0, -65],
  [-20, 0, -75],
];

export const TRACK_WIDTH = 14;
export const START_POSITION: [number, number, number] = [0, 0.5, -80];
export const START_ROTATION = 0; // facing +Z direction initially
