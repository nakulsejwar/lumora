"use client";

import React, { useEffect } from "react";

import { user as initialUser } from "@/app/api/user.api";
import { useGameDataStore } from "@/lib/hooks/use-game-data";

import GameScreen from "./game-screen";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/store/userContext";
import useScorecard from "@/lib/hooks/use-scorecard";
import useSessionStore from "@/lib/hooks/use-session-store";
import useNutrientsStore, { FoodItem } from "@/lib/hooks/use-nutrients-store";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { getNutrientsData } from "@/app/api/games.api";
import { useGameStore } from "@/lib/hooks/use-game";
import { sendGTMEvent } from "@next/third-parties/google";
import { updateUserScore } from "@/actions/update-user-score";
import GameCompletion from "../game-completion";
import SwipeGameScreen from "./swipe/swipe-game-screen";
import PassageScreen from "./passage-screen";
import { GamePopupModal } from "@/components/modals/game-popup-modal";
import AdBanner from "@/components/google-ads-banner";

const SWIPE_GAME_IDS = [
  "Sug0916",
  "Wat3581",
  "Cal3334",
  "Fib4080",
  "Fat5747",
  "Pro0742",
  "Car9360",
  "Hea8072",
];

const GameWrapper = () => {
  const { updatedGameData, gamedata } = useGameDataStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { game } = useGameStore();

  const [user, setUser] = useUserContext();

  const addScore = useScorecard((state) => state.addScore);
  const addSessionData = useSessionStore((state) => state.addSessionsData);
  const addNutrientsData = useNutrientsStore(
    (state) => state.addNutrientsData
  );
  const foodData = useNutrientsStore((state) => state.nutrientsData);

  const { authUser } = useAuthUserStore();
  const authUserScores = queryClient.getQueryData(["currentAuthUserScores"]);

  /*
   * Lumora reading-passage gate.
   *
   * StoreInitializer populates the game store asynchronously, so we must
   * track whether the learner has explicitly started the questions instead
   * of checking passage_text only during initial render.
   */
  const [hasStartedQuestions, setHasStartedQuestions] =
    React.useState(false);

  /*
   * Safely normalize questions.
   *
   * The previous implementation did:
   *
   * Promise.all(updatedGameData?.questions?.map(...))
   *
   * If questions was undefined, Promise.all(undefined) crashed.
   */
  const questions = Array.isArray(updatedGameData?.questions)
    ? updatedGameData.questions
    : [];

  const gameQuestions = Array.isArray(gamedata?.questions)
    ? gamedata.questions
    : [];

  const updateSessionScoreCardData = async () => {
    let foodData: FoodItem[];

    /*
     * Legacy swipe/food games.
     */
    if (SWIPE_GAME_IDS.includes(game.GameId)) {
      if (questions.length === 0) {
        console.warn(
          "GameWrapper: no questions available for swipe game",
          game.GameId
        );

        return [];
      }

      const foodItems = questions
        .map((question) => question?.options?.[0]?.option)
        .filter(Boolean);

      if (foodItems.length === 0) {
        console.warn(
          "GameWrapper: no food options available for swipe game",
          game.GameId
        );

        return [];
      }

      const swipeNutrientsData = await getNutrientsData(foodItems);

      foodData = swipeNutrientsData.map((item, index) => {
        const question = questions[index];

        return {
          ...item,
          id: question?.tileid ? question.tileid : question?.qid,
          type: "swipe",
        };
      });

      return foodData;
    }

    /*
     * Normal MCQ / True-False / Lumora reading games.
     */
    if (questions.length === 0) {
      console.warn(
        "GameWrapper: no questions available for game",
        game.GameId
      );

      return [];
    }

    /*
     * IMPORTANT:
     * Always pass an actual array to Promise.all().
     */
    const nutrientsData = await Promise.all(
      questions.map(async (question) => {
        if (!question) {
          return null;
        }

        const questionType = String(question.type || "").toLowerCase();

        /*
         * MCQ questions don't need an image/nutrient lookup.
         */
        if (questionType === "mcq") {
          return {
            id: question.tileid ? question.tileid : question.qid,
            question: question.question,
            options: Array.isArray(question.options) ? question.options : [],
            answer: Array.isArray(question.correctOption)
              ? question.correctOption
              : [],
            reason: question.reason,
          };
        }

        /*
         * True/False and other legacy question types.
         *
         * Some Lumora true/false questions now intentionally have
         * empty option3/option4 values. Only request image data when
         * there is actually an option value available.
         */
        const firstOption = question?.options?.[0]?.option;

        let optionData: any[] = [];

        if (firstOption) {
          try {
            optionData = await getNutrientsData([`${firstOption}`]);
          } catch (error) {
            console.warn(
              "GameWrapper: optional nutrient/image lookup failed",
              error
            );
          }
        }

        return {
          ...(optionData?.[0] || {}),
          question: question.question,
          id: question.tileid ? question.tileid : question.qid,
          options: Array.isArray(question.options)
            ? question.options
            : [],
          type: question.type,
          reason: question.reason,
        };
      })
    );

    return nutrientsData.filter(Boolean);
  };

  /*
   * Prepare game/question data.
   *
   * Do not run this until updatedGameData actually contains an array
   * of questions.
   */
  useEffect(() => {
    if (!updatedGameData) {
      return;
    }

    if (!Array.isArray(updatedGameData.questions)) {
      return;
    }

    if (updatedGameData.questions.length === 0) {
      return;
    }

    /*
     * If gamedata is available, make sure the two datasets are aligned.
     *
     * We intentionally avoid the old:
     *
     * undefined === undefined
     *
     * situation that could trigger the function with no questions.
     */
    if (
      Array.isArray(gamedata?.questions) &&
      updatedGameData.questions.length !== gamedata.questions.length
    ) {
      return;
    }

    let cancelled = false;

    const fetchNutrientsData = async () => {
      try {
        const nutrientsData = await updateSessionScoreCardData();

        if (!cancelled && addNutrientsData) {
          addNutrientsData(nutrientsData);
        }
      } catch (error) {
        console.error(
          "GameWrapper: failed to prepare question data",
          error
        );
      }
    };

    fetchNutrientsData();

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedGameData, gamedata]);

  /*
   * Initialize legacy user/session state.
   */
  useEffect(() => {
    setUser(initialUser);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Game completion / score handling.
   */
  useEffect(() => {
    if (!updatedGameData) {
      return;
    }

    /*
     * Only consider the game complete when we have a real questions array
     * and it has reached zero.
     */
    if (!Array.isArray(updatedGameData.questions)) {
      return;
    }

    if (updatedGameData.questions.length !== 0) {
      return;
    }

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

    if (addScore) {
      if (authUser && Object.keys(authUser).length === 0) {
        /*
         * Anonymous/session user.
         */
        addScore(score);

        const sessionContent = {
          "user-id": "session-id",
          gameid: game.GameId,
          "game-name": game.Name,
          "game-question": game.Title,
          score: user.score,
          totalQuestions: gameQuestions.length,
          "game-data": foodData.map((item) => {
            return {
              foodItem: item.Name!,
              foodImage: item.ImageLink!,
              userScore: item.score!,
            };
          }),
        };

        addSessionData(sessionContent);
      } else if (authUser?.user_id) {
        /*
         * Authenticated user.
         *
         * IMPORTANT:
         * The previous implementation launched an async IIFE inside
         * a try/catch. Promise rejections from that IIFE were not caught
         * by the surrounding synchronous try/catch.
         *
         * We now catch the error INSIDE the async operation.
         */
        const sendScore = async () => {
          try {
            const content = {
              userId: authUser.user_id!,
              gameId: game.GameId!,
              score: user.score!,
              totalQuestions: gameQuestions.length,
              isComplete: true,
            };

            const scoreresp = await updateUserScore(content);

            if (scoreresp?.error) {
              console.warn(
                "GameWrapper: score update returned an error",
                scoreresp.error
              );

              return;
            }

            await queryClient.invalidateQueries({
              queryKey: ["currentAuthUserScores"],
            });

            await queryClient.invalidateQueries({
              queryKey: ["currentAuthUserStreak"],
            });

            await queryClient.invalidateQueries({
              queryKey: ["gamesPlayed"],
            });
          } catch (error) {
            /*
             * Score saving must NEVER crash the game-completion screen.
             */
            console.error(
              "GameWrapper: failed to save user score",
              error
            );
          }
        };

        sendScore();
      }
    }

    if (
      authUserScores &&
      typeof authUserScores === "object" &&
      Object.keys(authUserScores).length === 8
    ) {
      router.push("/score");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedGameData]);

  return (
    <div className="flex w-full xl:gap-10 max-w-7xl mx-auto">
      <div className="hidden xl:block my-12 min-w-[180px]">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="1470504191"
          style={{ width: "180px", height: "500px" }}
        />
      </div>

      <div className="flex flex-col w-full grow">
        {updatedGameData &&
          Object.keys(updatedGameData).length > 0 &&
          (game.passage_text && !hasStartedQuestions ? (
            <PassageScreen
              game={game}
              onStart={() => setHasStartedQuestions(true)}
            />
          ) : questions.length > 0 ? (
            SWIPE_GAME_IDS.includes(game.GameId) ? (
              <SwipeGameScreen />
            ) : (
              <GameScreen />
            )
          ) : (
            <GameCompletion />
          ))}
      </div>

      <div className="hidden xl:block my-12 min-w-[180px]">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="1470504191"
          style={{ width: "180px", height: "500px" }}
        />
      </div>

      <GamePopupModal />
    </div>
  );
};

export default GameWrapper;