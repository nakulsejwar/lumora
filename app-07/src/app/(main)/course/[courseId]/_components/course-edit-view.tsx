"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Copy, Edit, Trash } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseType } from "@/types/course";
import DateComponent from "@/components/date-component";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import Link from "next/link";
import { CourseItemEditModal } from "@/components/modals/course-item-edit-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { getCourses } from "@/actions/course/get-courses";
import { deleteCourseData } from "@/actions/course/delete-course";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { KanbanBoard } from "@/components/kanban-board";
import { toast } from "sonner";
import { PushToLiveAlertDialog } from "./push-to-live-alert";
import Sidebar from "./sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileSidebar } from "./mobile-sidebar";
export default function CourseEditView() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const editCourseModal = useCourseEditModal();
  const loadingModal = useLoadingModal();
  const { courseId } = useParams<{ courseId: string }>();
  const { data: session } = useSession();

  const {
    data: courseDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["course", { courseId }],
    queryFn: async () => {
      const course = await getCourses(session?.user?.email!, courseId);

      if (course.error) throw new Error((course.error as Error).message);
      if (course.success) return course.success[0] as CourseType;
    },
  });

  const handleDelete = async (uid: string, data: string) => {
    loadingModal.onOpen();
    await deleteCourseData(uid, data);
    await queryClient.invalidateQueries({
      queryKey: ["course", { courseId }],
    });
    if (data === "course") {
      router.push("/my-courses");
    }
    loadingModal.onClose();
  };

  if (!courseDetails || isLoading || error) {
    return <p>Loading...</p>;
  }
  return (
    <section className="flex h-screen max-w-7xl mx-auto overflow-hidden pt-16 ">
      <ScrollArea className="h-full lg:w-[350px]" scrollHideDelay={0}>
        <Sidebar courseDetails={courseDetails} />
      </ScrollArea>

      <div className="w-full overflow-hidden px-2 md:px-5 rounded-md">
        <ScrollArea className="h-full">
          <div className="flex items-center justify-between">
            <div className={cn("block lg:!hidden")}>
              <MobileSidebar courseDetails={courseDetails} />
            </div>
            <div className="flex items-center gap-2">
              <PushToLiveAlertDialog
                courseId={courseDetails.courseid}
                live={courseDetails.live}
              />
              <Link
                href={
                  courseDetails.live === "no"
                    ? `https://dev.lumora.app/courses`
                    : `https://lumora.app/courses`
                }
                prefetch={false}
                rel="noopener noreferrer"
                target="_blank"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Go to Course
              </Link>
            </div>
          </div>
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <p className="flex flex-col">
                  <span>{courseDetails.name} </span>
                  <span className="text-xs text-muted-foreground">
                    {courseDetails.courseid}
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 flex items-center gap-1  "
                    onClick={() =>
                      editCourseModal.onOpen("course", courseDetails)
                    }
                  >
                    <Edit className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Edit
                    </span>
                  </Button>
                  <button
                    onClick={() =>
                      handleDelete(courseDetails.courseid, "course")
                    }
                    className=""
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </CardTitle>
              <CardDescription>
                created at
                <DateComponent datetime={courseDetails.created_at} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4 text-sm md:text-base">
                {courseDetails.course_tip}
              </div>
            </CardContent>
          </Card>

          <div className=" md:p-5 ">
            <div className="flex items-center justify-between py-1">
              <Label htmlFor="modules">Modules</Label>

              <Button
                variant="outline"
                className="h-8"
                onClick={() =>
                  editCourseModal.onOpen("create-module", courseDetails)
                }
              >
                Add Module
              </Button>
            </div>
            <div className="space-y-6">
              {courseDetails?.related_topics?.map((topic, idx) => (
                <div
                  key={topic.topic_id}
                  id={`${topic.topic_id}`}
                  className=" md:p-5 space-y-4 rounded-md shadow-sm bg-gray-100 scroll-m-16  "
                >
                  <Card className="">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <p className="flex flex-col">
                          <span>{topic.name} </span>
                          <span className="text-xs text-muted-foreground">
                            {topic.topic_id}
                          </span>
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            className="shadow-md rounded-sm p-1 md:p-1.5"
                            onClick={() =>
                              editCourseModal.onOpen("topic", topic)
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="shadow-md rounded-sm p-1 md:p-1.5"
                            onClick={() => {
                              navigator.clipboard
                                .writeText(topic.topic_id)
                                .then(
                                  function () {
                                    /* clipboard successfully set */
                                    toast.success(
                                      "Copied topic id to clipboard"
                                    );
                                  },
                                  function () {
                                    /* clipboard write failed */
                                    toast.error("Failed to copy to clipboard");
                                  }
                                );
                            }}
                          >
                            <Copy className="w-4 h-4 " />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(topic.topic_id, "topic")
                            }
                            className=""
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid w-full items-center gap-4 text-sm md:text-base">
                        {topic.topic_tip}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4 mt-5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="modules">Levels</Label>
                      <Button
                        variant="outline"
                        className="h-8"
                        onClick={() =>
                          editCourseModal.onOpen("create-level", topic)
                        }
                      >
                        Add Level
                      </Button>
                    </div>
                    {topic?.related_levels?.map((level, idx) => (
                      <div
                        key={level.level_id}
                        id={`${level.level_id}`}
                        className={cn(
                          "p-1 md:p-5 space-y-2 rounded-md shadow-sm bg-gray-200  "
                        )}
                      >
                        <Card className="">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <p className="flex flex-col">
                                <span>{level.name} </span>
                                <span className="text-xs text-muted-foreground">
                                  {level.level_id}
                                </span>
                              </p>

                              <div className="flex items-center gap-3">
                                <button
                                  className="shadow-md rounded-sm p-1 md:p-1.5"
                                  onClick={() =>
                                    editCourseModal.onOpen("level", level)
                                  }
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  className="shadow-md rounded-sm p-1 md:p-1.5"
                                  onClick={() => {
                                    navigator.clipboard
                                      .writeText(level.level_id)
                                      .then(
                                        function () {
                                          /* clipboard successfully set */
                                          toast.success(
                                            "Copied level id to clipboard"
                                          );
                                        },
                                        function () {
                                          /* clipboard write failed */
                                          toast.error(
                                            "Failed to copy to clipboard"
                                          );
                                        }
                                      );
                                  }}
                                >
                                  <Copy className="w-4 h-4 " />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(level.level_id, "level")
                                  }
                                  className=""
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid w-full items-center gap-4 text-sm md:text-base">
                              {level?.level_tip}
                            </div>
                          </CardContent>
                        </Card>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="modules">Games</Label>
                          <Button
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              editCourseModal.onOpen("create-game", level)
                            }
                          >
                            Add Game
                          </Button>
                        </div>
                        {level?.related_games ? (
                          <div className=" md:pl-6 space-y-4 w-full">
                            {level?.related_games?.map(
                              (game, index: number) => (
                                <div
                                  key={game.gameid}
                                  id={`${game.gameid}`}
                                  className="bg-gray-50 rounded-md p-1 md:p-3"
                                >
                                  <span className="text-xs text-gray-500">
                                    Game-{index + 1}
                                  </span>

                                  <Card className="mb-2">
                                    <CardHeader>
                                      <CardTitle className="flex items-center justify-between">
                                        <p className="flex flex-col">
                                          <span>{game.name} </span>
                                          <span className="text-xs text-muted-foreground">
                                            {game.gameid}
                                          </span>
                                        </p>

                                        <div className="flex items-center gap-3">
                                          <button
                                            className="shadow-md rounded-sm p-1 md:p-1.5"
                                            onClick={() =>
                                              editCourseModal.onOpen(
                                                "game",
                                                game
                                              )
                                            }
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            className="shadow-md rounded-sm p-1 md:p-1.5"
                                            onClick={() => {
                                              navigator.clipboard
                                                .writeText(game.gameid)
                                                .then(
                                                  function () {
                                                    /* clipboard successfully set */
                                                    toast.success(
                                                      "Copied game id to clipboard"
                                                    );
                                                  },
                                                  function () {
                                                    /* clipboard write failed */
                                                    toast.error(
                                                      "Failed to copy to clipboard"
                                                    );
                                                  }
                                                );
                                            }}
                                          >
                                            <Copy className="w-4 h-4 " />
                                          </button>

                                          <button
                                            onClick={() =>
                                              handleDelete(game.gameid, "game")
                                            }
                                            className=""
                                          >
                                            <Trash className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid w-full items-center gap-4 text-sm md:text-base">
                                        {game.gameTip}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <div className="space-y-2 max-w-4xl  md:pl-5 lg:pl-8">
                                    {/* {game?.related_tiles?.map((tile, index) => (
                                <div key={tile.tileid} className="">
                                  <Card className=" p-2">
                                    <CardContent className="text-sm md:text-base">
                                      <div className="grid w-full items-center ">
                                        <div className="flex items-center justify-between">
                                          <p>
                                            <span>{index + 1}</span>
                                            <span> {tile.question}</span>
                                          </p>

                                          <TileActionButton data={tile} />
                                        </div>
                                        <div className="md:pl-5">
                                          {tile?.options?.map(
                                            (question, index) => (
                                              <p
                                                key={`${question.option}-${index}`}
                                              >
                                                {question?.option &&
                                                  question?.option !== null &&
                                                  question?.option !== "" && (
                                                    <span>
                                                      <span className="text-xs ">
                                                        {index + 1}
                                                      </span>{" "}
                                                      {question.option}
                                                    </span>
                                                  )}
                                              </p>
                                            )
                                          )}

                                          {tile?.isMultiCorrect ? (
                                            <div className="flex items-center gap-3 italic font-medium">
                                              correct answers:{" "}
                                              <p className="space-x-2 divide-x-2">
                                                {tile?.correctOption?.map(
                                                  (item, index) => (
                                                    <span
                                                      key={`${index}-${item}`}
                                                    >
                                                      {
                                                        tile?.options[item - 1]
                                                          ?.option
                                                      }
                                                    </span>
                                                  )
                                                )}
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="italic font-medium">
                                              correct answer:{" "}
                                              {
                                                tile?.options[
                                                  tile?.correctOption[0] - 1
                                                ]?.option
                                              }
                                            </p>
                                          )}
                                          <p className="text-sm">
                                            Reason: {tile?.reason}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              ))} */}
                                    {game?.related_tiles && (
                                      <KanbanBoard
                                        initialTiles={game?.related_tiles}
                                      />
                                    )}

                                    <div className="flex justify-end ">
                                      <Button
                                        className=""
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          editCourseModal.onOpen(
                                            "create-tile",
                                            game
                                          )
                                        }
                                      >
                                        Add Tile
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <>nogame</>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* //edit modal */}

        <CourseItemEditModal />
      </div>
    </section>
  );
}
