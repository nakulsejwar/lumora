"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { sendGTMEvent } from "@next/third-parties/google";
import { Info, Play, Search } from "lucide-react";
import { useGameInfoModal } from "@/lib/hooks/use-game-info-modal";
import { GameInfoModal } from "../modals/game-info-modal";

function GameTile({ game }: { game: any }) {
  const [selectedGameTip, setSelectedGameTip] = React.useState<string>("");
  const gameInfoModal = useGameInfoModal();

  return (
    <>
      <div className="relative bg-[#faf8ff] border-2 border-[#070235] shadow-2xl w-full max-w-[330px] rounded-2xl p-3.5 flex gap-3 text-[#131b2e]">
        {game.ImageLink && game.ImageLink !== "None" && (
          <Image
            src={game.ImageLink}
            alt=""
            width={120}
            height={120}
            className="rounded-xl w-[90px] h-[90px] object-cover border border-[#c8c5d0] shrink-0"
          />
        )}
        <div className="flex flex-col justify-between w-full min-w-0">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-mono font-extrabold uppercase text-[#0091cf]">
                MISSION TILE
              </span>
              <button
                onClick={() => {
                  setSelectedGameTip(game.gameTip);
                  sendGTMEvent({
                    event: "game_info_click",
                    gameId: game.gameid,
                    gameTitle: game.name,
                  });
                  gameInfoModal.onOpen();
                }}
                className="w-5 h-5 rounded-full bg-[#eaedff] text-[#0091cf] flex items-center justify-center hover:bg-[#dae2fd]"
                title="Mission Briefing Info"
              >
                <Info className="w-3 h-3 text-[#0091cf]" />
              </button>
            </div>
            <h4 className="text-sm font-extrabold text-[#070235] leading-tight capitalize truncate mt-0.5">
              {game.name}
            </h4>
            <p className="text-[11px] text-[#47464f] line-clamp-2 mt-0.5 leading-snug">
              {game.gameTip}
            </p>
          </div>

          <div className="mt-2">
            <Link
              href={`/${game.gameid}`}
              className="w-full py-2 bg-[#070235] hover:bg-[#1e1b4b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all border border-[#89ceff]/30"
              id={game.gameid}
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#fe932c]" />
              <span>Play Mission</span>
            </Link>
          </div>
        </div>
      </div>

      <GameInfoModal item={selectedGameTip} />
    </>
  );
}

export default GameTile;

