"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export const deleteCourseData = async (uid: string, courseData: string) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/delete-admin-data/",
      {
        data: courseData,
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
