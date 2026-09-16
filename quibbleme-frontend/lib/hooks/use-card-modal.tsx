import { create } from "zustand";
import { ModalStore } from "./use-loading-modal";

export const useCardModal = create<ModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
