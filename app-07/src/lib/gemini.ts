import { ChatSchema } from "@/schemas/game";
import axios from "axios";
import { z } from "zod";
export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: any,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 1,
  verbose: boolean = false
) {
  // if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg: string = "";

  let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
    output_format
  )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

  const prompt = `
      ${system_prompt + output_format_prompt + error_msg}
  
      ${user_prompt.toString()}
      `;

  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/gemini/",
      { prompt: prompt }
    );

    let bodyStr = "{}";
    if (typeof data === "string") {
      bodyStr = data;
    } else if (data && typeof data === "object") {
      bodyStr = JSON.stringify(data);
    }

    return { 
      response: { 
        statusCode: 200, 
        body: bodyStr 
      }, 
      prompt 
    };
  } catch (error) {
    console.log(error);
    return { response: { statusCode: 500, body: "{}" }, prompt: "" };
  }
}

const ChatDataArraySchema = z.array(ChatSchema);
type Chat = z.infer<typeof ChatDataArraySchema>;

export async function strict_output_chat(
  chat_history: Chat,
  user_prompt: string,
  output_format?: any,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 1,
  verbose: boolean = false
) {
  let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
    output_format
  )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

  const msg = `${user_prompt + output_format_prompt}`;

  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/gemini/",
      { prompt: `chat history: ${JSON.stringify(chat_history)}. prompt: ${msg}` }
    );

    let bodyStr = "{}";
    if (typeof data === "string") {
      bodyStr = data;
    } else if (data && typeof data === "object") {
      bodyStr = JSON.stringify(data);
    }

    return { 
      response: { 
        statusCode: 200, 
        body: bodyStr
      }, 
      prompt: msg 
    };
  } catch (error) {
    return { response: { statusCode: 500, body: "{}" }, prompt: "" };
  }
}
