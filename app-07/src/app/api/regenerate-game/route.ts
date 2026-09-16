import { strict_output, strict_output_chat } from "@/lib/gemini";
import { courseGameRegenrateSchema } from "@/schemas/game";
import { Course, Game, McqQuestion, Levels, Module } from "@/types/draft";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chat_history, moduleId, levelId, gameId, userPrompt } =
      courseGameRegenrateSchema.parse(body);
    let aiResponse = await strict_output_chat(
      chat_history,

      `Please regenerate the game ${gameId} for level ${levelId} in module ${moduleId}. ${userPrompt} `,
      {
        games: [
          {
            id: "string",
            game_name: "a suitable game name",
            game_description:
              "Describe what the game is about. The description should be within 300-400 words",
            questions: [
              {
                id: "string",
                type: "true-false or mcq",
                question: "question",
                option1: "option1 with max length of 3 words",
                option2: "option2 with max length of 3 words",
                option3: "option3 with max length of 3 words",
                option4: "option3 with max length of 3 words",
                correct_answer: "should be one of the following option",
                reason:
                  "Explain why the correct answer is correct with proper reasoning.",
              },
            ],
          },
        ],
      }
    );

    console.log("aiResponse__________", aiResponse);

    return NextResponse.json(
      {
        games: JSON.parse(aiResponse?.response.body),
        prompt: aiResponse.prompt,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("elle gpt error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
