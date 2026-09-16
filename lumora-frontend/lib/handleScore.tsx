import { Question, CardSwipeDirection } from "@/types/game.types";
import { sendGTMEvent } from "@next/third-parties/google";
import { useGameStore } from "./hooks/use-game";
import { showValidationToast } from "@/lib/hooks/use-validation-toast";

type Props = {
  direction: CardSwipeDirection | "";
  type: string;
  selectedOptions?: number[];
  score: number;
  question?: Question;
  cards?: Question[];
  updateNutrientsData: (food: { id: string; score: number }) => void;
};

export const handleScore = ({
  direction,
  type,
  selectedOptions,
  score,
  question,
  cards,
  updateNutrientsData,
}: Props) => {
  let scoreIncrement = 0;
  if (!question) return score;

  if (
    type.toLowerCase() === "mcq" &&
    selectedOptions !== undefined &&
    selectedOptions.length > 0
  ) {
    const isValid = question.isMultiCorrect
      ? selectedOptions.every((option) =>
          question.correctOption.includes(option as never)
        )
      : selectedOptions.length === 1 &&
        question.correctOption.includes(selectedOptions[0] as never);

    scoreIncrement = isValid ? 1 : 0;
  } else {
    const right =
      question.correctOption.toString() === "yes" && direction === "right";
    const left =
      question.correctOption.toString() === "no" && direction === "left";

    scoreIncrement = right || left ? 1 : 0;
  }

  const game = useGameStore.getState().game;

  if (scoreIncrement) {
    updateNutrientsData({
      id: question.tileid ? question.tileid : question.qid,
      score: scoreIncrement,
    });

    showValidationToast(
      "success",
      "Correct!",
      "Nice work — you found the evidence."
    );

    sendGTMEvent({
      event: "correctAnswer",
      score: scoreIncrement,
      foodName: question.question,
      gameId: game.GameId,
      gameName: game.Name,
      gameTitle: game.Title,
    });
  } else {
    updateNutrientsData({
      id: question.tileid ? question.tileid : question.qid,
      score: scoreIncrement,
    });

    showValidationToast(
      "error",
      "Not quite",
      "Look back at the passage and try again."
    );

    sendGTMEvent({
      event: "wrongAnswer",
      score: scoreIncrement,
      foodName: question.question,
      gameId: game.GameId,
      gameName: game.Name,
      gameTitle: game.Title,
    });
  }

  //const set data ito cnik snosl niiisk )ll
  return score + scoreIncrement;
};
