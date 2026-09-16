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

interface CourseCardProps {
  courseDetails: any;
  handleChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

export function CourseCard({ courseDetails, handleChange }: CourseCardProps) {
  const [isReadonly, setIsReadonly] = React.useState<boolean>(true);
  return (
    <Card>
      <CardHeader className="px-3 py-3 justify-between flex flex-row border-b-2 border-secondary relative">
        <CardTitle className="w-full mr-2 md:mr-5">
          <Input
            readOnly={isReadonly}
            id="course_name"
            name="course_name"
            type="text"
            className={cn(
              "w-full md:text-2xl font-medium   focus:!ring-transparent ",
              isReadonly ? "bg-transparent border-none" : ""
            )}
            value={courseDetails.course_name}
            onChange={handleChange}
          />
        </CardTitle>
        <Button
          variant="outline"
          className="h-8"
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
      </CardContent>
    </Card>
  );
}
