export function getStreakStageProgress(currentStreak: number): number {
  if (currentStreak === 0) return 0;
  return currentStreak % 7 === 0 ? 7 : currentStreak % 7;
}
