"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface Level {
  topic_id: string;
  level_id: string;
  order: string | number;
  name: string;
  ImageLink: string;
  level_tip: string;
  live: string;
}

interface LevelPayload {
  levels: Level[];
  action: string;
}

export const uploadLevels = async (content: LevelPayload) => {
  console.log(content);
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/create-admin-level/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("leveldata", data);
    revalidatePath("/my-courses");

    return { success: data };
  } catch (error) {
    console.log("levels", error);
    return { error: (error as AxiosError).message };
  }
};
