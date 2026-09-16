"use server";

import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
export interface BlogUpdatePayload {
  blog_id: string;
  email: string;
  updates: {
    createdBy?: any;
    quiz?: any;
    metadata?: any;
    category?: string;
    tags?: string[];

    title?: string;
    content?: string;
    islive?: boolean;
    ImgUrl?: string;
  };
}
interface ErrorRes {
  status_code: number;
  message: string;
}
export const updateBlog = async (payload: BlogUpdatePayload) => {
  const session = await auth();

  if (!session?.user)
    return { error: { status_code: 401, message: "Unauthorized" } };
  try {
    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/edit-blog/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath(`/my-blogs`);
    revalidatePath(`/my-blogs/${payload.blog_id}`);

    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data as ErrorRes;
    return { error: data };
  }
};
