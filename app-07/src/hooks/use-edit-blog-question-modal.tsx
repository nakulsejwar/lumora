import { create } from "zustand";

type ModalItem = "add-question" | "edit-question" | null;
export type ModalStore = {
  isOpen: boolean;
  item: ModalItem;
  data: any;
  onOpen: (item: Exclude<ModalItem, null>, data: any) => void;
  onClose: () => void;
};

export const useBlogQuestionModal = create<ModalStore>((set) => ({
  isOpen: false,
  item: null,
  data: null,
  onOpen: (item, data) => set({ isOpen: true, item, data }),
  onClose: () => set({ isOpen: false, item: null, data: null }),
}));
