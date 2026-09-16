"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export const deleteBlog = async (uid: string) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/delete-blog/",
      {
        blog_id: uid,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath("/my-blogs");
    return { success: data };
  } catch (error) {
    return { error: (error as AxiosError).message };
  }
};
