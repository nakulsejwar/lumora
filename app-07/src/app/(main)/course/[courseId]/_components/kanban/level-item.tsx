import React, { forwardRef, HTMLAttributes } from "react";
import {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RelatedLevel } from "@/types/course";
import GameContainer from "./game-container";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LevelsCollapsible } from "../collapsible";
type SortableLevelProps = {
  level: RelatedLevel;
} & HTMLAttributes<HTMLDivElement>;

const SortableLevel: React.FC<SortableLevelProps> = ({ level, ...props }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: level.level_id,
    data: { type: "level", current: level },
  });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <LevelItem
      level={level}
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

export default SortableLevel;

type Props = {
  level: RelatedLevel;
  isOpacityEnabled?: boolean;
  isDragging: boolean;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
} & HTMLAttributes<HTMLDivElement>;

export const LevelItem = forwardRef<HTMLDivElement, Props>(
  (
    { level, isOpacityEnabled, isDragging, attributes, listeners, ...props },
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
        className={`flex flex-col rounded-lg border bg-gray-50 p-2 gap-2 ${
          isOpacityEnabled ? "opacity-40" : "opacity-100"
        }`}
        {...props}
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className={`  ${isDragging ? "cursor-grabbing shadow-xl" : " "} ${
            isOpacityEnabled ? "shadow-none" : ""
          }`}
        >
          <div className="flex items-center justify-between  p-1 px-2 font-mono text-sm ">
            <div className="flex items-center gap-2">
              <Button
                variant={"ghost"}
                {...attributes}
                {...listeners}
                className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
              >
                <span className="sr-only">Move tile</span>
                <GripVertical className="w-4 h-4" />
              </Button>
              <button onClick={() => scrollToSection(level?.level_id)}>
                <h4 className="text-sm text-left font-semibold line-clamp-2">
                  {" "}
                  <span className="text-muted-foreground">{level.order}.</span>
                  {level?.name}
                </h4>
              </button>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-3">
            <GameContainer games={level.related_games} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
);
