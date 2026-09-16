import { z } from "zod";

// Define the Chat schema
export const ChatSchema = z.object({
  userPrompt: z.string(),
  modelResponse: z.string(),
});

export const courseGameCreationSchema = z.object({
  chat_history: z.array(ChatSchema),
  moduleId: z.string(),
  levelId: z.string(),
});

export const courseGameRegenrateSchema = z.object({
  chat_history: z.array(ChatSchema),
  moduleId: z.string(),
  levelId: z.string(),
  gameId: z.string(),
  userPrompt: z.string(),
});
