"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface HistoryPayload {
  uid: string;
  useremail: string;
  history: any;
}

export const saveHistory = async (content: HistoryPayload) => {
  console.log(content);
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/save-admin-history/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath("/my-courses");

    return { success: data, content };
  } catch (error) {
    return { error: (error as AxiosError).message };
  }
};
