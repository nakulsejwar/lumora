// loggingStore.ts
import { StateCreator, create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LogData {
  event_type: string;
  event_name: string;
  timestamp: string;
  current_game: string;
  next_game?: string | null; // Add any other fields as needed
}

interface LoggingState {
  logs: LogData[];
  addLog: (logData: LogData) => void;
}
const useLoggingStore = create(
  persist(
    (set, get: () => { logs: LogData[] }) => ({
      logs: [],
      addLog: (logData: LogData) => set({ logs: [...get().logs, logData] }),
    }),
    {
      name: "logging-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useLoggingStore;
