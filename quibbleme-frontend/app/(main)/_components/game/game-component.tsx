import GameScreen from "@/app/(main)/_components/game/game-screen";
import GameWrapper from "@/app/(main)/_components/game/game-wrapper";
import { getGame, getGameData } from "@/app/api/games.api";
import Error from "@/app/error";
import StoreInitializer from "@/components/common/store-initializer";
import { useGameStore } from "@/lib/hooks/use-game";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { GameData } from "@/types/game.types";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const GameIdPage = async ({ gameId }: { gameId: string }) => {
  try {
    const gameDetails = await getGame(gameId);
    useGameStore.setState({ game: gameDetails });
    const gameData = await getGameData(gameId);
    useGameDataStore.setState({
      gamedata: gameData!,
      updatedGameData: gameData!,
    });

    if (gameData?.questions?.error) {
      return (
        <div className="">
          <h1
            className="animate-fade-up custom-gradient  text-center font-display text-3xl font-bold  text-transparent py-2 md:pt-7  drop-shadow-sm [text-wrap:balance] md:text-6xl xl:text-7xl md:!leading-[5rem]"
            style={{
              animationDelay: "0.15s",
              animationFillMode: "forwards",
            }}
          >
            Coming Soon
          </h1>
          <p className="text-sm md:text-xl text-center ">
            We&apos;re working hard to bring you something amazing. Stay tuned!
          </p>

          <Link
            href="/courses"
            prefetch={false}
            id="Back to home"
            className="flex items-center justify-center w-full  mt-3 text-center  z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      );
    }

    return (
      <div className=" z-10 h-full">
        <StoreInitializer game={gameDetails} gamedata={gameData!} />
        <GameWrapper />
      </div>
    );
  } catch (error) {
    return <Error />;
  }
};

export default GameIdPage;
