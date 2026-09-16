import { create } from "zustand";

type SignUpQueue = {
  item: string | null;
  setItem: (item: string) => void;
};

export const useSignUpQueue = create<SignUpQueue>((set) => ({
  item: null,
  setItem: (newGame: string) => set({ item: newGame }),
}));
