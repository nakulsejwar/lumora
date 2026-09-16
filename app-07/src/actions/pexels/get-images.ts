"use server";
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
interface ErrorRes {
  status_code: number;
  message: string;
}
export async function getImage(query: string) {
  try {
    const session = await auth();
    if (!session?.user)
      return { error: { status_code: 401, message: "Unauthorized" } };
    const { data } = await axios.get(
      `https://api.pexels.com/v1/search?query=${query}/`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data as ErrorRes;
    return { error: data };
  }
}
