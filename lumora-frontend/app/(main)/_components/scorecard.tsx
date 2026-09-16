"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCw, Router } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TwitterShareButton, XIcon } from "react-share";
import { sendGTMEvent } from "@next/third-parties/google";
import { usePathname, useRouter } from "next/navigation";
import { getGame } from "@/app/api/games.api";
import { useGameStore } from "@/lib/hooks/use-game";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import useScorecard, { Score } from "@/lib/hooks/use-scorecard";
import { user as initialUser } from "@/app/api/user.api";
import { useUserContext } from "@/store/userContext";
import { toast } from "sonner";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
function ScoreCard() {
  const router = useRouter();
  const pathname = usePathname();
  const { game, setGame } = useGameStore();
  const { gamedata, setGameData } = useGameDataStore();
  const [user, setUser] = useUserContext();

  const { authUser } = useAuthUserStore();
  const addScore = useScorecard((state) => state.addScore);
  const clearStorage = useScorecard((state) => state.clearLocalStorage);
  const handleReplay = async () => {
    setUser(initialUser);
    const initialGame = await getGame(pathname.split("/")[2]);
    setGame(initialGame);
  };

  useEffect(() => {
    if (gamedata.questions.length === 0) {
      // console.log("gameended");
      const score = {
        game_id: game.Order,
        game_name: game.Topic,
        score: user.score,
      };
      try {
        if (addScore) {
          const setScore = () => addScore(score);
          setScore();
          setUser(initialUser);
        }
      } catch (error) {
        // console.log(error);
        console.log("");
      }
    }
    //eslint-disable-next-line
  }, []);

  const handleShare = () => {
    //copy to clipboard function with a toast messsage  "copied to clipboard"
    sendGTMEvent({
      event: "share_game",
      shareGame: "game shared",
    });
    const urlToCopy = `I scored ${JSON.parse(
      sessionStorage.getItem("score-storage")!
    )?.state?.scorecard.reduce(
      (acc: number, item: any) => acc + item.score,
      0
    )} points playing this fun game. Show your knowledge and see if you can beat my score: https://www.lumora.app`;
    navigator.clipboard.writeText(urlToCopy).then(
      function () {
        /* clipboard successfully set */
        toast.success("Copied to clipboard");
      },
      function () {
        /* clipboard write failed */
        toast.error("Failed to copy to clipboard");
      }
    );
  };
  return (
    <div
      className={`flex p-5 min-h-screen h-full flex-col items-center justify-center  bg-gameSwipe.neutral text-gray-700`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { ease: "backOut", duration: 0.2, delay: 0.15 },
        }}
        className="flex flex-col items-center justify-center text-center relative z-10"
      >
        <h1 className="text-2xl md:text-3xl  leading-tight ">
          Congratulations!🎉
          <br />
          <span className="text-xl md:text-2xl">
            You completed all challenges!
          </span>
        </h1>
        <div className="container p-2 max-w-md md:max-w-xl mx-auto sm:p-4 rounded-xl ">
          <div className="overflow-hidden rounded-xl ">
            <table className=" min-w-[290px] md:w-[500px] ml-2 text-xs rounded-xl shadow-md shadow-yellow-200 border border-orange-100 ">
              <thead className="rounded-xl">
                <tr className="text-xl md:text-2xl">
                  <th className="p-3 text-left bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent ">
                    Game
                  </th>
                  <th className="p-3 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent ">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="rounded-xl">
                {sessionStorage.getItem("score-storage") &&
                  JSON.parse(
                    sessionStorage.getItem("score-storage")!
                  )?.state?.scorecard.map((item: Score) => (
                    <tr
                      key={`${item.game_id}-${item.game_name}`}
                      className="relative border-b border-opacity-20 text-base md:text-xl z-50"
                    >
                      <td className="p-3">
                        <p className="capitalize text-left">
                          {item.game_name.replaceAll("-", " ")}
                        </p>
                      </td>
                      <td className="py-3">
                        <p>
                          {item.score}/{gamedata.questions.length}
                        </p>
                      </td>
                      <td className="md:absolute  md:top-[10px] md:right-0 p-1 z-40">
                        <button
                          onClick={() => {
                            sendGTMEvent({
                              event: "play_again",
                              gameName: item.game_name,
                            });

                            if (pathname.split("/")[2] === item.game_name) {
                              return handleReplay();
                            }
                            router.push(item.game_name);
                          }}
                          id="Play again"
                        >
                          <RotateCw className=" text-blue-400 w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                <tr className="border-b border-opacity-20 text-base md:text-xl">
                  <td className="p-3">
                    <p className="capitalize text-left bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent">
                      Total score
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent">
                      {" "}
                      {JSON.parse(
                        sessionStorage.getItem("score-storage")!
                      )?.state?.scorecard.reduce(
                        (acc: number, item: any) => acc + item.score,
                        0
                      )}
                      <span className="text-base">/80</span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* <TwitterShareButton
          url={`https://www.lumora.app`}
          title={`I scored ${JSON.parse(
            sessionStorage.getItem("score-storage")!
          )?.state?.scorecard.reduce(
            (acc: number, item: any) => acc + item.score,
            0
          )}/80 playing Food Tinder. Show your love for food and see if you can beat my score!`}
          className={cn(
            buttonVariants({ variant: "theme" }),
            "rounded-full w-52   shadow-md"
          )}
        >
          <XIcon size={30} round />
          <span className="text-white text-lg font-bold ml-2">
            Share on Twitter
          </span>
        </TwitterShareButton>{" "} */}
        <motion.div className="" whileTap={{ scale: 0.9 }}>
          <Button
            onClick={handleShare}
            id="share"
            className={cn(
              buttonVariants({ variant: "theme" }),
              "rounded-full w-48   shadow-md"
            )}
          >
            Share this game
          </Button>
        </motion.div>
        <Link
          href="/feedback"
          prefetch={false}
          id="Back to home"
          className="flex items-center justify-center w-full  mt-5 text-center  z-10"
          onClick={() => clearStorage()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-square-heart mt-1 text-blue-600/60 "
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8" />
          </svg>
          <span>Feedback</span>
        </Link>
        <Link
          href="/"
          prefetch={false}
          id="Back to home"
          className="flex items-center justify-center w-full  mt-3 text-center  z-10"
          onClick={() => clearStorage()}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default ScoreCard;
