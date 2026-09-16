"use server";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";

export async function getBookData(id: string) {
  try {
    const session = await auth();
    if (!session?.user)
      return { error: { status_code: 401, message: "Unauthorized" } };
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/library/books/detail/",
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
