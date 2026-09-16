"use server";

import { getTokenServer } from "@/lib/utils/utils.server";
import { SkillMasteryRow } from "@/lib/skill-info";
import axios from "axios";

export const getSkillMastery = async (
  userId: string
): Promise<SkillMasteryRow[] | null> => {
  const token = await getTokenServer();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/get-skill-mastery/`,
      JSON.stringify({ userId }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!Array.isArray(data)) return null;
    return data as SkillMasteryRow[];
  } catch (error) {
    console.error("getSkillMastery failed:", error);
    return null;
  }
};
