"use client";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

import GameCards from "./game/swipe/game-cards";
import GameCompletion from "./game-completion";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { useUserContext } from "@/store/userContext";
import { LoadingModal } from "@/components/modals/loading-modal";
import { useEffect } from "react";
import ScoreCard from "./scorecard";
import useNutrientsStore, { FoodItem } from "@/lib/hooks/use-nutrients-store";
import { getNutrientsData } from "@/app/api/games.api";
import { user as initialUser } from "@/app/api/user.api";
import { useRouter } from "next/navigation";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { useQueryClient } from "@tanstack/react-query";
import { useGameStore } from "@/lib/hooks/use-game";
import useScorecard from "@/lib/hooks/use-scorecard";
import useSessionStore from "@/lib/hooks/use-session-store";
import { updateUserScore } from "@/actions/update-user-score";
import { sendGTMEvent } from "@next/third-parties/google";

const GameScreen = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { game, setGame } = useGameStore();
  const { gamedata, setGameData } = useGameDataStore();
  const [user, setUser] = useUserContext();
  const addScore = useScorecard((state) => state.addScore);
  const addSessionData = useSessionStore((state) => state.addSessionsData);
  const addNutrientsData = useNutrientsStore((state) => state.addNutrientsData);
  const foodData = useNutrientsStore((state) => state.nutrientsData);

  const isCardStockEmpty = gamedata?.questions?.length! === 0;
  const { authUser } = useAuthUserStore();
  const authUserScores = queryClient.getQueryData(["currentAuthUserScores"]);
  const gameScreenVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 2, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
    },
  };

  // useEffect(() => {
  //   if (gamedata?.questions?.length === 10) {
  //     let foodData: FoodItem[];
  //     const foodItems = gamedata.questions.map((card) => card.Name);
  //     (async function fetchNutrientsData() {
  //       foodData = await getNutrientsData(foodItems);
  //       try {
  //         if (addNutrientsData) {
  //           const setCarouselData = () => addNutrientsData(foodData);
  //           setCarouselData();
  //         }
  //       } catch (error) {
  //         console.log("");
  //         // console.log(error);
  //       }
  //     })();
  //   }
  //   //eslint-disable-next-line
  // }, [gamedata]);

  useEffect(() => {
    setUser(initialUser);

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gamedata?.questions?.length === 0) {
      // console.log("gameended");
      const score = {
        game_id: game.Order,
        game_name: game.Topic,
        score: user.score,
      };

      sendGTMEvent({
        event: "game_completion",
        gameId: game.GameId,
        gameTitle: game.Title,
        score: user.score,
      });

      try {
        if (addScore) {
          if (authUser && Object.keys(authUser).length === 0) {
            const setScore = () => addScore(score);
            setScore();
            const sessionContent = {
              "user-id": "session-id",
              gameid: game.GameId,
              "game-name": game.Topic,
              "game-question": game.Title,
              totalQuestions: gamedata?.questions?.length,
              score: user.score,
              "game-data": foodData.map((item) => {
                return {
                  foodItem: item.Name!,
                  foodImage: item.ImageLink!,
                  userScore: item.score!,
                };
              }),
            };
            const setSessionData = () => addSessionData(sessionContent);
            setSessionData();
          } else {
            (async function sendScore() {
              const content = {
                userId: authUser.user_id!,
                gameId: game.GameId!,
                score: user.score!,
                totalQuestions: gamedata?.questions?.length,
                isComplete: true,
              };
              await updateUserScore(content);
              await queryClient.invalidateQueries({
                queryKey: ["currentAuthUserScores"],
              });
            })();
          }
        }
      } catch (error) {
        // console.log(error);
        console.log("");
      }

      if (authUserScores && Object.keys(authUserScores).length === 8) {
        router.push("/score");
      }
    }
    //eslint-disable-next-line
  }, [gamedata]);

  return (
    <main className="min-h-screen h-full w-full mx-auto bg-gameSwipe-neutral">
      {Object.keys(gamedata).length !== 0 ? (
        <AnimatePresence mode="wait">
          {!isCardStockEmpty ? (
            <motion.div
              key="gameScreen1"
              id="gameScreen"
              variants={gameScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <GameCards />
            </motion.div>
          ) : (
            <motion.div
              key="gameScreen2"
              id="gameCompletion"
              variants={gameScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* {sessionStorage.getItem("score-storage") &&
              JSON.parse(sessionStorage.getItem("score-storage")!)?.state
                ?.scorecard?.length === 8 &&
              authUser &&
              Object.keys(authUser).length === 0 ? (
                <ScoreCard />
              ) : (
                <GameCompletion />
              )} */}

              {authUser &&
              Object.keys(authUser).length === 0 &&
              sessionStorage.getItem("score-storage") &&
              JSON.parse(sessionStorage.getItem("score-storage")!)?.state
                ?.scorecard?.length === 8 ? (
                <ScoreCard />
              ) : authUserScores && Object.keys(authUserScores).length === 8 ? (
                <div className=" flex h-screen items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
                  <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
                  <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
                </div>
              ) : (
                <GameCompletion />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className=" flex items-center justify-center gap-2 pt-20">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        </div>
      )}
    </main>
  );
};

export default GameScreen;
