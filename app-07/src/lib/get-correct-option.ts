import { McqQuestion } from "@/types/draft";

// Function to determine the correct option number
export function getCorrectOptionNumber(
  tileItem: McqQuestion,
  options: string[]
): number {
  for (let i = 0; i < options.length; i++) {
    if (tileItem.correct_answer.toLowerCase() === options[i].toLowerCase()) {
      return i + 1; // Return the option number (1-indexed)
    }
  }
  if (tileItem.correct_answer.toLowerCase() === "option1") {
    return 1;
  } else if (tileItem.correct_answer.toLowerCase() === "option2") {
    return 2;
  } else if (tileItem.correct_answer.toLowerCase() === "option3") {
    return 3;
  } else if (tileItem.correct_answer.toLowerCase() === "option4") {
    return 4;
  }
  return 1; // Return 1 if correct answer is not found in provided options
}
