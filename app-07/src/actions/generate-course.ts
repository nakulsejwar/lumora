"use server";

import axios from "axios";
import { strict_output } from "@/lib/gemini";

export default async function generateCourse({
  topic,
  modules,
}: {
  topic: string;
  modules: number;
}) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/lumora/generate-course-app07/";
    console.log(`[APP-07] Calling dedicated Course AI layer at ${backendUrl} for topic='${topic}'`);
    
    try {
      const { data } = await axios.post(backendUrl, { topic, modules }, { timeout: 60000 });
      if (data && typeof data === "object" && data.course_name && Array.isArray(data.modules)) {
        console.log(`[APP-07] Course AI Layer generated course '${data.course_name}' with ${data.modules.length} modules successfully!`);
        return {
          courseData: data,
          prompt: `Generate course about ${topic} with ${modules} modules`,
        };
      }
    } catch (apiErr: any) {
      console.warn(`[APP-07] Dedicated Course AI endpoint call failed: ${apiErr?.message}. Falling back to strict_output.`);
    }

    // Fallback: strict_output pipeline
    const aiResponse = await strict_output(
      "You are a helpful AI that is able to generate a complete, high-quality course structure for a given topic with real module and lesson names. NEVER output placeholder text like 'moduleName' or 'string'.",
      `You are to generate a complete course structure about ${topic} with ${modules} module(s). Each module must have at least 2 levels (lessons).`,
      {
        course_name: `Mastering ${topic}`,
        course_description: `An immersive learning experience exploring ${topic} through reading, comprehension, and vocabulary.`,
        modules: [
          {
            id: "mod_1",
            module_name: `Module 1: Introduction to ${topic}`,
            module_description: `Explore the fundamental concepts and reading passages related to ${topic}.`,
            levels: [
              {
                id: "lev_1",
                level_name: `Lesson 1: Key Concepts`,
                level_description: `Read the story and analyze key ideas about ${topic}.`,
              },
            ],
          },
        ],
      }
    );

    let courseData: any = null;
    const bodyText = aiResponse.response?.body || "{}";
    try {
      courseData = JSON.parse(bodyText);
    } catch (e) {
      const match = bodyText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try {
          courseData = JSON.parse(match[0]);
        } catch (matchErr) {}
      }
    }

    if (!courseData) {
      return { error: "AI service returned unparseable text. Please try again." };
    }

    return {
      courseData: courseData,
      prompt: aiResponse.prompt,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
