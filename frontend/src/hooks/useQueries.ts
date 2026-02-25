import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CarType, GameMode, ScoreEntry } from '../backend';

export function useLeaderboard(car: CarType, mode: GameMode) {
  const { actor, isFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ['leaderboard', car, mode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(car, mode);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      car,
      mode,
      time,
    }: {
      car: CarType;
      mode: GameMode;
      time: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitScore(car, mode, time);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
