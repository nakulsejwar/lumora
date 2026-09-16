"use server";

import { getTokenServer } from "@/lib/utils/utils.server";
import axios from "axios";

interface GenerateLessonPayload {
  userId: string;
  level_id: string;
  grade: string;
  difficulty: string;
}

export interface GeneratedLesson {
  gameid: string;
  name: string;
  passage_text: string;
  grade_band: string;
  difficulty: string;
  target_skill: string;
  question_count: number;
}

type GenerateLessonResult =
  | { success: true; game: GeneratedLesson }
  | { success: false };

// Note: deliberately no `weakest_skill` field in the payload above -- the
// frontend never chooses it. The backend authenticates the request and
// derives the weakest skill itself from the learner's real mastery data.
export const generateNextLesson = async (
  content: GenerateLessonPayload
): Promise<GenerateLessonResult> => {
  const token = await getTokenServer();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/generate-adaptive-lesson/`,
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!data || data.error || !data.gameid) {
      console.error("generateNextLesson: backend reported an error:", data?.error);
      return { success: false };
    }
    return { success: true, game: data as GeneratedLesson };
  } catch (error) {
    // Never expose backend/OpenRouter error details to the learner -- the
    // caller shows a single friendly retry message regardless of cause.
    console.error("generateNextLesson failed:", error);
    return { success: false };
  }
};
