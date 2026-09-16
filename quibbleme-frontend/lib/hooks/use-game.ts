import { type GameDetails } from "@/types/game.types";
import { create } from "zustand";

type GameStore = {
  game: GameDetails;
  setGame: (newGame: GameDetails) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  game: {} as GameDetails,
  setGame: (newGame: GameDetails) => set({ game: newGame }),
}));
