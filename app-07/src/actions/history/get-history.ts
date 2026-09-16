"use server";
import axios, { AxiosError } from "axios";

export async function getHistory(useremail: string) {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/get-admin-history/",
      { useremail },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: data };
  } catch (error) {
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
