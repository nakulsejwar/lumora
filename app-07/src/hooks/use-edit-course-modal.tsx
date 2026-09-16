import { create } from "zustand";

type ModalItem =
  | "course"
  | "topic"
  | "level"
  | "game"
  | "tile"
  | "create-tile"
  | "create-module"
  | "create-level"
  | "create-game"
  | null;
export type ModalStore = {
  isOpen: boolean;
  item: ModalItem;
  data: any;
  onOpen: (item: Exclude<ModalItem, null>, data: any) => void;
  onClose: () => void;
};

export const useCourseEditModal = create<ModalStore>((set) => ({
  isOpen: false,
  item: null,
  data: null,
  onOpen: (item, data) => set({ isOpen: true, item, data }),
  onClose: () => set({ isOpen: false, item: null, data: null }),
}));
