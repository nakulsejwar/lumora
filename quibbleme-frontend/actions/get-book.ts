"use server";
import axios, { AxiosError } from "axios";

export async function getBookData(id: string) {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/library/books/detail/`,
      { book_id: id, blog_id: id },
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

export const getBlogData = getBookData;
