"use client";
import React from "react";
import { toast } from "sonner";
import { ValidationToast, ToastType } from "@/components/ui/validation-toast";

let activeToastId: string | number | null = null;

export const showValidationToast = (
  type: ToastType,
  title: string,
  message?: string
) => {
  // Dismiss previous toast immediately so validation messages don't stack
  if (activeToastId !== null) {
    toast.dismiss(activeToastId);
    activeToastId = null;
  }
  toast.dismiss();

  activeToastId = toast.custom(
    (t) => (
      <ValidationToast
        type={type}
        title={title}
        message={message}
        onClose={() => {
          toast.dismiss(t);
          activeToastId = null;
        }}
      />
    ),
    {
      position: "top-center",
      duration: 2800,
      unstyled: true,
      className: "!bg-transparent !border-0 !shadow-none !p-0 w-full flex justify-center",
      style: {
        background: "transparent",
        border: "none",
        boxShadow: "none",
        padding: 0,
      },
    }
  );
};
