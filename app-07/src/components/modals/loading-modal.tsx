"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoadingModal } from "@/hooks/use-loading-modal";

export const LoadingModal = () => {
  const loadingModal = useLoadingModal();

  if (!loadingModal.isOpen) return null;

  return (
    <Dialog open={loadingModal.isOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-none focus:outline-none  bg-transparent">
        <DialogTitle>
          <span className="sr-only">Loading Modal</span>
        </DialogTitle>
        <DialogDescription>
          <span className="sr-only">Loading Modal</span>
        </DialogDescription>
        <div className=" flex items-center justify-center gap-2 border-none focus:outline-none">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
