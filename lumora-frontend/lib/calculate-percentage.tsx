export function calculatePercentage(gamesPlayed: any, id: any) {
  const game = gamesPlayed.find((item: any) => item.gameid === id);
  if (!game) return 0;

  if (game?.totalQuestions) return game.score / game.totalQuestions;
  return game.score;
}
