"use server";

import { getTokenServer, getUserServer } from "@/lib/utils/utils.server";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export const updateUser = async (content: string) => {
  const user = await getUserServer();
  const token = await getTokenServer();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/set-user-data/`,
      content,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    revalidatePath("/");
    return data;
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching user data");
  }
};
