"use server";

import axios from "axios";
import { strict_output_chat } from "@/lib/gemini";
import { ChatSchema } from "@/schemas/game";
import { z } from "zod";
const ChatDataArraySchema = z.array(ChatSchema);
type Chat = z.infer<typeof ChatDataArraySchema>;
export default async function regenerateModule({
  chat_history,
  user_prompt,
  moduleId,
  items,
}: {
  chat_history: Chat;
  user_prompt: string;
  moduleId: string;
  items: string[];
}) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/lumora/regenerate-module-app07/";
    try {
      const { data } = await axios.post(backendUrl, { chat_history, user_prompt, moduleId, items }, { timeout: 60000 });
      if (data && typeof data === "object") {
        return {
          success: {
            module: data,
            prompt: user_prompt,
          },
        };
      }
    } catch (apiErr: any) {
      console.warn(`[APP-07] Dedicated Regenerate Module AI endpoint call failed: ${apiErr?.message}. Falling back.`);
    }

    const aiResponse = await strict_output_chat(
      chat_history,
      `  ${user_prompt}. Regenerate the module ${moduleId}. ${
        items.length
          ? "Consider the following points for module regeneration: " +
            items.join(" -/n ")
          : ""
      }. Generate real module and lesson names. NEVER output placeholder text like 'moduleName' or 'string'.`,
      {
        id: moduleId || "mod_regen_1",
        module_name: "Regenerated Module Title",
        module_description: "Detailed 300-400 word description of regenerated module.",
        levels: [
          {
            id: "lev_1",
            level_name: "Lesson 1: Key Reading Challenge",
            level_description: "Detailed 300-400 word description of lesson.",
          },
        ],
      }
    );

    console.log("regenrateModule____________", aiResponse);
    if (aiResponse.response.statusCode !== 200) {
      return { error: aiResponse.response.body };
    }

    let parsedMod: any = null;
    const bodyText = aiResponse.response?.body || "{}";
    try {
      parsedMod = JSON.parse(bodyText);
    } catch (e) {
      const match = bodyText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        try {
          parsedMod = JSON.parse(match[0]);
        } catch (matchErr) {}
      }
    }

    if (!parsedMod) {
      return { error: "AI service returned unparseable text. Please try again." };
    }

    // Sanitize any remaining placeholder strings in parsedMod
    if (typeof parsedMod === 'object' && parsedMod !== null) {
      const modName = (!parsedMod.module_name || parsedMod.module_name.includes("moduleName"))
        ? `Regenerated Module`
        : parsedMod.module_name;
      const modDesc = (!parsedMod.module_description || parsedMod.module_description.includes("between 300-400 words"))
        ? `Explore key reading passages and comprehension challenges.`
        : parsedMod.module_description;
      let levels = parsedMod.levels;
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
      parsedMod = { ...parsedMod, module_name: modName, module_description: modDesc, levels };
    }

    return {
      success: {
        module: parsedMod,
        prompt: aiResponse.prompt,
      },
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
