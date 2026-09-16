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
import { Form, FormField } from "@/components/ui/form";
import regenerateCourse from "@/actions/regenerate-course";
import { Checkbox } from "@/components/ui/checkbox";
import { CourseCard } from "@/components/layout/course-creation/course-card";
import { TopicCard } from "@/components/layout/course-creation/topic-card";
import { LevelCard } from "@/components/layout/course-creation/level-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import regenerateModule from "@/actions/regenerate-modules";
import generateModules from "@/actions/generate-modules";
import { GameCard } from "@/components/layout/course-creation/game-card";

const items = [
  {
    id: "The course structure lacks sufficient detail.",
    label: "Not Detailed Enough",
    desc: "The course structure lacks sufficient detail.",
  },
  {
    id: "The structure is too detailed or complex for my needs.",
    label: "Too Detailed/Complex",
    desc: "The structure is too detailed or complex for my needs.",
  },
  {
    id: "Some parts of the structure are not relevant to the course topic.",
    label: "Irrelevant Content",
    desc: "Some parts of the structure are not relevant to the course topic.",
  },
  {
    id: "The modules and chapters are not organized in a logical manner.",
    label: "Poor Organization",
    desc: "The modules and chapters are not organized in a logical manner.",
  },
  {
    id: "Important topics or chapters are missing.",
    label: "Missing Key Topics",
    desc: "Important topics or chapters are missing.",
  },
] as const;
export default function CourseView() {
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
  const [hideDesc, setHideDesc] = React.useState<boolean>(false);
  const [isReadonly, setIsReadonly] = React.useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState<boolean>(true);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  const [selectedRegenerateItems, setSelectedRegenerateItems] = React.useState<
    string[]
  >([]);

  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const [selectedRegenerateModuleItems, setSelectedRegenerateModuleItems] =
    React.useState<string[]>([]);

  const [selectedExpandCourseOption, setSelectedExpandCourseOption] =
    React.useState<string | null>(null);

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

  const handleRegenerateCourse = async () => {
    loadingModal.onOpen();
    try {
      const data = await regenerateCourse({
        chat_history: chat,
        user_prompt: userPrompt,
        items: selectedRegenerateItems,
      });

      // console.log("regenerate data client", data);
      if (data.success) {
        updateChat({
          userPrompt: data.success?.prompt!,
          modelResponse: JSON.stringify(data.success.courseData),
        });
        setCourseDetails(data.success.courseData);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSelectedRegenerateItems([]);
      setUserPrompt("");
      loadingModal.onClose();
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportCSV(courseDetails!);
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong!");
    }
  };
  async function clientUploadToCloudinary(file: File, key: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  }

  const handleUploadtoDB = async () => {
    loadingModal.onOpen();
    try {
      let uploadedImageUrl = "";

      if (imageFile) {
        const rawName = `${courseDetails!.course_name}-${Date.now()}.png`;
        const key = `course/${rawName}`;

        uploadedImageUrl = await clientUploadToCloudinary(imageFile, key);

        setCourseDetails((prev) =>
          prev ? { ...prev, ImageLink: uploadedImageUrl } : prev
        );
      }




      // ✅ send final ImageLink to DB
      await uploadCourseToDB(
        {
          ...courseDetails!,
          ImageLink: uploadedImageUrl || courseDetails?.ImageLink || "",
        },
        session?.user?.email!
      );

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

    // console.log(content);

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

  const handleGenerateModule = async () => {
    // loadingModal.onOpen();
    toast.loading("Generating...");
    try {
      const { success, error } = await generateModules({
        user_prompt: userPrompt,
        chat_history: chat,
      });

      if (success) {
        // console.log(success);
        updateChat({
          userPrompt: success?.prompt!,
          modelResponse: JSON.stringify(success.module),
        });
        setCourseDetails((prevData) => {
          // console.log("prevData", prevData);
          if (!prevData) return null;
          const newData = { ...prevData };

          newData.modules = [...newData.modules, ...success.module];

          // console.log(newData, "newData");
          toast.success("Module generated successfully");

          return newData;
        });
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      toast.dismiss();
      setUserPrompt("");
      // loadingModal.onClose();
    }
  };

  const handleExpandCourse = async () => {
    if (selectedExpandCourseOption === "games") {
      createAllGames();
    } else if (selectedExpandCourseOption === "modules") {
      handleGenerateModule();
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

  const handleRegenerateModule = async (moduleId: string) => {
    loadingModal.onOpen();
    try {
      const { success, error } = await regenerateModule({
        user_prompt: userPrompt,
        chat_history: chat,
        moduleId,
        items: ["", ""],
      });

      if (success) {
        updateChat({
          userPrompt: success?.prompt!,
          modelResponse: JSON.stringify(success.module),
        });
        setCourseDetails((prevData) => {
          if (!prevData) return null;
          const newData = { ...prevData };
          const moduleIndex = newData.modules.findIndex(
            (module) => module.id === moduleId
          );

          const newModule = success.module;
          newData.modules[moduleIndex] = newModule;

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

  // console.log("selectedRegenerateItems--",selectedRegenerateItems);
  // console.log("chat--",chat);

  if (!courseDetails) {
    return <p>Loading...</p>;
  }
  return (
    <div className="pb-20 mt-16">
      <div className="p-5">
        <details className="w-full border rounded-lg">
          <summary className="p-4 focus:outline-none text-sm cursor-pointer ">
            Here is the initial outline of your course. This is just a starting
            point, and you can further customize it to suit your needs.
          </summary>
          <p className="px-6  text-xs dark:text-gray-600">
            You have several options moving forward:
            <ul className="list-disc p-2">
              <li>
                <strong>Edit Structure:</strong> Modify the existing modules and
                chapters to better fit your vision.
              </li>
              <li>
                <strong>Regenerate Structure:</strong> Generate a new outline if
                this one doesn&apos;t meet your expectations.
              </li>
              <li>
                <strong>Expand Content:</strong> Dive deeper into each module to
                create detailed topics and descriptions.
              </li>
            </ul>
          </p>
        </details>
        <p className=""></p>
      </div>
      <div className="w-full  p-2 md:p-5 rounded-md">
        <div className="flex items-center gap-2 justify-end">
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
        <div className="space-y-2 p-1  ">
          <CourseCard
            courseDetails={courseDetails}
            handleChange={handleChange}
          />
        </div>
        <div className="p-3">
          <Label className="block text-sm font-medium">Upload Course Image</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-2"
          />
        </div>


        <div className=" pl-8 ">
          {/* <div className="flex items-center justify-between py-1">
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
          </div> */}
          <div className="space-y-2">
            {courseDetails?.modules?.map((module, idx) => (
              <div key={module.id} className="  space-y-2 rounded-md  ">
                <span>Module {idx + 1}</span>
                <TopicCard
                  topic={module}
                  handleModuleNameChange={handleModuleNameChange}
                  handleModuleDescriptionChange={handleModuleDescriptionChange}
                  handleRegenerateModule={handleRegenerateModule}
                  selectedRegenerateModuleItems={selectedRegenerateModuleItems}
                  setSelectedRegenerateModuleItems={
                    setSelectedRegenerateModuleItems
                  }
                  userPrompt={userPrompt}
                  setUserPrompt={setUserPrompt}
                />

                <div className="md:pl-8 space-y-4 ">
                  {/* <Label htmlFor="modules">Levels</Label> */}
                  {module.levels.map((level, idx) => (
                    <div
                      key={level.id}
                      className={cn(" space-y-2 rounded-md   ")}
                    >
                      <span>Lesson {idx + 1}</span>
                      <LevelCard
                        level={level}
                        moduleId={module.id}
                        handleLevelNameChange={handleLevelNameChange}
                        handleLevelDescriptionChange={
                          handleLevelDescriptionChange
                        }
                      />
                      {level.games ? (
                        <div className=" md:pl-6 space-y-4 w-full">
                          {level.games.map((game, index: number) => (
                            <div key={game.id} className=" p-1 md:p-3">
                              <span className="text-xs text-gray-500">
                                Game-{index + 1}
                              </span>

                              <GameCard
                                game={game}
                                levelId={level.id}
                                moduleId={module.id}
                                isButtonDisabled={isButtonDisabled}
                                handleGameNameChange={handleGameNameChange}
                                handleGameDescriptionChange={
                                  handleGameDescriptionChange
                                }
                                handleRegenerateGame={handleRegenerateGame}
                                userPrompt={userPrompt}
                                setUserPrompt={setUserPrompt}
                              />

                              <div className="md:pl-5 space-y-2">
                                {game?.questions?.map((question) => (
                                  <div key={question.id}>
                                    <p>
                                      <span>{question.id}.</span>
                                      <span> {question.question}</span>
                                    </p>
                                    <div className="md:pl-5">
                                      <p>
                                        {question.option1 &&
                                          question.option1 !== null &&
                                          question.option1 !== "" && (
                                            <span>
                                              <span className="text-xs ">
                                                1
                                              </span>{" "}
                                              {question.option1}
                                            </span>
                                          )}
                                      </p>
                                      <p>
                                        {question.option2 &&
                                          question.option2 !== null &&
                                          question.option2 !== "" && (
                                            <span>
                                              <span className="text-xs ">
                                                2
                                              </span>{" "}
                                              {question.option2}
                                            </span>
                                          )}
                                      </p>
                                      <p>
                                        {question.option3 &&
                                          question.option3 !== null &&
                                          question.option3 !== "" && (
                                            <span>
                                              <span className="text-xs ">
                                                3
                                              </span>{" "}
                                              {question.option3}
                                            </span>
                                          )}
                                      </p>
                                      <p>
                                        {question.option4 &&
                                          question.option4 !== null &&
                                          question.option4 !== "" && (
                                            <span>
                                              <span className="text-xs ">
                                                4
                                              </span>{" "}
                                              {question.option4}
                                            </span>
                                          )}
                                      </p>
                                      <p className="italic font-medium">
                                        correct answer:{" "}
                                        {question.correct_answer}
                                      </p>

                                      <p className="italic font-medium text-xs md:text-sm">
                                        reason: {question?.reason}
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
                          {isGenerating && (
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

      {/* button */}

      <div className="flex flex-col md:flex-row items-center justify-around gap-3">
        <AlertDialog
          onOpenChange={() => {
            setTimeout(() => (document.body.style.pointerEvents = ""), 100);
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className={` transition-all 
            
                 `}
            >
              Regenerate Course
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <p className="text-sm">
                  What didn&apos;t you like about the current structure? Please
                  select one or more reasons and provide additional comments if
                  needed.
                </p>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  {/* <CourseRegenerateOptionsForm /> */}

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <Checkbox
                        checked={selectedRegenerateItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? setSelectedRegenerateItems((prev) => [
                                ...prev,
                                item.id,
                              ])
                            : setSelectedRegenerateItems(
                                selectedRegenerateItems.filter(
                                  (id) => id !== item.id
                                )
                              );
                        }}
                      />

                      <p className="flex flex-col">
                        <span className="text-gray-800 font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs">{item.desc}</span>
                      </p>
                    </div>
                  ))}

                  <p className="pt-2 text-gray-800 font-medium">
                    Any other reasons not covered above.
                  </p>

                  <Textarea
                    id="userPrompt"
                    name="userPrompt"
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent "
                    )}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setSelectedRegenerateItems([]);
                  setUserPrompt("");
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerateCourse}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          onOpenChange={() => {
            setTimeout(() => (document.body.style.pointerEvents = ""), 100);
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className={` transition-all 
            
                 `}
            >
              Expand Course
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <p className="text-sm">
                  How would you like to expand this course ?
                </p>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  {/* <CourseRegenerateOptionsForm /> */}

                  <RadioGroup
                    defaultValue={
                      selectedExpandCourseOption
                        ? selectedExpandCourseOption
                        : ""
                    }
                    onValueChange={setSelectedExpandCourseOption}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="modules" id="r1" />
                      <Label htmlFor="r1">Add more Modules</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="games" id="r2" />
                      <Label htmlFor="r2">Add games to all lessons</Label>
                    </div>
                  </RadioGroup>

                  <p className="pt-2 text-gray-800 font-medium">
                    Any other reasons not covered above.
                  </p>

                  <Textarea
                    id="userPrompt"
                    name="userPrompt"
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent "
                    )}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setSelectedExpandCourseOption(null);
                  setUserPrompt("");
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleExpandCourse}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
