"use client";

import { useEffect, useRef } from "react";

import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { type GameData, type GameDetails } from "@/types/game.types";
import { useGameStore } from "@/lib/hooks/use-game";

function StoreInitializer({
  game,
  gamedata,
}: {
  game: GameDetails;
  gamedata: GameData;
}) {
  // console.log("initializer game", game);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useGameStore.setState({ game });
      useGameDataStore.setState({
        gamedata: gamedata!,
        updatedGameData: gamedata!,
      });
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default StoreInitializer;
