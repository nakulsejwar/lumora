"use server";

import { strict_output } from "@/lib/gemini";

export default async function generateQuiz(content: string, length: number) {
  try {
    const aiResponse = await strict_output(
      "You are a helpful AI that is able to generate mcq questions and answers based on the given content. The length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array.",

      `You are to generate a set of ${length} multiple-choice questions (MCQs) with answers for the following html content ${content}. Provide proper reasoning for each correct answer. Please ignore the html tags`,
      {
        questions: [
          {
            question: "question",
            answer: "answer with max length of 15 words",
            option1: "option1 with max length of 15 words",
            option2: "option2 with max length of 15 words",
            option3: "option3 with max length of 15 words",
            reason:
              "proper reasoning for correct answer within 300 to 400 words",
          },
        ],
      }
    );

    const parsedData = JSON.parse(aiResponse.response.body);

    const quizQuestions = parsedData.questions.map((q: any, idx: number) => {
      const options = [q.option1, q.option2, q.option3, q.answer].sort(
        () => Math.random() - 0.5
      );
      return {
        tileid: `id-${idx + 1}`,
        question: q.question,
        qno: idx + 1,
        type: "mcq",
        isMultiCorrect: false,
        live: "no",
        reason: q.reason,
        questionTip: q.reason,
        options: [
          {
            option: options[0],
            image: "",
          },
          {
            option: options[1],
            image: "",
          },
          {
            option: options[2],
            image: "",
          },
          {
            option: options[3],
            image: "",
          },
        ],
        correctOption: [options.indexOf(q.answer) + 1],
      };
    });

    if (aiResponse.response.statusCode !== 200) {
      return { error: aiResponse.response.body };
    }
    return {
      success: quizQuestions,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export type Option = {
  option: string;
  image: string;
  isSelected?: boolean;
};

export type RelatedTile = {
  question: string;
  qno: number;
  gameid: string;
  tileid: string;
  type: string;
  questionTip: string;
  live: string;
  reason: string;
  isMultiCorrect: boolean;
  correctOption: number[];
  options: Option[];
};
