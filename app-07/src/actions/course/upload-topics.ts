"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface Topic {
  topic_id: string;
  courseid: string;
  order: string | number;
  name: string;
  ImageLink: string;
  topic_tip: string;
  live: string;
}

interface TopicPayload {
  topics: Topic[];
  action: string;
}

export const uploadTopics = async (content: TopicPayload) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/create-admin-topic/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    revalidatePath("/my-courses");
    console.log("topicdata", data);

    return { success: data };
  } catch (error) {
    console.log("topic", error);
    return { error: (error as AxiosError).message };
  }
};
