// loggingService.ts
import { useStore } from "zustand";
import useLoggingStore, { LogData } from "./hooks/use-logging-store";

const logEvent = (eventData: LogData) => {
  console.log("eventData", eventData);
  sessionStorage.setItem("logs", JSON.stringify(eventData));
  // try {
  //   const { addLog } = useStore(useLoggingStore);
  // } catch (error) {
  //   console.log(error);
  // }
};

const clearLogs = () => {
  useLoggingStore.persist.clearStorage();
};

export { logEvent, clearLogs };
