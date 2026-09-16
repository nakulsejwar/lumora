"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export const deleteBook = async (uid: string) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/library/books/delete/",
      {
        book_id: uid,
        blog_id: uid,
      },
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
    return { error: (error as AxiosError).message };
  }
};

export const deleteBlog = deleteBook;
