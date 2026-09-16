import React from "react";

export default function LoadingView() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className=" flex items-center justify-center gap-2 border-none focus:outline-none">
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
      </div>
    </div>
  );
}
