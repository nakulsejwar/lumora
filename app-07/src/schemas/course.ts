import { z } from "zod";

export const courseCreationSchema = z.object({
  topic: z
    .string()
    .min(4, {
      message: "Topic must be at least 4 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    }),
  modules: z.number().min(1).max(5).default(2),
});
