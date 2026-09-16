import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserGameData {
  "user-id": string;
  gameid: string;
  "game-name": string;
  "game-question": string;
  score: number;
  totalQuestions: number;
  "game-data": {
    foodItem: string;
    foodImage: string;
    userScore: number;
  }[];
}

interface MyState {
  sessionData: UserGameData[];
  addSessionsData: (gameData: UserGameData) => void;
  clearSessionStorage: () => void;
}
const useSessionStore = create<MyState>()(
  persist(
    (set, get) => ({
      sessionData: [],
      addSessionsData: (newData: UserGameData) => {
        if (
          newData &&
          newData.gameid !== undefined &&
          newData.score !== undefined
        ) {
          // Ensure the score is within the range of 0 to 10
          const normalizedScore = Math.min(Math.max(newData.score, 0), 10);
          const updatedScore = { ...newData, score: normalizedScore };
          const updatedScorecard = get().sessionData.map((score) => {
            // If the game_id matches, replace the score
            if (
              score.gameid === newData.gameid &&
              score.score < updatedScore.score
            ) {
              return updatedScore;
            } else {
              return score;
            }
          });

          // If the game_id doesn't exist in the scorecard, add the new score
          if (
            !updatedScorecard.some((score) => score.gameid === newData.gameid)
          ) {
            updatedScorecard.push(newData);
          }

          // Update the scorecard state
          set({ sessionData: updatedScorecard });
        }
      },
      clearSessionStorage: () => {
        // Clear the local storage
        sessionStorage.removeItem("game-session-storage");
        // Update the scorecard state to clear the scores
        set({ sessionData: [] });
      },
    }),
    {
      name: "game-session-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useSessionStore;
