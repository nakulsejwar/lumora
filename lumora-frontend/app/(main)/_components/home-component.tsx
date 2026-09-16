"use client";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { type GameData } from "@/types/game.types";
import { Info } from "lucide-react";
import { useGameInfoModal } from "@/lib/hooks/use-game-info-modal";
import { GameInfoModal } from "@/components/modals/game-info-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGames } from "@/app/api/games.api";
import { useGlobalContext } from "@/components/providers/GlobalProvider";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { useNickNameModal } from "@/lib/hooks/use-nickname-modal";
import { useSignUpModal } from "@/lib/hooks/use-signup-modal";
import { sendGTMEvent } from "@next/third-parties/google";

export default function HomeComponent() {
  const queryclient = useQueryClient();
  const { gamedata, setGameData } = useGameDataStore();
  const [selectedGameTip, setSelectedGameTip] = React.useState<string>("");
  const { isOpen, onOpen, onClose } = useGameInfoModal();
  const { onOpen: openNickNameModal, onClose: closeNickNameModal } =
    useNickNameModal();
  const { userAvatar } = useGlobalContext();

  const { authUser, setAuthUser } = useAuthUserStore();
  const signupModal = useSignUpModal();

  const { data: games } = useQuery({ queryKey: ["games"], queryFn: getGames });
  useEffect(() => {
    setGameData({} as GameData);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      authUser &&
      Object.keys(authUser).length &&
      [`${authUser.email?.split("@")[0]}`, ""].includes(authUser?.name!)
    ) {
      openNickNameModal();
    }

    //eslint-disable-next-line
  }, [authUser]);

  return (
    <>
      {/* <Navbar /> */}
      {/* <Intro /> */}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:place-items-center lg:place-content-center gap-10 max-w-6xl mx-auto ">
            {games &&
              games
                .filter((game) =>
                  [
                    "Sug0916",
                    "Wat3581",
                    "Cal3334",
                    "Fib4080",
                    "Fat5747",
                    "Pro0742",
                    "Car9360",
                    "Hea8072",
                  ].includes(game.GameId)
                )
                .map((game) => (
                  <div
                    key={game.GameId}
                    className="relative bg-white flex flex-col flex-1 border border-blue-200 shadow-lg  h-[320px]  w-full max-w-[280px]  rounded-lg "
                  >
                    <Image
                      src={game.ImageLink}
                      alt=""
                      width={400}
                      height={400}
                      className="w-full rounded-t-lg h-[200px]  object-center object-cover"
                    />
                    <div className="flex flex-1  flex-col items-center justify-start w-full py-4 px-3">
                      <p className=" bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent font-bold text-2xl w-[230px] capitalize">
                        {game.Name}
                      </p>

                      <div className="flex flex-1 flex-col  w-full justify-end">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${game.GameId}`}
                            prefetch={false}
                            className={cn(
                              buttonVariants({ variant: "theme" }),
                              "w-full rounded-full h-8 "
                            )}
                            id={game.Topic}
                          >
                            Play Game
                          </Link>
                          <button
                            className=" "
                            onClick={() => {
                              setSelectedGameTip(game.gameTip);
                              sendGTMEvent({
                                event: "game_info_click",
                                gameId: game.GameId,
                                gameTitle: game.Title,
                              });
                              onOpen();
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

          <GameInfoModal item={selectedGameTip} />
        </motion.div>
      </AnimatePresence>

      {authUser && Object.keys(authUser).length === 0 && (
        <div className="hidden lg:fixed lg:flex items-center   p-4  bottom-5  right-5 z-50">
          <div className="flex  items-center justify-end w-full max-w-7xl mx-auto    z-50">
            <div className="flex flex-col items-center  bg-white shadow-lg rounded-2xl p-2">
              <h3 className="text-sm ">
                {" "}
                Create a profile to save your progress!
              </h3>
              <Link href="/register" prefetch={false} className="w-full">
                <button
                  onClick={signupModal.onClose}
                  className="w-full bg-gradient-to-br p-1 my-1 from-cyan-400 via-blue-500 to-cyan-500 text-white  rounded-full text-sm hover:scale-105 active:scale-100"
                >
                  CREATE A PROFILE
                </button>
              </Link>
              <Link prefetch={false} href="/login" className="w-full">
                <button
                  className="w-full rounded-full border p-1 text-sm hover:scale-105 active:scale-100"
                  onClick={signupModal.onClose}
                >
                  <span className="bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent  font-bold ">
                    SIGN IN
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
