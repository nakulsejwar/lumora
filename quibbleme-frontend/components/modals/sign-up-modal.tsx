"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSignUpModal } from "@/lib/hooks/use-signup-modal";
import { useSignUpQueue } from "@/lib/hooks/use-signup-queue";
import { useRouter } from "next/navigation";
import { useLoadingModal } from "@/lib/hooks/use-loading-modal";
import { sendGTMEvent } from "@next/third-parties/google";
import { GameDetails, GameData } from "@/types/game.types";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { useGameStore } from "@/lib/hooks/use-game";
import { toast } from "sonner";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { getNextGame, NextGameDetails } from "@/app/api/games.api";

import { NextGame } from "@/app/(main)/_components/game-completion";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import { useGamePopupModal } from "@/lib/hooks/use-game-popup-modal";
import useScorecard from "@/lib/hooks/use-scorecard";
export const SignUpModal = () => {
  const router = useRouter();
  const signupModal = useSignUpModal();
  const loadingModal = useLoadingModal();
  const gamePopupModal = useGamePopupModal();
  const { authUser } = useAuthUserStore();
  const { courseId } = useCourseIdStore();
  const { gamedata, setGameData } = useGameDataStore();
  const { game, setGame } = useGameStore();
  const signUpQueue = useSignUpQueue((state) => state.item);

  const scoreData = useScorecard((state) => state.scorecard);
  const [nextGame, setNextGame] = useState<NextGame | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const totalXp = scoreData.reduce((sum, score) => sum + score.score, 0);

  const handleNextGame = useCallback(async () => {
    loadingModal.onOpen();
    try {
      setGameData({} as GameData);
      const { success } = await getNextGame(game.GameId);
      if (success) {
        if (success.exist) {
          setNextGame(success);
        } else {
          setNextGame(null);
        }
        router.push(`/${nextGame?.gameid}`);
        router.refresh();
        gamePopupModal.onOpen(nextGame?.gameid!);
        signupModal.onClose();
      }
    } catch (error) {
      toast.error("Something went wrong!");
      router.back();
    } finally {
      loadingModal.onClose();
    }
  }, [
    game.GameId,
    nextGame?.gameid,
    gamePopupModal,
    loadingModal,
    router,
    signupModal,
    setGameData,
  ]);

  const handleClose = useCallback(async () => {
    if (signUpQueue) {
      switch (signUpQueue) {
        case "back-to-home":
          router.push(courseId ? `/courses/${courseId}` : `/courses`);
          signupModal.onClose();
          break;
        case "next-game":
          await handleNextGame();
          break;
        default:
          signupModal.onClose();
          break;
      }
    }
  }, [courseId, handleNextGame, router, signUpQueue, signupModal]);

  useEffect(() => {
    if (signupModal.isOpen) {
      (async function init() {
        const { success, error } = await getNextGame(game.GameId);
        if (success) {
          //if success.gameid starts with "next" throw error
          if (success.exist) {
            setNextGame(success);
          } else {
            setNextGame(null);
          }
        }
      })();
    }

    //eslint-disable-next-line
  }, [signupModal.isOpen]);

  if (!signUpQueue || !signupModal.isOpen) return null;

  return (
    <Drawer open={signupModal.isOpen}>
      <DrawerContent className="bg-gradient-to-br from-cyan-300  to-cyan-400">
        <div className="w-full max-w-xs md:max-w-sm mx-auto  mb-16 ">
          {scoreData && (
            <div className="flex items-center gap-2 justify-center p-1">
              <p className=" font-medium text-lg md:text-xl">
                {" "}
                ⚡ Total XP Earned:
              </p>
              <p className="text-lg md:text-xl font-semibold">{totalXp}</p>
            </div>
          )}
          <h3 className=" md:text-xl text-center py-2">
            {" "}
            Create a profile to save your progress!
          </h3>
          <XIcon
            onClick={handleClose}
            className="absolute top-2 right-2 w-6 h-6 cursor-pointer"
          />
          <Link href="/register" className="w-full mt-4 block">
            <Button variant="theme" className="w-full text-lg" onClick={() => signupModal.onClose()}>
              Sign up with Email
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
