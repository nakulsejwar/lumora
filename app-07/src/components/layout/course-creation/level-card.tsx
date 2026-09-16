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

interface LevelCardProps {
  level: any;
  moduleId: any;
  handleLevelNameChange: (
    moduleId: string,
    levelId: string,
    newName: string
  ) => void;
  handleLevelDescriptionChange: (
    moduleId: string,
    levelId: string,
    newDescription: string
  ) => void;
}

export function LevelCard({
  level,
  moduleId,
  handleLevelNameChange,
  handleLevelDescriptionChange,
}: LevelCardProps) {
  const [isReadonly, setIsReadonly] = React.useState<boolean>(true);
  return (
    <Card>
      <CardHeader className="px-3 py-3 justify-between flex flex-row border-b-2 border-secondary relative">
        <CardTitle className="w-full mr-2 md:mr-5">
          <Input
            readOnly={isReadonly}
            id={`${level.id}-level-name`}
            name={`${level.id}-level-name`}
            type="text"
            className={cn(
              "md:text-lg font-medium  focus:!ring-transparent ",
              isReadonly ? "bg-transparent border-none " : ""
            )}
            value={level.level_name}
            onChange={(e) =>
              handleLevelNameChange(moduleId, level.id, e.target.value)
            }
          />
        </CardTitle>
        <Button
          variant="outline"
          className="h-8 text-xs md:text-sm"
          onClick={() => setIsReadonly(!isReadonly)}
        >
          {!isReadonly ? "Save" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        <div className="">
          {/* <Label htmlFor="course_description">Course Description</Label> */}
          <Textarea
            readOnly={isReadonly}
            id={`${level.id}-level-description`}
            name={`${level.id}-level-description`}
            className={cn(
              "w-full  font-medium border-none focus:!ring-transparent ",
              isReadonly ? "bg-transparent  " : ""
            )}
            value={level.level_description}
            onChange={(e) =>
              handleLevelDescriptionChange(moduleId, level.id, e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
