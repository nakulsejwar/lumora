"use client";
import { useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  pointerWithin,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { RelatedGame, RelatedLevel, RelatedTopic } from "@/types/course";
import { TopicItem } from "./topic-item";
import { LevelItem } from "./level-item";
import { GameItem } from "./game-item";
import TopicsContainer from "./topic-container";

import { useLoadingModal } from "@/hooks/use-loading-modal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { uploadLevels } from "@/actions/course/upload-levels";
import { uploadTopics } from "@/actions/course/upload-topics";
import { uploadGames } from "@/actions/course/upload-games";
export function SidebarBoard({
  courseTopics,
}: {
  courseTopics: RelatedTopic[];
}) {
  const queryClient = useQueryClient();
  const [topics, setTopics] = useState<RelatedTopic[]>(courseTopics);

  const [activeItem, setActiveItem] = useState<
    RelatedTopic | RelatedLevel | RelatedGame | null
  >(null);

  const loadingModal = useLoadingModal();

  // for input methods detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUploadRearrangedTopics = async (topics: RelatedTopic[]) => {
    loadingModal.onOpen();
    toast.loading("Updating...");
    const newTopics = topics.map((topic, index) => {
      return {
        topic_id: topic.topic_id,
        courseid: topic.courseid,
        order: topic.order,
        name: topic.name,
        ImageLink: topic.ImageLink,
        topic_tip: topic.topic_tip,
        live: topic.live,
      };
    });

    const { success, error } = await uploadTopics({
      topics: newTopics,
      action: "update",
    });

    if (error) {
      // console.log(error);
      toast.error("somthing went wrong..");
      toast.dismiss();
      return loadingModal.onClose();
    }

    await queryClient.invalidateQueries({
      queryKey: ["course", { courseId: courseTopics[0].courseid }],
    });

    toast.success(success.message);

    toast.dismiss();
    loadingModal.onClose();
  };

  const handleUploadRearrangedLevels = async (levels: RelatedLevel[]) => {
    loadingModal.onOpen();
    toast.loading("Updating...");
    const newLevels = levels.map((level, index) => {
      return {
        topic_id: level.topic_id,
        level_id: level.level_id,
        order: level.order,
        name: level.name,
        ImageLink: level.ImageLink,
        level_tip: level.level_tip,
        live: level.live,
      };
    });

    const { success, error } = await uploadLevels({
      levels: newLevels,
      action: "update",
    });

    if (error) {
      // console.log(error);
      toast.error("somthing went wrong..");
      toast.dismiss();
      return loadingModal.onClose();
    }

    await queryClient.invalidateQueries({
      queryKey: ["course", { courseId: courseTopics[0].courseid }],
    });

    toast.success(success.message);

    toast.dismiss();
    loadingModal.onClose();
  };

  const handleUploadRearrangedGames = async (games: RelatedGame[]) => {
    loadingModal.onOpen();
    toast.loading("Updating...");
    const newGames = games.map((game, index) => {
      return {
        level_id: game.level_id,
        gameid: game.gameid,
        order: game.order,
        name: game.name,
        ImageLink: game.ImageLink,
        gameTip: game.gameTip,
        in_gameTip: game.in_gameTip,
        live: game.live,
      };
    });

    const { success, error } = await uploadGames({
      games: newGames,
      action: "update",
    });

    if (error) {
      // console.log(error);
      toast.error("somthing went wrong..");
      toast.dismiss();
      return loadingModal.onClose();
    }

    await queryClient.invalidateQueries({
      queryKey: ["course", { courseId: courseTopics[0].courseid }],
    });

    toast.success(success.message);

    toast.dismiss();
    loadingModal.onClose();
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(
      event.active.data.current?.current as
        | RelatedTopic
        | RelatedLevel
        | RelatedGame
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over) return;
    // console.log("checking for in---------", active.data.current?.current);
    // console.log("checking for in---------", active);
    if ("related_levels" in active.data.current?.current) {
      handleTopicDragEnd(event);
    } else if ("related_games" in active.data.current?.current) {
      handleLevelDragEnd(event);
    } else {
      handleGameDragEnd(event);
    }
  };

  const handleTopicDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const oldIndex = topics.findIndex((topic) => topic.topic_id === active.id);
    const newIndex = topics.findIndex((topic) => topic.topic_id === over.id);

    if (oldIndex < 0 || newIndex < 0 || newIndex === oldIndex) return;

    const newTopics = arrayMove(topics, oldIndex, newIndex);

    newTopics.forEach((item, index) => {
      item.order = index + 1;
    });

    setTopics(newTopics);

    await new Promise((resolve) => setTimeout(resolve, 300));

    await handleUploadRearrangedTopics(newTopics);
  };

  const handleLevelDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const topicId = (active.data.current?.current as RelatedLevel).topic_id;
    const topic = topics.find((a) => a.topic_id === topicId);

    if (!topic) return;

    const relatedLevels = topic.related_levels;
    const oldIndex = relatedLevels.findIndex(
      (level) => level.level_id === active.id
    );
    const newIndex = relatedLevels.findIndex(
      (level) => level.level_id === over.id
    );

    const newLevels = arrayMove(relatedLevels, oldIndex, newIndex);

    newLevels.forEach((item, index) => {
      item.order = index + 1;
    });

    setTopics((prevData) => {
      const newData = [...prevData];
      const topicIndex = newData.findIndex((item) => item.topic_id === topicId);
      newData[topicIndex].related_levels = newLevels;
      return newData;
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    await handleUploadRearrangedLevels(newLevels);
  };

  const handleGameDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const levelId = (active.data.current?.current as RelatedGame).level_id;
    const topic = topics.find((a) =>
      a.related_levels.some((s) => s.level_id === levelId)
    );

    if (!topic) return;

    const level = topic.related_levels.find((s) => s.level_id === levelId);

    if (!level) return;

    const games = level.related_games;
    const oldIndex = games.findIndex((game) => game.gameid === active.id);
    const newIndex = games.findIndex((game) => game.gameid === over.id);

    const newGames = arrayMove(games, oldIndex, newIndex);

    newGames.forEach((item, index) => {
      item.order = index + 1;
    });

    setTopics((prevData) => {
      const newData = [...prevData];
      const topicIndex = newData.findIndex(
        (item) => item.topic_id === topic.topic_id
      );
      const levelIndex = newData[topicIndex].related_levels.findIndex(
        (item) => item.level_id === levelId
      );
      newData[topicIndex].related_levels[levelIndex].related_games = newGames;
      return newData;
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    await handleUploadRearrangedGames(newGames);
  };

  const handleDragCancel = () => {
    setActiveItem(null);
  };

  const renderOverlay = () => {
    if (!activeItem) return null;

    // console.log("activeItem", activeItem);

    if ("related_levels" in activeItem) {
      return <TopicItem topic={activeItem as RelatedTopic} isDragging />;
    } else if ("related_games" in activeItem) {
      return <LevelItem level={activeItem as RelatedLevel} isDragging />;
    } else {
      return <GameItem game={activeItem as RelatedGame} isDragging />;
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      // modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
    >
      {" "}
      <TopicsContainer topics={topics} />
      {/* {activeItem ? <Trash /> : null} */}
      {typeof window !== "undefined" &&
        "document" in window &&
        createPortal(
          <DragOverlay>{renderOverlay()}</DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
