"use server";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleLive(content: any) {
  console.log(content);
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/update-live-field/",
      content,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`/course/${content.uid}`);
    revalidatePath("/my-courses");
    revalidatePath(`/course/${content.uid}`);
    return { success: data };
  } catch (error) {
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
