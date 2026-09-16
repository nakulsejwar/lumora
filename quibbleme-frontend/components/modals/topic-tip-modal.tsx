"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import MarkdownTextView from "../markdown-text-view";
import { useTopicTipModal } from "@/lib/hooks/use-topic-tip-modal";
export const TopicTipModal = ({ item }: { item: string }) => {
  const topicTipModal = useTopicTipModal();

  if (!topicTipModal.isOpen) return null;

  if (!item || item === "None") {
    topicTipModal.onClose();
    return null;
  }

  return (
    <Dialog open={topicTipModal.isOpen} onOpenChange={topicTipModal.onClose}>
      <DialogContent className=" p-5 overflow-hidden border-none bg-transparent shadow-none  ">
        <Card className="  border border-blue-200 relative">
          <XIcon
            onClick={topicTipModal.onClose}
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
