import { type GameData } from "@/types/game.types";
import { create } from "zustand";

type GameDataStore = {
  gamedata: GameData;
  setGameData: (newGame: GameData) => void;
  updatedGameData: GameData;
  setUpdatedGameData: (newGame: GameData) => void;
};

export const useGameDataStore = create<GameDataStore>((set) => ({
  gamedata: {} as GameData,
  setGameData: (newGame: GameData) => set({ gamedata: newGame }),
  updatedGameData: {} as GameData,
  setUpdatedGameData: (newGame: GameData) => set({ updatedGameData: newGame }),
}));
