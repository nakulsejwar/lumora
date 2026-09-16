"use client";
import React from "react";
import { Flame, Star, Sparkles } from "lucide-react";
import dayjs from "dayjs";

interface UserStreakData {
  streak_data?: {
    highest_streak?: number;
    current_streak?: number;
    last_played_game?: string;
    last_played_at?: string;
  };
  dates?: Array<{
    id: number;
    date: string;
  }>;
}

interface UserStreakProps {
  data?: UserStreakData | null;
}

export default function UserStreak({ data }: UserStreakProps) {
  const highestStreak = data?.streak_data?.highest_streak ?? 0;
  const currentStreak = data?.streak_data?.current_streak ?? 0;
  const lastPlayedAt = data?.streak_data?.last_played_at ?? "";

  const isYesterday = (date: string): boolean => {
    if (!date) return false;
    const yesterday = dayjs().subtract(1, "day").startOf("day");
    const inputDate = dayjs(date).startOf("day");
    return yesterday.isSame(inputDate, "day");
  };

  const showReminder = isYesterday(lastPlayedAt);

  return (
    <div className="w-full bg-white rounded-3xl p-6 border border-[#c8c5d0]/60 shadow-md">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#c8c5d0]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#fe932c]/15 text-[#fe932c] flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 fill-[#fe932c]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#070235] text-sm sm:text-base">Reading Flame & Streaks</h3>
            <p className="text-[11px] text-[#47464f]">Daily learning consistency & streak records.</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-extrabold uppercase text-[#904d00] bg-[#fe932c]/15 px-2.5 py-1 rounded-full border border-[#fe932c]/30">
          DAILY STREAK
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Highest Streak */}
        <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#c8c5d0]/40 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#47464f] mb-1">
            <Star className="w-3.5 h-3.5 text-[#fe932c] fill-[#fe932c]" />
            <span>Highest Record</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#070235]">
            {highestStreak} <span className="text-xs font-semibold text-[#47464f]">{highestStreak === 1 ? "day" : "days"}</span>
          </span>
        </div>

        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-[#fe932c]/10 border border-[#fe932c]/30 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#904d00] mb-1">
            <Flame className="w-3.5 h-3.5 text-[#fe932c] fill-[#fe932c]" />
            <span>Current Streak</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#070235]">
            {currentStreak} <span className="text-xs font-semibold text-[#47464f]">{currentStreak === 1 ? "day" : "days"}</span>
          </span>
        </div>
      </div>

      {/* Status Reminder Footer */}
      {showReminder && (
        <div className="mt-4 p-3 rounded-xl bg-[#fe932c]/15 border border-[#fe932c]/40 flex items-center gap-2 text-xs font-semibold text-[#904d00]">
          <Sparkles className="w-4 h-4 text-[#fe932c] shrink-0" />
          <span>Keep your flame burning! Complete a mission today to extend your streak!</span>
        </div>
      )}
    </div>
  );
}
