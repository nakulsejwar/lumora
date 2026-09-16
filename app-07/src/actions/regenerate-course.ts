"use server";

import axios from "axios";
import { strict_output_chat } from "@/lib/gemini";
import { ChatSchema } from "@/schemas/game";
import { z } from "zod";
const ChatDataArraySchema = z.array(ChatSchema);
type Chat = z.infer<typeof ChatDataArraySchema>;
export default async function regenerateCourse({
  chat_history,
  user_prompt,
  items,
}: {
  chat_history: Chat;
  user_prompt: string;
  items: string[];
}) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/lumora/regenerate-course-app07/";
    try {
      const { data } = await axios.post(backendUrl, { chat_history, user_prompt, items }, { timeout: 60000 });
      if (data && typeof data === "object" && data.course_name && Array.isArray(data.modules)) {
        return {
          success: {
            courseData: data,
            prompt: user_prompt,
          },
        };
      }
    } catch (apiErr: any) {
      console.warn(`[APP-07] Dedicated Regenerate Course AI endpoint call failed: ${apiErr?.message}. Falling back.`);
    }

    const aiResponse = await strict_output_chat(
      chat_history,
      `  ${user_prompt}. Please regenerate the course. ${
        items.length
          ? "Consider the following points for course regeneration: " +
            items.join(" /n ")
          : ""
      }. Generate real module and lesson names. NEVER output placeholder text like 'moduleName' or 'string'.`,
      {
        course_name: "Regenerated Course Title",
        course_description: "Detailed 300-400 word course overview and goals.",
        modules: [
          {
            id: "mod_1",
            module_name: "Module 1: Primary Reading Focus",
            module_description: "Detailed 300-400 word description of module concepts.",
            levels: [
              {
                id: "lev_1",
                level_name: "Lesson 1: Reading Challenge",
                level_description: "Detailed 300-400 word lesson description.",
              },
            ],
          },
        ],
      }
    );

    if (aiResponse.response.statusCode !== 200) {
      return { error: aiResponse.response.body };
    }
    console.log("regenrateCourse____________", aiResponse);

    let parsedCourse: any = null;
    const bodyText = aiResponse.response?.body || "{}";
    try {
      parsedCourse = JSON.parse(bodyText);
    } catch (e) {
      const match = bodyText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try {
          parsedCourse = JSON.parse(match[0]);
        } catch (matchErr) {}
      }
    }

    if (!parsedCourse) {
      return { error: "AI service returned unparseable text. Please try again." };
    }

    // Sanitize any remaining placeholder strings in parsedCourse
    if (parsedCourse.modules && Array.isArray(parsedCourse.modules)) {
      parsedCourse.modules = parsedCourse.modules.map((m: any, mIdx: number) => {
        const modName = (!m.module_name || m.module_name.includes("moduleName"))
          ? `Module ${mIdx + 1}`
          : m.module_name;
        const modDesc = (!m.module_description || m.module_description.includes("between 300-400 words"))
          ? `Explore key reading passages and comprehension challenges.`
          : m.module_description;
        
        let levels = m.levels;
        if (Array.isArray(levels)) {
          levels = levels.map((l: any, lIdx: number) => {
            const levName = (!l.level_name || l.level_name === "string" || l.level_name.includes("levelName"))
              ? `Lesson ${lIdx + 1}`
              : l.level_name;
            const levDesc = (!l.level_description || l.level_description.includes("between 300-400 words"))
              ? `Read the passage carefully and answer reading comprehension questions.`
              : l.level_description;
            return { ...l, level_name: levName, level_description: levDesc };
          });
        }
        return { ...m, module_name: modName, module_description: modDesc, levels };
      });
    }

    return {
      success: {
        courseData: parsedCourse,
        prompt: aiResponse.prompt,
      },
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
