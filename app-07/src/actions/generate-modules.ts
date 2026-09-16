"use server";

import { strict_output_chat } from "@/lib/gemini";
import { ChatSchema } from "@/schemas/game";
import { z } from "zod";
const ChatDataArraySchema = z.array(ChatSchema);
type Chat = z.infer<typeof ChatDataArraySchema>;
export default async function generateModules({
  chat_history,
  user_prompt,
}: {
  chat_history: Chat;
  user_prompt: string;
}) {
  try {
    const aiResponse = await strict_output_chat(
      chat_history,
      `Generate additional modules. ${user_prompt}. Make sure you only send me the newly generated modules and not the existing course data. Generate real, engaging module and lesson titles. NEVER output placeholder text like 'moduleName' or 'string'.`,
      [
        {
          id: "mod_new_1",
          module_name: "Module Title: Advanced Concepts",
          module_description: "Detailed 300-400 word description of this new reading module.",
          levels: [
            {
              id: "lev_new_1",
              level_name: "Lesson 1: Deep Reading Analysis",
              level_description: "Detailed 300-400 word description of this lesson.",
            },
          ],
        },
      ]
    );

    console.log("regenrateModule____________", aiResponse);
    if (aiResponse.response.statusCode !== 200) {
      return { error: aiResponse.response.body };
    }

    let parsedModule: any = null;
    const bodyText = aiResponse.response?.body || "{}";
    try {
      parsedModule = JSON.parse(bodyText);
    } catch (e) {
      const match = bodyText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try {
          parsedModule = JSON.parse(match[0]);
        } catch (matchErr) {}
      }
    }

    if (!parsedModule) {
      return { error: "AI service returned unparseable text. Please try again." };
    }

    // Sanitize any remaining placeholder strings in parsedModule
    const sanitizeModule = (m: any, mIdx: number) => {
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
    };

    if (Array.isArray(parsedModule)) {
      parsedModule = parsedModule.map((m: any, idx: number) => sanitizeModule(m, idx));
    } else if (typeof parsedModule === 'object' && parsedModule !== null) {
      parsedModule = sanitizeModule(parsedModule, 0);
    }

    return {
      success: {
        module: parsedModule,
        prompt: aiResponse.prompt,
      },
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
