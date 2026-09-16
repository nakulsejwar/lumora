"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface Tile {
  tileid: string;
  gameid: string;
  qno: number;
  type: string;
  question: string;
  questionTip: string;
  correct: string;
  op1?: string;
  op1Link?: string;
  op2?: string;
  op2Link?: string;
  op3?: string;
  op3Link?: string;
  op4?: string;
  op4Link?: string;
  op5?: string;
  op5Link?: string;
  op6?: string;
  op6Link?: string;
  op7?: string;
  op7Link?: string;
  op8?: string;
  op8Link?: string;
  reason: string;
  live: string;
  skill_tag?: string | null;
  has_reasoning_prompt?: boolean;
}

interface TilesPayload {
  tiles: Tile[];
  action: string;
}

export const uploadTiles = async (content: TilesPayload, courseId?: string) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/create-admin-tile/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("tiledata", data);
    import("fs").then(fs => fs.appendFileSync("debug_uploadTiles.log", JSON.stringify(content, null, 2) + "\n"));

    revalidatePath("/my-courses");
    revalidatePath(`/course/${courseId}`);

    return { success: data };
  } catch (error) {
    console.log("tiles", error);
    return { error: (error as AxiosError).message };
  }
};
