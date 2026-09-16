"use server";
import axios, { AxiosError } from "axios";

export async function getQueueData(email: string) {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/get-queue-data/",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("queue", data);
    return { success: data };
  } catch (error) {
    console.log("queue", error);
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
