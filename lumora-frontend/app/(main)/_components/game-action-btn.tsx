"use client";
import { useGameStore } from "@/lib/hooks/use-game";
import { getBgColorClass } from "@/lib/utils";
import { IsDragOffBoundary } from "@/types/game.types";
import { motion } from "framer-motion";
import { copyFile } from "fs";

import { X, Check } from "lucide-react";
import { usePathname } from "next/navigation";
const actionPropsMatrix = {
  left: {
    ariaLabel: "Swipe Left",
    bgColorClass: "bg-answerBad-500",
    icon: X,
    type: "NO",
    iconBaseColorClass: "text-[#701823]",
  },
  right: {
    ariaLabel: "Swipe Right",
    bgColorClass: "bg-answerGood-500",
    icon: Check,
    type: "YES",
    iconBaseColorClass: "text-[#2C5B10]",
  },
};

type Props = {
  ariaLabel: string;
  scale: number;
  direction: "left" | "right";
  isDragOffBoundary: IsDragOffBoundary;
  onClick: () => void;
};

const GameActionBtn = ({
  scale,
  direction,
  isDragOffBoundary = null,
  onClick,
}: Props) => {
  const Icon: React.ElementType = actionPropsMatrix[direction!].icon;

  const pathname = usePathname();
  const { game } = useGameStore();

  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.9 }}>
      <motion.div
        className={`flex items-center justify-center w-[130px]  h-[50px] rounded-lg ${getBgColorClass(
          game.Name,
          direction
        )} shadow`}
        style={{ scale: scale }}
      >
        {/* <Icon
          className={`w-[24px] h-[24px] duration-100 ease-out ${
            isDragOffBoundary != null && isDragOffBoundary === direction
              ? "text-white"
              : actionPropsMatrix[direction!].iconBaseColorClass
          }`}
        /> */}

        <span
          className={`duration-100 text-xl font-bold ease-out ${
            isDragOffBoundary != null && isDragOffBoundary === direction
              ? "text-white"
              : actionPropsMatrix[direction!].iconBaseColorClass
          }`}
        >
          {actionPropsMatrix[direction!].type}
        </span>
      </motion.div>
    </motion.button>
  );
};

export default GameActionBtn;
