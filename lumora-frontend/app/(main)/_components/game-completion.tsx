"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { useUserContext } from "@/store/userContext";
import { useGameContext } from "@/store/gameContext";
import { user as initialUser } from "@/app/api/user.api";
import {
  fetchNextGame,
  getGameData,
  getNextGame,
  NextGameDetails,
} from "@/app/api/games.api";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Award,
  CheckCircle2,
  Share2,
  Sparkles,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { usePathname, useRouter } from "next/navigation";
import { GameData, type GameDetails } from "@/types/game.types";
import { useLoadingModal } from "@/lib/hooks/use-loading-modal";
import { sendGTMEvent } from "@next/third-parties/google";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useScorecard from "@/lib/hooks/use-scorecard";
import SwipeGameScoreCard from "./swipe-game-score-card";
import { useGameStore } from "@/lib/hooks/use-game";
import { useSignUpModal } from "@/lib/hooks/use-signup-modal";
import { useMediaQuery } from "usehooks-ts";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import useNutrientsStore from "@/lib/hooks/use-nutrients-store";
import useSessionStore from "@/lib/hooks/use-session-store";
import { useQueryClient } from "@tanstack/react-query";
import { useSignUpQueue } from "@/lib/hooks/use-signup-queue";
import MixedGameScoreCard from "./mixed-game-score-card";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import { useGamePopupModal } from "@/lib/hooks/use-game-popup-modal";
import SkillMasteryPanel from "./mastery/skill-mastery-panel";

export interface NextGame {
  exist: boolean;
  game_name: string;
  gameid: string;
  live: string;
}

const getAllGameOrders = (data: any): number[] => {
  const gameOrders = new Set<number>();
  Object.keys(data).forEach((key) => {
    gameOrders.add(data[key].game_order);
  });
  return Array.from(gameOrders).sort((a, b) => a - b);
};

const GameCompletion = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { gamedata, setGameData, setUpdatedGameData } = useGameDataStore();
  const { game, setGame } = useGameStore();
  const loadingModal = useLoadingModal();
  const { courseId } = useCourseIdStore();
  const { authUser } = useAuthUserStore();
  const signUpQueue = useSignUpQueue((state) => state.setItem);
  const signUpModal = useSignUpModal();
  const gamePopupModal = useGamePopupModal();
  const [isSignUpPopupEnabled, setIsSignUpPopupEnabled] = useState(false);

  const [nextGame, setNextGame] = useState<NextGame | null>(null);

  const pathname = usePathname();
  const [user, setUser] = useUserContext();

  const authUserScores = queryClient.getQueryData(["currentAuthUserScores"]);

  const memoizedStats = useRef({
    score: structuredClone(user.score),
    cardsAmount: structuredClone(gamedata?.questions?.length),
  });

  const handleReplay = async () => {
    setUser(initialUser);
    const initialGame = await getGameData(game.GameId);
    setGameData(initialGame!);
    setUpdatedGameData(initialGame!);
  };

  const handleNextGame = async () => {
    loadingModal.onOpen();
    setGameData({} as GameData);

    try {
      sendGTMEvent({
        event: "next_challenge",
        prevGameName: game.Name!,
        nextGameName: nextGame?.game_name,
      });

      router.push(`/${nextGame?.gameid}`);
      router.refresh();

      loadingModal.onClose();
      gamePopupModal.onOpen(nextGame?.gameid!);
      return;
    } catch (error) {
      toast.error("Something went wrong!");
      router.back();
    }
    loadingModal.onClose();
  };

  const handleShare = () => {
    sendGTMEvent({
      event: "share_game",
      shareGame: "game shared",
    });
    const urlToCopy = `I scored ${memoizedStats.current.score}/${gamedata.questions.length} playing this fun game. Show your knowledge and see if you can beat my score: https://www.lumora.app/${game.GameId}`;
    navigator.clipboard.writeText(urlToCopy).then(
      function () {
        toast.success("Copied to clipboard");
      },
      function () {
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  const handleButtonClick = (type: string) => {
    if (authUser && Object.keys(authUser).length > 0) {
      switch (type) {
        case "back-to-home":
          router.push(courseId ? `/courses/${courseId}` : `/courses`);
          break;
        case "next-game":
          handleNextGame();
          break;
        default:
          break;
      }
    } else {
      if (!isSignUpPopupEnabled) {
        signUpQueue(type);
        signUpModal.onOpen();
        return;
      }
      switch (type) {
        case "back-to-home":
          router.push(courseId ? `/courses/${courseId}` : `/courses`);
          break;
        case "next-game":
          handleNextGame();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    (async function init() {
      const { success } = await getNextGame(game.GameId);
      if (success) {
        if (success.exist) {
          setNextGame(success);
        } else {
          setNextGame(null);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (gamedata?.questions?.length === 0) {
      setUser(initialUser);
    }
  }, []);

  useEffect(() => {
    if (
      [3, 6, 9, 12, 15].includes(
        JSON.parse(sessionStorage.getItem("score-storage")!)?.state?.scorecard
          ?.length
      ) ||
      (authUser && Object.keys(authUser).length > 0)
    ) {
      setIsSignUpPopupEnabled(true);
    }
  }, []);

  return (
    <div className="flex py-8 px-4 min-h-screen h-full flex-col items-center justify-center bg-[#faf8ff] text-[#131b2e]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { ease: "easeOut", duration: 0.4 },
        }}
        className="w-full max-w-3xl flex flex-col items-center text-center relative z-10 space-y-6"
      >
        {/* Mission Completion Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fe932c]/15 border border-[#fe932c]/40 text-[#904d00] text-xs font-mono font-extrabold uppercase tracking-widest shadow-sm">
          <Award className="w-4 h-4 text-[#fe932c]" />
          <span>CASE CLOSED — MISSION ACCOMPLISHED</span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#070235] tracking-tight leading-tight">
            Investigation Complete!
          </h1>
          <p className="text-lg text-[#47464f] mt-2 font-medium">
            Reading Accuracy:{" "}
            <span className="text-2xl font-extrabold text-[#0091cf]">
              {memoizedStats.current.score} / {memoizedStats.current.cardsAmount}
            </span>{" "}
            correct evidence claims
          </p>
        </div>

        {/* Scorecard Component */}
        <div className="w-full">
          {[
            "Sug0916",
            "Wat3581",
            "Cal3334",
            "Fib4080",
            "Fat5747",
            "Pro0742",
            "Car9360",
            "Hea8072",
          ].includes(game.GameId) ? (
            <SwipeGameScoreCard />
          ) : (
            <MixedGameScoreCard />
          )}
        </div>

        {/* Skill Mastery Profile & Before-After Growth Panel */}
        {![
          "Sug0916",
          "Wat3581",
          "Cal3334",
          "Fib4080",
          "Fat5747",
          "Pro0742",
          "Car9360",
          "Hea8072",
        ].includes(game.GameId) && <SkillMasteryPanel />}

        {/* Action Controls Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#c8c5d0]/50 w-full">
          <Button
            onClick={() => handleButtonClick("back-to-home")}
            className="px-6 py-5 rounded-xl bg-white hover:bg-[#eaedff] text-[#070235] font-bold border border-[#c8c5d0] shadow-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reading Missions</span>
          </Button>

          <Button
            onClick={() => {
              handleReplay();
              sendGTMEvent({
                event: "play_again",
                gameId: pathname.split("/")[2],
              });
            }}
            className="px-6 py-5 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#070235] font-bold border border-[#0091cf]/30 shadow-sm flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4 text-[#0091cf]" />
            <span>Replay Mission</span>
          </Button>

          {nextGame && (
            <Button
              onClick={() => handleButtonClick("next-game")}
              className="px-8 py-5 rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white font-bold shadow-md border border-[#89ceff]/30 flex items-center gap-2"
            >
              <span>Next Mission</span>
              <ArrowRight className="w-4 h-4 text-[#fe932c]" />
            </Button>
          )}

          <Button
            onClick={handleShare}
            className="px-6 py-5 rounded-xl bg-white hover:bg-[#faf8ff] text-[#904d00] font-bold border border-[#fe932c]/50 shadow-sm flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-[#fe932c]" />
            <span>Share Reading Mission</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameCompletion;

