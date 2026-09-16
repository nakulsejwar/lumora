"use client";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useGameInfoModal } from "@/lib/hooks/use-game-info-modal";
import { GameInfoModal } from "@/components/modals/game-info-modal";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { sendGTMEvent } from "@next/third-parties/google";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import { useParams } from "next/navigation";
import { GamePlayed, useGlobalContext } from "../providers/GlobalProvider";
import { LessonButton } from "./lesson-button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import GameTile from "./game-tile";

function LessonButtons({
  levels,
  topicIndex,
}: {
  levels: any;
  topicIndex: number;
}) {
  const gameInfoModal = useGameInfoModal();

  const { gamesPlayed } = useGlobalContext();

  const combinedQueries = useQueries({
    queries: levels.map((level: any) => ({
      queryKey: [`level1GameData-${level.level_id}`],
      queryFn: async () => {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
              ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-level-games-data-main/`
              : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-level-games-data/`;
          const { data } = await axios.post(
            apiUrl,
            {
              level_id: level.level_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                //   Authorization: "Bearer " + token,
              },
            }
          );

          return data;
        } catch (error) {
          console.log("");
          return null;
        }
      },
    })),
    combine: (results) => {
      return {
        data: results.flatMap((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  if (combinedQueries.pending) {
    return (
      <>
        <div className=" flex items-center justify-center gap-2 mt-20">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          className={`relative z-10 flex  h-full flex-col items-center justify-start bg-gameSwipe.neutral text-gray-700 text-center`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: cubicBezier(0.16, 1, 0.3, 1) },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
          }}
        >
          <div className=" ">
            {combinedQueries.data && combinedQueries.data.length ? (
              <div className="relative flex flex-col items-center gap-5">
                {combinedQueries.data.map((game: any, idx: number) => (
                  <Popover key={game.gameid}>
                    <LessonButton
                      id={game.gameid}
                      index={idx}
                      totalCount={combinedQueries.data.length - 1}
                      prevGameId={
                        idx > 0 ? combinedQueries?.data[idx - 1] : null
                      }
                      current={topicIndex === 0 && idx === 0}
                      locked={false}
                    />
                    <PopoverContent className="!p-0 !m-0 ">
                      <GameTile game={game} />
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            ) : (
              <div className="py-5">
                <h1
                  className="animate-fade-up custom-gradient  text-center font-display text-3xl font-bold  text-transparent py-2  drop-shadow-sm [text-wrap:balance] md:text-6xl xl:text-7xl md:!leading-[5rem]"
                  style={{
                    animationDelay: "0.15s",
                    animationFillMode: "forwards",
                  }}
                >
                  Coming Soon
                </h1>
                <p className="text-sm md:text-xl ">
                  We&apos;re working hard to bring you something amazing. Stay
                  tuned!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default LessonButtons;
