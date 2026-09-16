"use client";
import { GameDetails } from "@/types/game.types";
import { createContext, useContext, useState } from "react";

const useGameState = (initialGame: GameDetails) =>
  useState<GameDetails>(initialGame);

const GameContext = createContext<ReturnType<typeof useGameState> | null>(null);

const GameProvider = ({
  game: initialGame,
  children,
}: {
  game: GameDetails;
  children: React.ReactNode;
}) => {
  const [game, setGame] = useGameState(initialGame);

  return (
    <GameContext.Provider value={[game, setGame]}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;

export const useGameContext = () => {
  const user = useContext(GameContext);
  if (!user) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return user;
};
