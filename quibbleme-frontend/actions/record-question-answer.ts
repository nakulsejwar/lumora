"use server";

import { getTokenServer } from "@/lib/utils/utils.server";
import axios from "axios";

interface RecordAnswerPayload {
  userId: string;
  gameId: string;
  tileId: string;
  selectedOptions: number[];
}

export const recordQuestionAnswer = async (content: RecordAnswerPayload) => {
  const token = await getTokenServer();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/record-question-answer/`,
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return data;
  } catch (error) {
    // Best-effort by design: skill-mastery tracking should never break the
    // actual question flow. We still log loudly here (not a silent catch)
    // so a real backend problem is visible during development.
    console.error("recordQuestionAnswer failed:", error);
    return null;
  }
};
