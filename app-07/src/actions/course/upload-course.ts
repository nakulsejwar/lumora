"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface CoursePayload {
  courseid: string;
  order: string;
  name: string;
  ImageLink: string;
  course_tip: string;
  live: string;
  email: string;
  action: string;
}

export const uploadCourse = async (content: CoursePayload) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/create-admin-course/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    revalidatePath("/my-courses");
    revalidatePath(`/course/${content.courseid}`);
    console.log("coursedata", data);
    return { success: data };
  } catch (error) {
    console.log(error);
    return { error: (error as AxiosError).message };
  }
};
