"use server";

import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
export interface BlogPayload {
  createdBy: any;
  user_email: string;
  quiz: any;
  metadata: any;
  category: string;
  tags: string[];

  title: string;
  content: string;
  isLive: boolean;
  ImgUrl?: string;
}
interface ErrorRes {
  status_code: number;
  message: string;
}
export const createBlog = async (payload: BlogPayload) => {
  const session = await auth();

  if (!session?.user)
    return { error: { status_code: 401, message: "Unauthorized" } };
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/create-blog/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath("/my-blogs");

    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data as ErrorRes;
    return { error: data };
  }
};
