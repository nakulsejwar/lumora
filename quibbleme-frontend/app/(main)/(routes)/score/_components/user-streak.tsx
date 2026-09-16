"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
interface UserStreak {
  streak_data: {
    highest_streak: number;
    current_streak: number;
    last_played_game: string;
    last_played_at: string;
  };
  dates: [
    {
      id: number;
      date: string;
    }
  ];
}
interface UserStreakProps {
  data: UserStreak;
}
function UserStreak({ data }: UserStreakProps) {
  const [streak, setStreak] = useState(0);
  const [canContinueStreak, setCanContinueStreak] = useState(false);

  // const getStreak = () => {
  //   const today = new Date();
  //   const formattedToday = today.toISOString().split("T")[0];
  //   const last7Days = Array.from({ length: 7 }, (_, i) => {
  //     const date = new Date(today);
  //     date.setDate(date.getDate() - i);
  //     return date.toISOString().split("T")[0];
  //   });

  //   const dates = data.map((entry) => entry.date);
  //   let currentStreak = 0;
  //   let missedDay = false;

  //   for (let i = 0; i < last7Days.length; i++) {
  //     if (dates.includes(last7Days[i])) {
  //       currentStreak++;
  //     } else if (i === 0) {
  //       // If today's date is missing, check if we can continue the streak
  //       missedDay = true;
  //     } else if (!missedDay) {
  //       missedDay = true;
  //     } else {
  //       break;
  //     }
  //   }

  //   if (dates.includes(formattedToday)) {
  //     setCanContinueStreak(false); // No need to continue streak message if today's date is included
  //   } else if (missedDay) {
  //     setCanContinueStreak(true); // Allow continuation if there's exactly one missed day including today
  //   }

  //   setStreak(currentStreak);
  //   setStreak(currentStreak);
  // };

  // useEffect(() => {
  //   if (data) {
  //     getStreak();
  //   }
  //   //eslint-disable-next-line
  // }, [data]);

  const isYesterday = (date: string): boolean => {
    const yesterday = dayjs().subtract(1, "day").startOf("day"); // Get the start of yesterday
    const inputDate = dayjs(date).startOf("day"); // Get the start of the input date
    return yesterday.isSame(inputDate, "day"); // Check if the dates are the same
  };
  const isMoreThanOneDayAgo = (date: string): boolean => {
    const twoDaysAgo = dayjs().subtract(1, "day").endOf("day"); // Get the end of the day two days ago
    const inputDate = dayjs(date).endOf("day"); // Get the end of the input date
    return inputDate.isBefore(twoDaysAgo); // Check if the input date is before the end of the day two days ago
  };
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-3 mt-5 w-full max-w-2xl mx-auto">
      <div className=" w-full   max-w-xs mx-auto">
        <motion.div
          className="animate-fade-up custom-gradient-v2 rounded-lg p-[1px] text-sm md:text-base font-display font-bold  w-full  max-w-xs mx-auto  drop-shadow-sm [text-wrap:balance] "
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Card className="w-full border border-blue-200 max-w-xs ">
            <CardContent className="flex  justify-between !p-2 ">
              <p className=" font-medium"> 🔥 Highest Streak :</p>
              <p className="">
                {data.streak_data.highest_streak}{" "}
                {data.streak_data.current_streak === 1 ? "day" : "days"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        {isYesterday(data.streak_data.last_played_at) && (
          <p className="p-1">Continue today to save your streak!</p>
        )}
      </div>
      <div className=" w-full   max-w-xs mx-auto">
        <motion.div
          className="animate-fade-up custom-gradient-v2 rounded-lg p-[1px] text-sm md:text-base font-display font-bold  w-full  max-w-xs mx-auto  drop-shadow-sm [text-wrap:balance] "
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Card className="w-full border border-blue-200 max-w-xs ">
            <CardContent className="flex  justify-between !p-2 ">
              <p className=" font-medium"> 🔥 Current Streak :</p>
              <p className="">
                {data.streak_data.current_streak}{" "}
                {data.streak_data.current_streak === 1 ? "day" : "days"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        {isYesterday(data.streak_data.last_played_at) && (
          <p className="p-1">Continue today to save your streak!</p>
        )}
      </div>
    </div>
  );
}

export default UserStreak;
