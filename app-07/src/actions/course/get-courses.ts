"use server";
import axios, { AxiosError } from "axios";

export async function getCourses(email: string, courseid?: string) {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/get-admin-courses/",
      { email, courseid },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("coursedata  - courseID", courseid, "id---------", data);
    return { success: data };
  } catch (error) {
    console.log(error);
    const data = (error as AxiosError).response?.data;
    return { error: data };
  }
}
