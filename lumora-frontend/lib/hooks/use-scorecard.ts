import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Score {
  game_id: number;
  game_name: string;
  score: number;
}

interface MyState {
  scorecard: Score[];
  addScore: (score: Score) => void;
  clearLocalStorage: () => void;
}
const useScorecard = create<MyState>()(
  persist(
    (set, get) => ({
      scorecard: [],
      addScore: (newscore: Score) => {
        if (
          newscore &&
          newscore.game_id !== undefined &&
          newscore.score !== undefined
        ) {
          // Ensure the score is within the range of 0 to 10
          const normalizedScore = Math.min(Math.max(newscore.score, 0), 10);
          const updatedScore = { ...newscore, score: normalizedScore };
          const updatedScorecard = get().scorecard.map((score) => {
            // If the game_id matches, replace the score
            if (
              score.game_id === newscore.game_id &&
              score.score < updatedScore.score
            ) {
              return updatedScore;
            } else {
              return score;
            }
          });

          // If the game_id doesn't exist in the scorecard, add the new score
          if (
            !updatedScorecard.some(
              (score) => score.game_id === newscore.game_id
            )
          ) {
            updatedScorecard.push(newscore);
          }

          // Update the scorecard state
          set({ scorecard: updatedScorecard });
        }
      },
      clearLocalStorage: () => {
        // Clear the local storage
        sessionStorage.removeItem("score-storage");
        // Update the scorecard state to clear the scores
        set({ scorecard: [] });
      },
    }),
    {
      name: "score-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useScorecard;
