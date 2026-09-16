"use server";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";

export async function getBlogData(id: string) {
  try {
    const session = await auth();
    if (!session?.user)
      return { error: { status_code: 401, message: "Unauthorized" } };
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/fetch-blog-by-id/",
      { blog_id: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: data[0] };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
