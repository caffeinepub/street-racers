import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { GameProvider } from './context/GameContext';
import MainMenu from './pages/MainMenu';
import CarSelection from './pages/CarSelection';
import SinglePlayerRace from './pages/SinglePlayerRace';
import LocalMultiplayerRace from './pages/LocalMultiplayerRace';
import RaceFinish from './pages/RaceFinish';
import Leaderboard from './pages/Leaderboard';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainMenu,
});

const carSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/car-selection',
  component: CarSelection,
});

const singlePlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race/single',
  component: SinglePlayerRace,
});

const multiplayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race/multiplayer',
  component: LocalMultiplayerRace,
});

const finishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race/finish',
  component: RaceFinish,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: Leaderboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  carSelectionRoute,
  singlePlayerRoute,
  multiplayerRoute,
  finishRoute,
  leaderboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}
