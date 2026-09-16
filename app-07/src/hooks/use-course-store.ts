import { CourseType } from "@/types/course";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MyState {
  course: CourseType | null;
  createCourse: (course: CourseType) => void;
  updateCourse: (idKey: string, idValue: string, data: any) => void;
  clearCourseStore: () => void;
}

// Helper function to find and update nested items by ID
const updateItemById = (
  obj: any,
  idKey: string,
  idValue: string,
  value: any
): any => {
  if (!obj) return obj;

  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in newObj) {
    if (typeof newObj[key] === "object") {
      // Check if the current object matches the given ID
      if (newObj[key][idKey] === idValue) {
        // Update the object with the new value
        newObj[key] = { ...newObj[key], ...value };
        return newObj;
      }
      // Recursively update nested objects
      newObj[key] = updateItemById(newObj[key], idKey, idValue, value);
      // If we found and updated the item, break the loop
      if (newObj[key][idKey] === idValue) {
        break;
      }
    }
  }

  return newObj;
};

const useCourseStore = create<MyState>()(
  persist(
    (set, get) => ({
      course: null,
      createCourse: (newData: CourseType) => {
        if (newData) {
          // Update the  state
          set({ course: newData });
        }
      },
      updateCourse: (idKey: string, idValue: string, data: any) => {
        // Get the existing course data
        const existingCourse = get().course;
        if (existingCourse) {
          // Update the nested item using the custom function
          const updatedCourse = updateItemById(
            existingCourse,
            idKey,
            idValue,
            data
          );

          // Update the state with the new course data
          set({ course: updatedCourse });
        }
      },
      clearCourseStore: () => {
        // Clear the local storage
        sessionStorage.removeItem("course-store");
        // Update the  state to clear the data
        set({ course: null });
      },
    }),
    {
      name: "course-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCourseStore;
