"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useEffect, useRef } from "react";
import { useGamePopupModal } from "@/lib/hooks/use-game-popup-modal";
import { useGameStore } from "@/lib/hooks/use-game";
export const GamePopupModal = () => {
  const gamePopupModal = useGamePopupModal();
  const loadingBarRef = useRef<LoadingBarRef>(null);
  const { game } = useGameStore();

  useEffect(() => {
    if (gamePopupModal.isOpen && game.GameId === gamePopupModal.gameid) {
      if (loadingBarRef.current) {
        console.log("loading wokring");
        loadingBarRef.current.continuousStart(0, 1000); // 5 seconds
      }
      setTimeout(() => {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
          gamePopupModal.onClose();
        }
      }, 7500); // 5 seconds/ 5 seconds
    }
    // eslint-disable-next-line
  }, [gamePopupModal.isOpen, game]);

  if (!gamePopupModal.isOpen || game.GameId !== gamePopupModal.gameid) {
    return null;
  }
  return (
    <Dialog open={gamePopupModal.isOpen} onOpenChange={gamePopupModal.onClose}>
      <DialogContent className=" !p-0 overflow-hidden  !border border-blue-200 bg-transparent shadow-none  ">
        <Card className="  relative">
          <XIcon
            onClick={gamePopupModal.onClose}
            className="absolute top-2 right-2 text-blue-300 cursor-pointer"
          />

          <CardContent className="flex flex-col items-center justify-center px-5 py-6 text-sm ">
            <LoadingBar color="#f97316" ref={loadingBarRef} />
            <h2 className="text-xl font-semibold">{game.Name}</h2>
            <p>{game.gameTip}</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
