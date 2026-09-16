"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGameTipModal } from "@/lib/hooks/use-game-tip-modal";
import { XIcon } from "lucide-react";

import DOMPurify from "dompurify";
import { emphasizeText } from "@/lib/utils";
import { useGameStore } from "@/lib/hooks/use-game";
import MarkdownTextView from "../markdown-text-view";
import { useQuestionTipModal } from "@/lib/hooks/use-question-tip-modal";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
export const QuestionTipModal = () => {
  const questionTipModal = useQuestionTipModal();
  const { game } = useGameStore();
  const { gamedata } = useGameDataStore();

  if (!questionTipModal.qid) return null;
  const questionTip = gamedata.questions.filter(
    (item) => item.tileid === questionTipModal.qid
  );

  return (
    <Dialog
      open={questionTipModal.isOpen}
      onOpenChange={questionTipModal.onClose}
    >
      <DialogContent className=" p-5 overflow-hidden border-none bg-transparent shadow-none  ">
        <Card className="  border border-blue-200 relative">
          <XIcon
            onClick={questionTipModal.onClose}
            className="absolute top-2 right-2 text-blue-300 cursor-pointer"
          />
          <CardContent className="flex flex-col items-center justify-center px-5 py-6 text-sm md:text-base ">
            <MarkdownTextView
              text={`${emphasizeText(game.Name, questionTip[0].questionTip!)}`}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
