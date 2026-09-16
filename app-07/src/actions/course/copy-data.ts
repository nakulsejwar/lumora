"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface Payload {
  data: string; // topic/level/game/tile
  copy_from: string; // respective course/topic/level/game id
  copy_to: string; // id
}

export const copyCourseData = async (content: Payload) => {
  //   console.log(content);
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/copy-data/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("copy course data", data);

    return { success: data };
  } catch (error) {
    console.log("update field error", error);
    return { error: (error as AxiosError).message };
  }
};
