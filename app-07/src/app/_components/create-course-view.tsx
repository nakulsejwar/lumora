"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useChatSession from "@/hooks/use-chat-session";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { cn } from "@/lib/utils";
import { Course } from "@/types/draft";
import axios from "axios";
import {
  CloudUpload,
  FileIcon,
  LoaderCircle,
  PencilLineIcon,
} from "lucide-react";
import React from "react";
import exportCSV from "@/lib/export-csv";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import generateGames from "@/actions/generate-games";
import uploadCourseToDB from "@/lib/upload-course-to-db";
import { useSession } from "next-auth/react";
import { saveHistory } from "@/actions/history/save-history";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDraftStore from "@/hooks/use-draft-store";
import ProgressDiv from "./progress-div";
export default function CreateCourseView() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const historyId = searchParams.get("uid");
  const { data: session } = useSession();
  const loadingModal = useLoadingModal();
  const currentCourse = useDraftStore((state) => state.course);
  const chat = useChatSession((state) => state.chat);
  const updateChat = useChatSession((state) => state.updateChat);

  const [historyUid, setHistoryUid] = React.useState<string | null>(historyId);

  const [courseDetails, setCourseDetails] = React.useState<Course | null>(
    currentCourse
  );
  const [userPrompt, setUserPrompt] = React.useState<string>("");
  const [isReadonly, setIsReadonly] = React.useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState<boolean>(true);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCourseDetails((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleModuleNameChange = (moduleId: string, newName: string) => {
    setCourseDetails((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        modules: prevData.modules.map((module) =>
          module.id === moduleId ? { ...module, module_name: newName } : module
        ),
      };
    });
  };

  const handleModuleDescriptionChange = (
    moduleId: string,
    newDescription: string
  ) => {
    setCourseDetails((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        modules: prevData.modules.map((module) =>
          module.id === moduleId
            ? { ...module, module_description: newDescription }
            : module
        ),
      };
    });
  };

  const handleLevelNameChange = (
    moduleId: string,
    levelId: string,
    newName: string
  ) => {
    setCourseDetails((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        modules: prevData.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                levels: module.levels.map((level) =>
                  level.id === levelId
                    ? { ...level, level_name: newName }
                    : level
                ),
              }
            : module
        ),
      };
    });
  };

  const handleLevelDescriptionChange = (
    moduleId: string,
    levelId: string,
    newDescription: string
  ) => {
    setCourseDetails((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        modules: prevData.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                levels: module.levels.map((level) =>
                  level.id === levelId
                    ? { ...level, level_description: newDescription }
                    : level
                ),
              }
            : module
        ),
      };
    });
  };

  const handleGameNameChange = (
    moduleId: string,
    levelId: string,
    gameId: string,
    newName: string
  ) => {
    setCourseDetails((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        modules: prevData.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                levels: module.levels.map((level) =>
                  level.id === levelId
                    ? {
                        ...level,
                        games: level.games!.map((game) =>
                          game.id === gameId
                            ? { ...game, game_name: newName }
                            : game
                        ),
                      }
                    : level
                ),
              }
            : module
        ),
      };
    });
  };

  const handleGameDescriptionChange = (
    moduleId: string,
    levelId: string,
    gameId: string,
    newDescription: string
  ) => {
    setCourseDetails((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        modules: prevData.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                levels: module.levels.map((level) =>
                  level.id === levelId
                    ? {
                        ...level,
                        games: level.games!.map((game) =>
                          game.id === gameId
                            ? { ...game, game_description: newDescription }
                            : game
                        ),
                      }
                    : level
                ),
              }
            : module
        ),
      };
    });
  };

  const handleExportCsv = async () => {
    try {
      await exportCSV(courseDetails!);
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleUploadtoDB = async () => {
    loadingModal.onOpen();
    try {
      await uploadCourseToDB(courseDetails!, session?.user?.email!);

      router.push("/my-courses");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
    loadingModal.onClose();
  };

  const handleSaveHistory = async () => {
    loadingModal.onOpen();
    const content = {
      uid: historyUid ? historyUid : "",
      useremail: session?.user?.email!,
      history: {
        courseDetails,
        chat,
      },
    };

    console.log(content);

    const { success, error } = await saveHistory(content);

    if (error) {
      loadingModal.onClose();
      return toast.error("Something went wrong!");
    }
    if (success.uid) {
      setHistoryUid(success.uid);
    }
    loadingModal.onClose();
    toast.success(success.status);
  };

  const handleCreateGame = async (
    moduleId: string,
    levelId: string,
    showmodal?: boolean
  ) => {
    setIsGenerating(true);
    !showmodal && loadingModal.onOpen();
    try {
      const data = await generateGames({
        chat_history: chat,
        moduleId,
        levelId,
      });

      if (data.success) {
        updateChat({
          userPrompt: data.success?.prompt!,
          modelResponse: JSON.stringify(data.success.games),
        });
        setCourseDetails((prevData) => {
          if (!prevData) return null;
          const newData = { ...prevData };
          const moduleIndex = newData.modules.findIndex(
            (module) => module.id === moduleId
          );
          const levelIndex = newData.modules[moduleIndex].levels.findIndex(
            (level) => level.id === levelId
          );

          newData.modules[moduleIndex].levels[levelIndex].games =
            data.success.games.games;

          return newData;
        });
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsGenerating(false);
      loadingModal.onClose();
    }
  };

  const createAllGames = async () => {
    for (const topic of courseDetails?.modules!) {
      for (const level of topic.levels) {
        if (!level.games || level.games.length === 0) {
          await handleCreateGame(topic.id, level.id, true);
        } else {
          toast.warning(`Game already created for level ${level.level_name}`);
        }
      }
    }
  };

  const handleRegenerateGame = async (
    moduleId: string,
    levelId: string,
    gameId: string
  ) => {
    loadingModal.onOpen();
    try {
      const { data } = await axios.post("/api/regenerate-game", {
        chat_history: chat,
        moduleId,
        levelId,
        gameId,
        userPrompt,
      });

      if (data) {
        setCourseDetails((prevData) => {
          if (!prevData) return null;
          const newData = { ...prevData };
          const moduleIndex = newData.modules.findIndex(
            (module) => module.id === moduleId
          );
          const levelIndex = newData.modules[moduleIndex].levels.findIndex(
            (level) => level.id === levelId
          );

          const gameIndex =
            newData.modules[moduleIndex].levels[levelIndex].games?.findIndex(
              (game) => game.id === gameId
            ) || 0;

          newData.modules[moduleIndex].levels[levelIndex].games![gameIndex] =
            data.games.games[0];

          return newData;
        });
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setUserPrompt("");
      loadingModal.onClose();
    }
  };

  if (!courseDetails) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full bg-gray-50 p-2 md:p-5 rounded-md mt-16">
      <div className="space-y-4 p-1 md:p-5 ">
        <div className="">
          <div className=" w-full flex items-end justify-between">
            <Label htmlFor="course_name">Course Name</Label>
            <div className="space-x-4 pb-2">
              <Button
                variant="outline"
                className="h-8"
                onClick={() => setIsReadonly(!isReadonly)}
              >
                {!isReadonly ? "Save" : "Edit"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={handleSaveHistory}
              >
                <PencilLineIcon className="h-3 w-3" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {historyUid ? "Update Draft" : "Draft"}
                </span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={handleExportCsv}
              >
                <FileIcon className="h-3 w-3" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={handleUploadtoDB}
              >
                <CloudUpload className="h-3 w-3" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Upload
                </span>
              </Button>
            </div>
          </div>
          <Input
            readOnly={isReadonly}
            id="course_name"
            name="course_name"
            type="text"
            className={cn(
              "w-full text-2xl font-medium border-none  focus:!ring-transparent ",
              isReadonly ? "bg-transparent" : ""
            )}
            value={courseDetails.course_name}
            onChange={handleChange}
          />
        </div>
        <div className="">
          <Label htmlFor="course_description">Course Description</Label>
          <Textarea
            readOnly={isReadonly}
            id="course_description"
            name="course_description"
            className={cn(
              "w-full  font-medium focus:!ring-transparent ",
              isReadonly ? "bg-transparent border-none " : ""
            )}
            defaultValue={courseDetails.course_description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className=" md:p-5 ">
        <div className="flex items-center justify-between py-1">
          <Label htmlFor="modules">Modules</Label>
          <Button
            variant="outline"
            className={`relative h-7  transition-all  ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isButtonDisabled || isGenerating}
            onClick={createAllGames}
          >
            Generate all games
          </Button>
        </div>
        <div className="space-y-6">
          {courseDetails.modules.map((module, idx) => (
            <div
              key={module.id}
              className=" md:p-5 space-y-4 rounded-md shadow-sm bg-gray-100 "
            >
              <div className="">
                <Input
                  readOnly={isReadonly}
                  id={`${module.id}-module_name`}
                  name={`${module.id}-module_name`}
                  type="text"
                  className={cn(
                    "w-full text-xl font-medium border-none  focus:!ring-transparent ",
                    isReadonly ? "bg-transparent" : ""
                  )}
                  value={module.module_name}
                  onChange={(e) =>
                    handleModuleNameChange(module.id, e.target.value)
                  }
                />
              </div>
              <div className="">
                <Textarea
                  readOnly={isReadonly}
                  id={`${module.id}-module_description`}
                  name={`${module.id}-module_description`}
                  className={cn(
                    "w-full  font-medium  focus:!ring-transparent ",
                    isReadonly
                      ? "bg-transparent border-none "
                      : " focus:!ring-transparent"
                  )}
                  defaultValue={module.module_description}
                  onChange={(e) =>
                    handleModuleDescriptionChange(module.id, e.target.value)
                  }
                />
              </div>

              <div className="space-y-4 mt-5">
                <Label htmlFor="modules">Levels</Label>
                {module.levels.map((level, idx) => (
                  <div
                    key={level.id}
                    className={cn(
                      "p-1 md:p-5 space-y-2 rounded-md shadow-sm bg-gray-200  ",
                      level.games ? "lg:flex lg:items-start " : ""
                    )}
                  >
                    <div className="w-1/ space-y-2">
                      <div className="">
                        <Textarea
                          readOnly={isReadonly}
                          id={`${level.id}-level-name`}
                          name={`${level.id}-level-name`}
                          className={cn(
                            "text-lg font-medium border-none !h-fit focus:!ring-transparent ",
                            isReadonly ? "bg-transparent" : ""
                          )}
                          value={level.level_name}
                          onChange={(e) =>
                            handleLevelNameChange(
                              module.id,
                              level.id,
                              e.target.value
                            )
                          }
                        />
                      </div>{" "}
                      <div className="">
                        <Textarea
                          readOnly={isReadonly}
                          id={`${level.id}-level-description`}
                          name={`${level.id}-level-description`}
                          className={cn(
                            "w-full  font-medium border-none focus:!ring-transparent ",
                            isReadonly ? "bg-transparent  " : ""
                          )}
                          defaultValue={level.level_description}
                          onChange={(e) =>
                            handleLevelDescriptionChange(
                              module.id,
                              level.id,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    {level.games ? (
                      <div className=" md:pl-6 space-y-4 w-full">
                        {level.games.map((game, index: number) => (
                          <div
                            key={game.id}
                            className="bg-gray-50 rounded-md p-1 md:p-3"
                          >
                            <span className="text-xs text-gray-500">
                              Game-{index + 1}
                            </span>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-2 pb-2 md:justify-between">
                              <Input
                                readOnly={isReadonly}
                                id={`${game.id}-game-name`}
                                name={`${game.id}-game-name`}
                                type="text"
                                className={cn(
                                  "w-full text-2xl font-medium border-none  focus:!ring-transparent ",
                                  isReadonly ? "bg-transparent" : ""
                                )}
                                value={game.game_name}
                                onChange={(e) =>
                                  handleGameNameChange(
                                    module.id,
                                    level.id,
                                    game.id,
                                    e.target.value
                                  )
                                }
                              />

                              <AlertDialog
                                onOpenChange={() => {
                                  setTimeout(
                                    () =>
                                      (document.body.style.pointerEvents = ""),
                                    100
                                  );
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={`relative h-7 w-32 transition-all  ${
                                      isButtonDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    disabled={isButtonDisabled}
                                  >
                                    {isButtonDisabled && (
                                      <ProgressDiv
                                        courseDetails={courseDetails}
                                        setIsButtonDisabled={
                                          setIsButtonDisabled
                                        }
                                      />
                                    )}
                                    <span className="absolute text-black ">
                                      {isButtonDisabled
                                        ? "loading"
                                        : "Regenerate"}
                                    </span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      What would you like to change here ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      <Textarea
                                        id="userPrompt"
                                        name="userPrompt"
                                        className={cn(
                                          "w-full  font-medium  focus:!ring-transparent "
                                        )}
                                        value={userPrompt}
                                        onChange={(e) =>
                                          setUserPrompt(e.target.value)
                                        }
                                      />
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRegenerateGame(
                                          module.id,
                                          level.id,
                                          game.id
                                        )
                                      }
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            <div className="text-xs">
                              <Textarea
                                readOnly={isReadonly}
                                id={`${game.id}-game-description`}
                                name={`${game.id}-game-description`}
                                className={cn(
                                  "w-full  font-medium  focus:!ring-transparent ",
                                  isReadonly
                                    ? "bg-transparent border-none "
                                    : ""
                                )}
                                defaultValue={game.game_description}
                                onChange={(e) =>
                                  handleGameDescriptionChange(
                                    module.id,
                                    level.id,
                                    game.id,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              {game?.questions?.map((question, idx) => (
                                <div key={question.id}>
                                  <p>
                                    <span>{idx + 1}.</span>
                                    <span> {question.question}</span>
                                  </p>
                                  <div className="md:pl-5">
                                    <p>
                                      {question.option1 &&
                                        question.option1 !== null &&
                                        question.option1 !== "" && (
                                          <span>
                                            <span className="text-xs ">1</span>{" "}
                                            {question.option1}
                                          </span>
                                        )}
                                    </p>
                                    <p>
                                      {question.option2 &&
                                        question.option2 !== null &&
                                        question.option2 !== "" && (
                                          <span>
                                            <span className="text-xs ">2</span>{" "}
                                            {question.option2}
                                          </span>
                                        )}
                                    </p>
                                    <p>
                                      {question.option3 &&
                                        question.option3 !== null &&
                                        question.option3 !== "" && (
                                          <span>
                                            <span className="text-xs ">3</span>{" "}
                                            {question.option3}
                                          </span>
                                        )}
                                    </p>
                                    <p>
                                      {question.option4 &&
                                        question.option4 !== null &&
                                        question.option4 !== "" && (
                                          <span>
                                            <span className="text-xs ">4</span>{" "}
                                            {question.option4}
                                          </span>
                                        )}
                                    </p>
                                    <p className="italic font-medium">
                                      correct answer: {question.correct_answer}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {!isGenerating ? (
                          <Button
                            variant="outline"
                            className={`relative h-7 w-32 transition-all  ${
                              isButtonDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={isButtonDisabled}
                            onClick={() =>
                              handleCreateGame(module.id, level.id)
                            }
                          >
                            {isButtonDisabled && (
                              <ProgressDiv
                                courseDetails={courseDetails}
                                setIsButtonDisabled={setIsButtonDisabled}
                              />
                            )}
                            <span className="absolute text-black ">
                              {isButtonDisabled ? "loading" : "Create Games"}
                            </span>
                          </Button>
                        ) : (
                          <div className="flex items-center text-sm gap-2 px-2 italic">
                            Generating games{" "}
                            <span>
                              <LoaderCircle className="w-4 h-4 animate-spin text-blue-400" />{" "}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
