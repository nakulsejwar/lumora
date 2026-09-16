import GameIdPage from "@/app/(main)/_components/game/game-component";
import LoadingView from "@/components/common/loading";
import { Suspense } from "react";
interface BoardIdPageProps {
  params: {
    gameId: string;
  };
}

export default function page({ params }: BoardIdPageProps) {
  return (
    <Suspense fallback={<LoadingView />}>
      <GameIdPage gameId={params.gameId} />
    </Suspense>
  );
}
