import React, { forwardRef, HTMLAttributes } from "react";
import {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RelatedGame } from "@/types/course";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

type SortableGameProps = {
  game: RelatedGame;
} & HTMLAttributes<HTMLDivElement>;

const SortableGame: React.FC<SortableGameProps> = ({ game, ...props }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: game.gameid, data: { type: "game", current: game } });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <GameItem
      game={game}
      ref={setNodeRef}
      isOpacityEnabled={isDragging}
      isDragging={isDragging}
      style={styles}
      attributes={attributes}
      listeners={listeners}
      {...props}
    />
  );
};

export default SortableGame;

type Props = {
  game: RelatedGame;
  isOpacityEnabled?: boolean;
  isDragging: boolean;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
} & HTMLAttributes<HTMLDivElement>;

export const GameItem = forwardRef<HTMLDivElement, Props>(
  (
    { game, isOpacityEnabled, isDragging, attributes, listeners, ...props },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      element?.scrollIntoView({
        behavior: "smooth",
      });
    };
    return (
      <div
        ref={ref}
        className={`flex flex-col rounded-lg gap-2 ${
          isOpacityEnabled ? "opacity-40" : "opacity-100"
        }`}
        {...props}
      >
        <div
          className={`flex rounded-md border p-2 px-3 w-full font-mono text-sm bg-white  ${
            isDragging ? "cursor-grabbing shadow-xl" : " shadow-sm"
          } ${isOpacityEnabled ? "shadow-none" : ""}`}
        >
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move tile</span>
            <GripVertical className="w-4 h-4" />
          </Button>
          <button
            key={game.gameid}
            className=" font-mono text-sm"
            onClick={() => scrollToSection(game?.gameid)}
          >
            <h4 className="text-sm text-left font-semibold line-clamp-2">
              <span className="text-muted-foreground">{game.order}.</span>
              {game?.name}
            </h4>
          </button>
        </div>
      </div>
    );
  }
);
