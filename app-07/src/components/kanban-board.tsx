"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { TileCard } from "./tile-card";
import { coordinateGetter } from "@/lib/multi-container-keyboard-preset";
import { hasDraggableData } from "@/lib/dnd";
import { RelatedTile } from "@/types/course";
import isEqual from "lodash.isequal";
import { Button } from "./ui/button";
import { uploadTiles } from "@/actions/course/upload-tiles";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export function KanbanBoard({ initialTiles }: { initialTiles: RelatedTile[] }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [tiles, setTiles] = useState<RelatedTile[]>(initialTiles);
  const [activeTile, setActiveTile] = useState<RelatedTile | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const { courseId } = useParams<{ courseId: string }>();
  const loadingModal = useLoadingModal();
  const tilesIds = useMemo(() => tiles?.map((tile) => tile.tileid), [tiles]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTileData(tileId: UniqueIdentifier) {
    const tilePosition = tiles.findIndex((tile) => tile.tileid === tileId);
    return {
      tilePosition,
    };
  }

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
          tiles.length
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
          tiles.length
        } `;
      }
    },
    onDragCancel({ active }) {
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  const handleUploadRearrangedTiles = async () => {
    loadingModal.onOpen();
    toast.loading("Updating...");
    const newTiles = tiles.map((tile, index) => {
      return {
        tileid: tile.tileid,
        gameid: tile.gameid,
        qno: index + 1, // updating the qno here
        type: tile.type,
        question: tile.question,
        questionTip: tile.questionTip,
        correct: tile.correctOption.toString(),
        op1: tile.options[0].option,
        op1Link: tile.options[0].image,
        op2: tile.options[1].option,
        op2Link: tile.options[1].image,
        op3: tile.options[2].option,
        op3Link: tile.options[2].image,
        op4: tile.options[3].option,
        op4Link: tile.options[3].image,
        op5: tile.options[4].option,
        op5Link: tile.options[4].image,
        op6: tile.options[5].option,
        op6Link: tile.options[5].image,
        op7: tile.options[6].option,
        op7Link: tile.options[6].image,
        op8: tile.options[7].option,
        op8Link: tile.options[7].image,
        reason: tile.reason,
        live: "yes",
      };
    });

    const { success, error } = await uploadTiles(
      {
        tiles: newTiles,
        action: "update",
      },
      courseId
    );

    if (error) {
      console.log(error);
      toast.error("somthing went wrong..");
      toast.dismiss();
      return loadingModal.onClose();
    }

    await queryClient.invalidateQueries({
      queryKey: ["course", { courseId }],
    });

    toast.success(success.message);

    toast.dismiss();
    loadingModal.onClose();
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

    const quizData = tiles.map((item) =>
      item.tileid === tile.tileid ? { ...item, ...updatedItem } : item
    );

    setTiles(quizData);
  };

  useEffect(() => {
    setHasChanges(!isEqual(tiles, initialTiles));
  }, [tiles, initialTiles, hasChanges]);

  // Sort tiles by tileno before rendering
  // const sortedTiles = [...tiles].sort((a, b) => a.qno - b.qno);
  // console.log("tiles", tiles);

  useEffect(() => {
    setTiles(initialTiles);
  }, [initialTiles]);
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
            {tiles?.map((tile) => (
              <TileCard
                key={tile.tileid}
                tile={tile}
                topic={initialTiles[0].type}
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
                <TileCard
                  tile={activeTile}
                  topic={initialTiles[0].type}
                  handleReplace={handleReplace}
                  isOverlay
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>

      {hasChanges && (
        <div className="space-x-3">
          <Button
            variant="default"
            className=""
            onClick={handleUploadRearrangedTiles}
          >
            Save
          </Button>
          <Button
            variant="outline"
            className=""
            onClick={() => setTiles(initialTiles)}
          >
            Reset
          </Button>
        </div>
      )}
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
      setTiles((tiles) => {
        const activeIndex = tiles.findIndex((t) => t.tileid === activeId);
        const overIndex = tiles.findIndex((t) => t.tileid === overId);

        return arrayMove(tiles, activeIndex, overIndex);
      });
    }
  }
}
