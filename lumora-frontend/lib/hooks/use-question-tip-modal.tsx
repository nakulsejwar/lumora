import { create } from "zustand";
type ModalStore = {
  isOpen: boolean;
  qid: string | null;
  onOpen: (qid: string) => void;
  onClose: () => void;
};
export const useQuestionTipModal = create<ModalStore>((set) => ({
  isOpen: false,
  qid: null,
  onOpen: (qid: string) => set({ isOpen: true, qid }),
  onClose: () => set({ isOpen: false, qid: null }),
}));
