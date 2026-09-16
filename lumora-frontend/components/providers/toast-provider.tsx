"use client";

import React, { FC, ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

const ToastProvider: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default ToastProvider;
