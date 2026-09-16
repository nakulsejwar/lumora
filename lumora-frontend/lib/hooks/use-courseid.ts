import { create } from "zustand";

type GameStore = {
  courseId: string | null;
  topicId: string | null;
  levelId: string | null;
  courseName: string | null;
  setCourseId: (
    courseId?: string | null,
    topicId?: string | null,
    levelId?: string | null
  ) => void;
  setCourseName: (courseName: string | null) => void;
};

export const useCourseIdStore = create<GameStore>((set) => ({
  courseId: null,
  topicId: null,
  levelId: null,
  courseName: null,
  setCourseId: (courseId, topicId, levelId) =>
    set({ courseId, topicId, levelId }),
  setCourseName: (courseName) => set({ courseName }),
}));
