import React from "react";

import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { RelatedGame } from "@/types/course";
import SortableGame from "./game-item";

type Props = {
  games: Array<RelatedGame>;
};

const GameContainer: React.FC<Props> = ({ games }) => {
  return (
    <SortableContext
      items={games.map((game) => game.gameid)}
      strategy={horizontalListSortingStrategy}
    >
      <div className=" mt-2 space-y-3">
        {games.map((game) => {
          return <SortableGame key={game.gameid} game={game} />;
        })}
      </div>
    </SortableContext>
  );
};

export default GameContainer;
