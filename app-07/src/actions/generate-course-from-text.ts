"use server";

import axios from "axios";
import { strict_output } from "@/lib/gemini";

export default async function generateCourseFromText({
  text,
}: {
  text: string;
}) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/lumora/generate-course-app07/";
    try {
      const { data } = await axios.post(backendUrl, { topic: text.slice(0, 200), modules: 3 }, { timeout: 60000 });
      if (data && typeof data === "object" && data.course_name && Array.isArray(data.modules)) {
        return {
          courseData: data,
          prompt: `Generate course from text: ${text.slice(0, 100)}`,
        };
      }
    } catch (apiErr: any) {
      console.warn(`[APP-07] Dedicated Course AI endpoint call failed: ${apiErr?.message}.`);
    }

    const aiResponse = await strict_output(
      "Based on the following text, create a detailed course structure. The structure should be in JSON format with fields: course_name, course_description (300-400 words), modules (id, module_name, module_description 300-400 words), and levels (id, level_name, level_description 300-400 words). Generate REAL titles and descriptions. NEVER output placeholder text like 'moduleName' or 'string'.",
      `Text: """ ${text} """`,
      {
        course_name: "Course Title based on text",
        course_description: "Detailed 300-400 word course overview based on text.",
        modules: [
          {
            id: "mod_1",
            module_name: "Module 1: Primary Reading Theme",
            module_description: "Detailed 300-400 word description of module.",
            levels: [
              {
                id: "lev_1",
                level_name: "Lesson 1: Reading Passages & Clues",
                level_description: "Detailed 300-400 word lesson description.",
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

    return {
      courseData: courseData || aiResponse?.response,
      prompt: aiResponse.prompt,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
