"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import CourseEditForm from "../forms/course-edit-form";
import { ScrollArea } from "../ui/scroll-area";
import TopicEditForm from "../forms/topic-edit-form";
import LevelEditForm from "../forms/level-edit-form";
import GameEditForm from "../forms/game-edit-form";
import TileEditForm from "../forms/tile-edit-form";
import AddTileForm from "../forms/add-tile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopyTileForm from "../forms/copy-tile-form";
export const CourseItemEditModal = () => {
  const { isOpen, item, data, onClose } = useCourseEditModal();

  if (!item) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl ">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {" "}
            {item === "create-tile"
              ? "Add Tile"
              : item === "create-module"
              ? "Add Module"
              : item === "create-level"
              ? "Add Level"
              : item === "create-game"
              ? "Add Game"
              : `Edit ${item}`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full">
          {item === "course" && <CourseEditForm course={data} />}
          {item === "topic" && <TopicEditForm topic={data} />}
          {item === "level" && <LevelEditForm level={data} />}
          {item === "game" && <GameEditForm game={data} />}
          {item === "tile" && <TileEditForm tile={data} />}
          {item === "create-tile" && (
            <>
              <Tabs defaultValue="manual" className="">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="json">Tile Id</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <AddTileForm game={data} />
                </TabsContent>
                <TabsContent value="json">
                  <CopyTileForm data={`tile`} toId={data.gameid} />
                </TabsContent>
              </Tabs>
            </>
          )}

          {item === "create-module" && (
            <CopyTileForm data={`topic`} toId={data.courseid} />
          )}

          {item === "create-level" && (
            <CopyTileForm data={`level`} toId={data.topic_id} />
          )}

          {item === "create-game" && (
            <CopyTileForm data={`game`} toId={data.level_id} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
