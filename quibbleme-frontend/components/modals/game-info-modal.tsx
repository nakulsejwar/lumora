"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGameInfoModal } from "@/lib/hooks/use-game-info-modal";
import { XIcon } from "lucide-react";
import DOMPurify from "dompurify";
import MarkdownTextView from "../markdown-text-view";
export const GameInfoModal = ({ item }: { item: string }) => {
  const gameInfoModal = useGameInfoModal();
  return (
    <Dialog open={gameInfoModal.isOpen} onOpenChange={gameInfoModal.onClose}>
      <DialogContent className=" p-5 overflow-hidden border-none bg-transparent shadow-none  ">
        <Card className="  border border-blue-200 relative">
          <XIcon
            onClick={gameInfoModal.onClose}
            className="absolute top-2 right-2 text-blue-300 cursor-pointer"
          />
          <CardContent className="flex flex-col items-center justify-center px-5 py-6 text-sm ">
            <MarkdownTextView
              text={`${item.replace(/<pagebreak>/g, "<br />")}`}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
