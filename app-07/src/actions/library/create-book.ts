"use server";

import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export interface BookPayload {
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

export type BlogPayload = BookPayload;

interface ErrorRes {
  status_code: number;
  message: string;
}

export const createBook = async (payload: BookPayload) => {
  const session = await auth();

  if (!session?.user)
    return { error: { status_code: 401, message: "Unauthorized" } };
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/library/books/create/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath("/library");
    revalidatePath("/my-blogs");

    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data as ErrorRes;
    return { error: data };
  }
};

export const createBlog = createBook;
