"use server";
import axios, { AxiosError } from "axios";

export async function generateCoursesQueue(content: any) {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/queue-course-creation/",
      content,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
