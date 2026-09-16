"use server";
import { strict_output } from "@/lib/gemini";
import { isValid } from "zod";

export async function validateQuestion(
  question: any,
  topic: string,
  content?: string
) {
  // const response = await getGroqChatCompletion(question, topic);
  const response = await getGeminiChatCompletion(question, topic);
  // Print the completion returned by the LLM.
  return response;
}


const getGeminiChatCompletion = async (question: string, topic: string) => {
  try {
    const aiResponse = await strict_output(
      "You are a helpful AI that is able to validate a given mcq question and its answers for a given topic and it's content and provide proper validation and reasoning if the mcq makes sense or not. If the question is not valid provide proper reasoning with the valid question for the given topic and its answer. Make sure that the new question you provide is similar to the given question or is relevent to the topic.",

      `Validate the following question and its answers for the topic ${topic}. Provide proper validation and reasoning if the question makes sense or not. \n\nQuestion: ${JSON.stringify(
        question
      )}`,
      {
        isValid: "yes or no",
        reason: "proper reasoning if the question makes sense or not",
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
    // console.log("aiResponse", aiResponse);

    // const response =
    //   aiResponse.response.body.replace(/'/g, '"') ??
    //   "Unexpected OpenAI response";
    const parsedData = JSON.parse(aiResponse.response.body);

    const quizQuestions = parsedData.questions.map((q: any, idx: number) => {
      // mix up the options lol
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
      success: {
        tile: quizQuestions[0],
        isValid: parsedData.isValid,
        reason: parsedData.reason,
      },
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};
