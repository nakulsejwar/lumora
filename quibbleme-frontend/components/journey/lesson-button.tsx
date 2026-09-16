"use client";

import { Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";
import { useGlobalContext } from "../providers/GlobalProvider";
import { PopoverTrigger } from "../ui/popover";
import { calculatePercentage } from "@/lib/calculate-percentage";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import useSessionStore from "@/lib/hooks/use-session-store";
import { useMemo } from "react";

type LessonButtonProps = {
  id: string;
  index: number;
  totalCount: number;
  prevGameId: any;
  locked?: boolean;
  current?: boolean;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  prevGameId,
  locked,
  current,
}: LessonButtonProps) => {
  const { gamesPlayed } = useGlobalContext();
  const { authUser } = useAuthUserStore();
  const sessionData = useSessionStore((state) => state.sessionData);
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;

  const percentage = useMemo(() => {
    if (authUser && Object.keys(authUser).length === 0) {
      return sessionData ? calculatePercentage(sessionData, id) : 0;
    } else {
      return gamesPlayed ? calculatePercentage(gamesPlayed, id) : 0;
    }
  }, [authUser, gamesPlayed, id, sessionData]);
  const isCompleted = percentage === 1;
  const Icon = isCompleted ? Check : Star;

  return (
    <PopoverTrigger
      className="relative"
      style={{
        right: `${rightPosition}px`,
        marginTop: isFirst && !isCompleted ? 60 : 24,
      }}
    >
      <div className="relative h-[102px] w-[102px]">
        {current && !percentage ? (
          <div className="absolute -top-7 left-2 z-10 animate-bounce rounded-xl border border-[#fe932c]/50 bg-[#070235] px-3 py-1.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#fe932c] shadow-md">
            START MISSION
            <div
              className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-6 border-t-6 border-x-transparent border-t-[#070235]"
              aria-hidden
            />
          </div>
        ) : null}
        <CircularProgressbarWithChildren
          value={Number.isNaN(percentage) ? 0 : percentage * 100}
          styles={{
            path: {
              stroke: isCompleted
                ? "#059669"
                : percentage
                ? percentage > 0.5
                  ? "#fe932c"
                  : "#ba1a1a"
                : "#c8c5d0",
            },
            trail: {
              stroke: "#eaedff",
            },
          }}
        >
          <Button
            size="rounded"
            variant={locked ? "locked" : "outline"}
            className={cn(
              "h-[72px] w-[72px] border-b-4 bg-white shadow-md hover:bg-[#faf8ff] transition-all",
              isCompleted
                ? "border-[#059669] bg-[#059669]/5"
                : percentage
                ? percentage > 0.5
                  ? "border-[#fe932c] bg-[#fe932c]/10"
                  : "border-[#ba1a1a]"
                : "border-[#c8c5d0]"
            )}
          >
            <Icon
              className={cn(
                "h-8 w-8 transition-transform transform hover:scale-110",
                isCompleted
                  ? "text-[#059669] stroke-[3]"
                  : percentage
                  ? "fill-[#fe932c] text-[#fe932c]"
                  : "fill-[#070235] text-[#070235]"
              )}
            />
          </Button>
        </CircularProgressbarWithChildren>
      </div>
    </PopoverTrigger>
  );
};

