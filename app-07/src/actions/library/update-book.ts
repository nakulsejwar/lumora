"use server";

import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export interface BookUpdatePayload {
  book_id?: string;
  blog_id?: string;
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

export type BlogUpdatePayload = BookUpdatePayload;

interface ErrorRes {
  status_code: number;
  message: string;
}

export const updateBook = async (payload: BookUpdatePayload) => {
  const session = await auth();

  if (!session?.user)
    return { error: { status_code: 401, message: "Unauthorized" } };
  try {
    const targetId = payload.book_id || payload.blog_id || "";
    const apiPayload = {
      ...payload,
      book_id: targetId,
      blog_id: targetId,
    };

    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/library/books/update/",
      apiPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidatePath(`/library`);
    revalidatePath(`/library/${targetId}`);
    revalidatePath(`/my-blogs`);

    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data as ErrorRes;
    return { error: data };
  }
};

export const updateBlog = updateBook;
