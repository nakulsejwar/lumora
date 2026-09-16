import { QuestionOption } from "@/types/game.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface FoodItem {
  Name?: string;
  ImageLink?: string;
  IsHealthy?: number;
  Fat?: number;
  Carbs?: number;
  Fiber?: number;
  Sugar?: number;
  Protein?: number;
  Calories?: number;
  Water?: number;
  HighFat?: number;
  HighCarbs?: number;
  HighFiber?: number;
  HighSugar?: number;
  HighWater?: number;
  HighCalories?: number;
  HighProtein?: number;
  score?: number;
  //mixed/mcq
  type?: string;
  question?: string;
  options?: QuestionOption[];
  selectedOption?: string;
  id?: string | number;
  answer?: number[];
  reason?: string;
}

interface MyState {
  nutrientsData: FoodItem[];
  addNutrientsData: (food: FoodItem[]) => void;
  updateNutrientsData: (food: { id: string; score: number }) => void;
  clearLocalStorage: () => void;
}
const useNutrientsStore = create<MyState>()(
  persist(
    (set, get) => ({
      nutrientsData: [],
      addNutrientsData: (newData: FoodItem[]) => {
        if (newData) {
          // Update the scorecard state
          set({ nutrientsData: newData });
        }
      },
      updateNutrientsData: (newData: { id: string; score: number }) => {
        if (newData) {
          // replace the existing data with the new data
          const updatedData = get().nutrientsData.map((item) => {
            if (item.id === newData.id) {
              return { ...item, score: newData.score };
            }
            return item;
          });
          set({ nutrientsData: updatedData });
        }
      },
      clearLocalStorage: () => {
        // Clear the local storage
        sessionStorage.removeItem("nutrients-storage");
        // Update the scorecard state to clear the scores
        set({ nutrientsData: [] });
      },
    }),
    {
      name: "nutrients-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useNutrientsStore;
