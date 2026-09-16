import React, { forwardRef, HTMLAttributes } from "react";
import {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RelatedTopic } from "@/types/course";
import LevelContainer from "./level-container";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LevelsCollapsible } from "../collapsible";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

type SortableTopicProps = {
  topic: RelatedTopic;
} & HTMLAttributes<HTMLDivElement>;

const SortableTopic: React.FC<SortableTopicProps> = ({ topic, ...props }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: topic.topic_id,
    data: { type: "topic", current: topic },
  });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TopicItem
      topic={topic}
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

export default SortableTopic;

type Props = {
  topic: RelatedTopic;
  isOpacityEnabled?: boolean;
  isDragging: boolean;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
} & HTMLAttributes<HTMLDivElement>;

export const TopicItem = forwardRef<HTMLDivElement, Props>(
  (
    { topic, isOpacityEnabled, isDragging, attributes, listeners, ...props },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      element?.scrollIntoView({
        behavior: "smooth",
      });
    };

    const variants = cva("", {
      variants: {
        dragging: {
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    });

    return (
      <div
        ref={ref}
        className={cn(
          `flex flex-col border p-1 px-2 rounded-lg gap-2 ${
            isOpacityEnabled ? "opacity-40" : "opacity-100"
          }`
        )}
        {...props}
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className={`  ${isDragging ? "cursor-grabbing shadow-xl" : ""} ${
            isOpacityEnabled ? "shadow-none" : ""
          }`}
        >
          <div className="flex items-center justify-between  font-mono text-sm ">
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
              <button onClick={() => scrollToSection(topic?.topic_id)}>
                <h4 className="text-sm text-left font-semibold line-clamp-1">
                  {" "}
                  <span className="text-muted-foreground">{topic.order}.</span>
                  {topic?.name}
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
            <LevelContainer levels={topic.related_levels} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
);
