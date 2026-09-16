"use client";
import { toggleLive } from "@/actions/course/toggle-live";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function GenerateQuestionsAlertDialog({
  setQuizLength,
  handleAlertClose,
  content,
  title,
}: {
  setQuizLength: (value: number) => void;
  handleAlertClose: () => void;
  content: string;
  title: string;
}) {
  const queryClient = useQueryClient();
  const loadingModal = useLoadingModal();
  const [length, setLength] = useState<number>(0);

  const onClose = async () => {
    setQuizLength(length);
    handleAlertClose();
  };

  return (
    <AlertDialog
      onOpenChange={() => {
        setTimeout(() => (document.body.style.pointerEvents = ""), 100);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          size="sm"
          className="px-3"
          variant="outline"
        >
          {title} Questions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate Quiz Questions</AlertDialogTitle>
          <AlertDialogDescription>
            {!content || content.trim().length < 1000 ? (
              <p className="text-red-500 text-sm">
                {" "}
                Please add blog content to generate questions. Content should be
                more than 1000 characters.
              </p>
            ) : (
              <p>Enter number of questions you want to generate</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Input
            placeholder="Enter quiz length"
            disabled={!content || content.trim().length < 1000}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!content || content.trim().length < 1000}
            onClick={(e) => {
              onClose();
              e.stopPropagation();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
