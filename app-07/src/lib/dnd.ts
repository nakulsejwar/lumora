import { Active, DataRef, Over } from "@dnd-kit/core";
import { TileDragData } from "@/components/tile-card";
import { RelatedTopic, RelatedLevel, RelatedGame } from "@/types/course";

export type ColumnType = "Topic" | "Level" | "Game";

export interface TopicDragData {
  type: ColumnType;
  topic: RelatedTopic;
}

export interface LevelDragData {
  type: ColumnType;
  level: RelatedLevel;
}

export interface GameDragData {
  type: ColumnType;
  game: RelatedGame;
}

type DraggableData =
  | TopicDragData
  | LevelDragData
  | GameDragData
  | TileDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (
    data?.type === "Topic" ||
    data?.type === "Level" ||
    data?.type === "Game" ||
    data?.type === "Tile"
  ) {
    return true;
  }

  return false;
}
