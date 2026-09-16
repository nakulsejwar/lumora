import { ChatSchema } from "@/schemas/game";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Chat = z.infer<typeof ChatSchema>;
const ChatDataArraySchema = z.array(ChatSchema);
type ChatArray = z.infer<typeof ChatDataArraySchema>;

interface MyState {
  chat: ChatArray;
  createChat: (chat: ChatArray) => void;
  updateChat: (chat: Chat) => void;
  clearChatSession: () => void;
}
const useChatSession = create<MyState>()(
  persist(
    (set, get) => ({
      chat: [],
      createChat: (newData: ChatArray) => {
        if (newData) {
          // Update the  state
          set({ chat: newData });
        }
      },
      updateChat: (newData: Chat) => {
        if (newData) {
          // replace the existing data with the new data
          const updatedData = get().chat;
          set({ chat: [...updatedData, newData] });
        }
      },
      clearChatSession: () => {
        // Clear the local storage
        sessionStorage.removeItem("chat-session");
        // Update the  state to clear the data
        set({ chat: [] });
      },
    }),
    {
      name: "chat-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useChatSession;
