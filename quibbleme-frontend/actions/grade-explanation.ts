"use server";

import { getTokenServer } from "@/lib/utils/utils.server";
import axios from "axios";

interface GradeExplanationPayload {
  userId: string;
  gameId: string;
  tileId: string;
  explanation: string;
}

export interface ExplanationFeedback {
  is_reasonable: boolean;
  quality?: "strong" | "partial" | "needs_work";
  score?: number;
  identified_evidence?: boolean;
  made_connection?: boolean;
  feedback: string;
  next_step?: string;
  is_fallback?: boolean;
}

const FALLBACK_FEEDBACK: ExplanationFeedback = {
  is_reasonable: true,
  quality: "partial",
  score: 3,
  identified_evidence: true,
  made_connection: true,
  feedback: "Thanks for sharing your thinking!",
  next_step: "Keep explaining your thoughts on future questions!",
  is_fallback: true,
};

export const gradeExplanation = async (
  content: GradeExplanationPayload
): Promise<ExplanationFeedback> => {
  const token = await getTokenServer();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/grade-explanation/`,
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!data || typeof data.feedback !== "string") {
      return FALLBACK_FEEDBACK;
    }
    return {
      is_reasonable: !!data.is_reasonable,
      quality: data.quality || "partial",
      score: typeof data.score === "number" ? data.score : 3,
      identified_evidence: data.identified_evidence !== undefined ? !!data.identified_evidence : true,
      made_connection: data.made_connection !== undefined ? !!data.made_connection : true,
      feedback: data.feedback,
      next_step: data.next_step || "Keep looking for clues in the text!",
      is_fallback: !!data.is_fallback,
    };
  } catch (error) {
    console.error("gradeExplanation failed:", error);
    return FALLBACK_FEEDBACK;
  }
};
