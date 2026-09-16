"use client";
import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { motion } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ValidationToastProps {
  type: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export const ValidationToast: React.FC<ValidationToastProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const configs = {
    success: {
      bgColor: "bg-[#059669]",
      borderColor: "border-[#047857]",
      textColor: "text-white",
      subTextColor: "text-[#ecfdf5]",
      icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
    },
    error: {
      bgColor: "bg-[#b91c1c]",
      borderColor: "border-[#991b1b]",
      textColor: "text-white",
      subTextColor: "text-[#fef2f2]",
      icon: <AlertCircle className="w-5 h-5 text-white shrink-0" />,
    },
    warning: {
      bgColor: "bg-[#d97706]",
      borderColor: "border-[#b45309]",
      textColor: "text-white",
      subTextColor: "text-[#fffbe6]",
      icon: <AlertTriangle className="w-5 h-5 text-white shrink-0" />,
    },
    info: {
      bgColor: "bg-[#070235]",
      borderColor: "border-[#0091cf]",
      textColor: "text-white",
      subTextColor: "text-[#eaedff]",
      icon: <Info className="w-5 h-5 text-[#89ceff] shrink-0" />,
    },
  };

  const config = configs[type] || configs.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border ${config.bgColor} ${config.borderColor} ${config.textColor} w-[calc(100%-32px)] sm:w-auto min-w-[280px] max-w-[440px] mx-auto pointer-events-auto my-2`}
    >
      {config.icon}
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-sm font-extrabold tracking-tight leading-tight">
          {title}
        </h4>
        {message && (
          <p
            className={`text-xs font-medium ${config.subTextColor} leading-snug line-clamp-2 mt-0.5`}
          >
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/15 transition-colors shrink-0 text-white/80 hover:text-white"
          title="Close Toast"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
