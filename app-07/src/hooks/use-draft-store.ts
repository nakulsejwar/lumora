import { ChatSchema } from "@/schemas/game";
import { Course } from "@/types/draft";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MyState {
  course: Course | null;
  createCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  clearCourseStore: () => void;
}
const useDraftStore = create<MyState>()(
  persist(
    (set, get) => ({
      course: null,
      createCourse: (newData: Course) => {
        if (newData) {
          // Update the  state
          set({ course: newData });
        }
      },
      updateCourse: (newData: Course) => {
        if (newData) {
          // replace the existing data with the new data
          set({ course: newData });
        }
      },
      clearCourseStore: () => {
        // Clear the local storage
        sessionStorage.removeItem("draft-store");
        // Update the  state to clear the data
        set({ course: null });
      },
    }),
    {
      name: "draft-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useDraftStore;
