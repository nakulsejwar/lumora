"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface Payload {
  data: string; // course/topic/level/game
  uid: string; // respective course/topic/level/game id
  field: string; // order
  value: string; // new value
}

export const updateFieldValue = async (content: Payload, courseId?: string) => {
  //   console.log(content);
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/update-field-value/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("update field", data);

    return { success: data };
  } catch (error) {
    console.log("update field error", error);
    return { error: (error as AxiosError).message };
  }
};
