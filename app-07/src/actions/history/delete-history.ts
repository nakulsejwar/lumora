"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export const deleteHistory = async (uid: string) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/delete-admin-history/",
      {
        uid,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath("/my-courses");
    return { success: data };
  } catch (error) {
    return { error: (error as AxiosError).message };
  }
};
