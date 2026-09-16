import { create } from "zustand";

type GameStore = {
  isOpen: boolean;
  gameid: string | null;
  onOpen: (gameid: string) => void;
  onClose: () => void;
};

export const useGamePopupModal = create<GameStore>((set) => ({
  isOpen: false,
  gameid: null,
  onOpen: (gameid) => set({ isOpen: true, gameid }),
  onClose: () => set({ isOpen: false }),
}));
