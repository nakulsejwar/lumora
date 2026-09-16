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
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PushToLiveAlertDialog({
  courseId,
  live,
}: {
  courseId: string;
  live: string;
}) {
  const queryClient = useQueryClient();
  const loadingModal = useLoadingModal();

  const onClose = async () => {
    loadingModal.onOpen();
    try {
      const content = {
        data: "course",
        uid: courseId,
        live: live === "yes" ? "no" : "yes",
      };

      const { success, error } = await toggleLive(content);
      if (success) {
        toast.success(`success`);
        await queryClient.invalidateQueries({
          queryKey: ["course", { courseId }],
        });
      }
      if (error) throw error;
    } catch (error) {
      toast.error("Failed ");
    } finally {
      loadingModal.onClose();
    }
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
          {live === "yes" ? "Remove " : "Turn "} live
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {live === "yes" ? "Remove from" : "Push to"} live
          </AlertDialogTitle>
          <AlertDialogDescription>
            The course will be made {live === "yes" ? "private" : "public"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
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
