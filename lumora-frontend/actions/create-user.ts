"use server";

import { getTokenServer, getUserServer } from "@/lib/utils/utils.server";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export const createUser = async (content: string) => {
  const user = await getUserServer();
  const token = await getTokenServer();
  const payload = JSON.parse(content);

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/create-user/`,
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
