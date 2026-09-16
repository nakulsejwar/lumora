import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";
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
interface LevelCardProps {
  game: any;
  levelId: any;
  moduleId: any;
  isButtonDisabled: boolean;
  handleGameNameChange: (
    moduleId: string,
    levelId: string,
    gameId: string,
    newName: string
  ) => void;
  handleGameDescriptionChange: (
    moduleId: string,
    levelId: string,
    gameId: string,
    newDescription: string
  ) => void;
  handleRegenerateGame: (
    moduleId: string,
    levelId: string,
    gameId: string
  ) => void;
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export function GameCard({
  game,
  levelId,
  moduleId,
  isButtonDisabled,
  handleGameNameChange,
  handleGameDescriptionChange,
  handleRegenerateGame,
  userPrompt,
  setUserPrompt,
}: LevelCardProps) {
  const [isReadonly, setIsReadonly] = React.useState<boolean>(true);
  return (
    <Card>
      <CardHeader className="px-3 py-3 justify-between flex flex-row border-b-2 border-secondary relative">
        <CardTitle className="w-full mr-2 md:mr-5">
          <Input
            readOnly={isReadonly}
            id={`${game.id}-game-name`}
            name={`${game.id}-game-name`}
            type="text"
            className={cn(
              "w-full md:text-2xl font-medium border-none  focus:!ring-transparent ",
              isReadonly ? "bg-transparent" : ""
            )}
            value={game.game_name}
            onChange={(e) =>
              handleGameNameChange(moduleId, levelId, game.id, e.target.value)
            }
          />
        </CardTitle>

        <div className="flex items-start gap-1 ">
          <AlertDialog
            onOpenChange={() => {
              setTimeout(() => (document.body.style.pointerEvents = ""), 100);
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={`relative h-7 w-32 transition-all  ${
                  isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isButtonDisabled}
              >
                <span className="absolute text-black ">
                  {isButtonDisabled ? "loading" : "Regenerate"}
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
                    onChange={(e) => setUserPrompt(e.target.value)}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    handleRegenerateGame(moduleId, levelId, game.id)
                  }
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            className="h-8"
            onClick={() => setIsReadonly(!isReadonly)}
          >
            {!isReadonly ? "Save" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        <div className="">
          {/* <Label htmlFor="course_description">Course Description</Label> */}
          <Textarea
            readOnly={isReadonly}
            id={`${game.id}-game-description`}
            name={`${game.id}-game-description`}
            className={cn(
              "w-full  font-medium  focus:!ring-transparent ",
              isReadonly ? "bg-transparent border-none " : ""
            )}
            defaultValue={game.game_description}
            onChange={(e) =>
              handleGameDescriptionChange(
                moduleId,
                levelId,
                game.id,
                e.target.value
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
