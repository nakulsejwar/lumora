"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLoadingModal } from "@/lib/hooks/use-loading-modal";

export const LoadingModal = () => {
  const loadingModal = useLoadingModal();

  return (
    <Dialog open={loadingModal.isOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-none focus:outline-none  bg-transparent">
        <div className=" flex items-center justify-center gap-2 border-none focus:outline-none">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
