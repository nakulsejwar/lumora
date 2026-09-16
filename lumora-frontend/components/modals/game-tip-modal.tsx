"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGameTipModal } from "@/lib/hooks/use-game-tip-modal";
import { XIcon } from "lucide-react";

import DOMPurify from "dompurify";
import { emphasizeText } from "@/lib/utils";
import { useGameStore } from "@/lib/hooks/use-game";
import MarkdownTextView from "../markdown-text-view";
export const GameTipModal = () => {
  const gameInfoModal = useGameTipModal();
  const { game } = useGameStore();

  return (
    <Dialog open={gameInfoModal.isOpen} onOpenChange={gameInfoModal.onClose}>
      <DialogContent className=" p-5 overflow-hidden border-none bg-transparent shadow-none  ">
        <Card className="  border border-blue-200 relative">
          <XIcon
            onClick={gameInfoModal.onClose}
            className="absolute top-2 right-2 text-blue-300 cursor-pointer"
          />
          <CardContent className="flex flex-col items-center justify-center px-5 py-6 text-sm md:text-base ">
            <MarkdownTextView
              text={`${emphasizeText(game.Name, game.inGameTip)}`}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
