"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { QuestionCard } from "./question-card";
import { coordinateGetter } from "@/lib/multi-container-keyboard-preset";
import { hasDraggableData } from "@/lib/dnd";
import { RelatedTile } from "@/types/course";
import isEqual from "lodash.isequal";
import { uploadTiles } from "@/actions/course/upload-tiles";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function BlogQuizKanban({
  topic,
  quizTiles,
  setQuizTiles,
}: {
  topic: string;
  quizTiles: RelatedTile[];
  setQuizTiles: React.Dispatch<React.SetStateAction<any>>;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTile, setActiveTile] = useState<RelatedTile | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const { courseId } = useParams<{ courseId: string }>();
  const loadingModal = useLoadingModal();
  const tilesIds = useMemo(
    () => quizTiles?.map((tile) => tile.tileid),
    [quizTiles]
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTileData(tileId: UniqueIdentifier) {
    const tilePosition = quizTiles.findIndex((tile) => tile.tileid === tileId);
    return {
      tilePosition,
    };
  }

  const handleDelete = (tileidToDelete: string) => {
    const quizData = quizTiles.filter((item) => item.tileid !== tileidToDelete);
    setQuizTiles(quizData);
  };

  const handleReplace = (tile: any) => {
    const updatedItem = {
      tileid: tile.tileid,
      qno: tile.qno,
      type: tile.type,
      question: tile.question,
      questionTip: tile.questionTip,
      correct: tile.correct,
      options: tile.options,
      reason: tile.reason,
      live: tile.live,
    };

    const quizData = quizTiles.map((item) =>
      item.tileid === tile.tileid ? { ...item, ...updatedItem } : item
    );

    setQuizTiles(quizData);
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Tile") {
        // pickedUpTileColumn.current = active.data.current.tile.columnId;
        const { tilePosition } = getDraggingTileData(active.id);
        return `Picked up Tile ${
          active.data.current.tile.tileid
        } at position: ${tilePosition + 1} 
      }`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Tile" &&
        over.data.current?.type === "Tile"
      ) {
        const { tilePosition } = getDraggingTileData(over.id);

        return `Tile was moved over position ${tilePosition + 1} of ${
          quizTiles.length
        } `;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        return;
      }
      if (
        active.data.current?.type === "Tile" &&
        over.data.current?.type === "Tile"
      ) {
        const { tilePosition } = getDraggingTileData(over.id);

        return `Tile was dropped into position ${tilePosition + 1} of ${
          quizTiles.length
        } `;
      }
    },
    onDragCancel({ active }) {
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <div>
      <DndContext
        accessibility={{
          announcements,
        }}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div
          className="flex flex-grow flex-col gap-2 p-2
      "
        >
          <SortableContext items={tilesIds}>
            {quizTiles?.map((tile) => (
              <QuestionCard
                handleDelete={handleDelete}
                key={tile.tileid}
                tile={tile}
                topic={topic}
                handleReplace={handleReplace}
              />
            ))}
          </SortableContext>
        </div>
        {typeof window !== "undefined" &&
          "document" in window &&
          createPortal(
            <DragOverlay>
              {activeTile && (
                <QuestionCard
                  handleDelete={handleDelete}
                  tile={activeTile}
                  topic={topic}
                  handleReplace={handleReplace}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;

    if (data?.type === "Tile") {
      setActiveTile(data.tile);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTile(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    if (activeId === overId) return;
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATile = activeData?.type === "Tile";
    const isOverATile = overData?.type === "Tile";

    if (!isActiveATile) return;

    // Im dropping a Tile over another Tile
    if (isActiveATile && isOverATile) {
      setQuizTiles((tiles: RelatedTile[]) => {
        const activeIndex = tiles.findIndex((t) => t.tileid === activeId);
        const overIndex = tiles.findIndex((t) => t.tileid === overId);

        return arrayMove(tiles, activeIndex, overIndex);
      });
    }
  }
}
