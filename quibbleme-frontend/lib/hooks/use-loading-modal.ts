import { create } from "zustand";

export type ModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useLoadingModal = create<ModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
