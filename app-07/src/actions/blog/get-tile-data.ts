"use server";
import axios, { AxiosError } from "axios";

interface ErrorRes {
  status_code: number;
  message: string;
}

export async function fetchTileData(tileid: string) {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/fetch-tile/",
      { tileid },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: data };
  } catch (error) {
    const data = (error as AxiosError).response?.data as ErrorRes;
    return { error: data };
  }
}
