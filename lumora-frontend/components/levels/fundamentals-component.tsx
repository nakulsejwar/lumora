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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { sendGTMEvent } from "@next/third-parties/google";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import { useParams } from "next/navigation";
import { GamePlayed, useGlobalContext } from "../providers/GlobalProvider";

function FundamentalsComponent({ levelData }: { levelData: any }) {
  const [selectedGameTip, setSelectedGameTip] = React.useState<string>("");
  const gameInfoModal = useGameInfoModal();

  const { gamesPlayed } = useGlobalContext();

  const { data, isLoading } = useQuery({
    queryKey: [`level1GameData-${levelData.level_id}`],
    queryFn: async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
            ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-level-games-data-main/`
            : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-level-games-data/`;
        const { data } = await axios.post(
          apiUrl,
          {
            level_id: levelData.level_id,
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
  });

  if (isLoading) {
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
          className={`relative z-10 flex p-5 min-h-screen h-full flex-col items-center justify-start bg-gameSwipe.neutral text-gray-700 text-center`}
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
          <div className="">
            {data && data.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:place-items-center lg:place-content-center gap-10 max-w-7xl mx-auto ">
                {data.map((game: any) => (
                  <div
                    key={game.gameId}
                    className={cn(
                      "relative bg-white flex flex-col flex-1 border border-blue-200 shadow-lg  h-[320px]  w-full max-w-[280px]  rounded-lg ",
                      gamesPlayed
                        ? gamesPlayed.some(
                            (item) => item.gameid === game.gameid
                          )
                          ? "opacity-60 border-none"
                          : ""
                        : ""
                    )}
                  >
                    {/* <div className="absolute right-1 top-1 bg-white px-2 text-xl rounded-2xl">
                    <p className=" bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent font-bold capitalize">
                      {game.Type}
                    </p>
                  </div> */}
                    <Image
                      src={game.ImageLink}
                      alt=""
                      width={400}
                      height={400}
                      className="w-full rounded-t-lg h-[200px]  object-center object-cover"
                    />
                    <div className="flex flex-1  flex-col items-center justify-start w-full py-4 px-3">
                      <p className=" bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent font-bold text-xl capitalize min-w-[230px]">
                        {/* {game.Type === "mcq"
                        ? game.Name
                        : game.Topic.replaceAll("-", " ")} */}
                        {game.name}
                      </p>

                      <div className="flex flex-1 flex-col  w-full justify-end">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${game.gameid}`}
                            className={cn(
                              buttonVariants({ variant: "theme" }),
                              "w-full rounded-full h-8 "
                            )}
                            id={game.gameid}
                          >
                            Play Game
                          </Link>
                          <button
                            className=" "
                            onClick={() => {
                              setSelectedGameTip(game.gameTip);
                              sendGTMEvent({
                                event: "game_info_click",
                                gameId: game.gameid,
                                gameTitle: game.name,
                              });
                              gameInfoModal.onOpen();
                            }}
                          >
                            <Info className=" text-white w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500 rounded-full shadow-md" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="">
                <h1
                  className="animate-fade-up custom-gradient  text-center font-display text-3xl font-bold  text-transparent py-2 md:pt-7  drop-shadow-sm [text-wrap:balance] md:text-6xl xl:text-7xl md:!leading-[5rem]"
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

          <GameInfoModal item={selectedGameTip} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default FundamentalsComponent;
