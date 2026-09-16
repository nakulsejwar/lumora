import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TipTapEditorCssClasses =
  " prose prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-p:m-0 prose-h1:text-xl prose-h2:text-lg text-sm";
