"use server";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";

export async function getAllBlogs() {
  try {
    const session = await auth();
    if (!session?.user)
      return { error: { status_code: 401, message: "Unauthorized" } };
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/fetch-admin-blogs/",
      { user_email: session.user.email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: data.reverse() };
  } catch (error) {
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
