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
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw } from "lucide-react";

const items = [
  {
    id: "The module structure lacks sufficient detail.",
    label: "Not Detailed Enough",
    desc: "The course structure lacks sufficient detail.",
  },
  {
    id: "The module structure is too detailed or complex for my needs.",
    label: "Too Detailed/Complex",
    desc: "The module structure is too detailed or complex for my needs.",
  },
  {
    id: "The levels are not organized in a logical manner.",
    label: "Poor Organization",
    desc: "The lessons are not organized in a logical manner.",
  },
  {
    id: "Important topics or levels are missing.",
    label: "Missing Key Topics",
    desc: "Important topics or lessons are missing.",
  },
] as const;

interface TopicCardProps {
  topic: any;
  handleModuleNameChange: (moduleId: string, newName: string) => void;
  handleModuleDescriptionChange: (
    moduleId: string,
    newDescription: string
  ) => void;
  handleRegenerateModule: (moduleId: string) => void;
  selectedRegenerateModuleItems: string[];
  setSelectedRegenerateModuleItems: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export function TopicCard({
  topic,
  handleModuleNameChange,
  handleModuleDescriptionChange,
  handleRegenerateModule,
  selectedRegenerateModuleItems,
  setSelectedRegenerateModuleItems,
  userPrompt,
  setUserPrompt,
}: TopicCardProps) {
  const [isReadonly, setIsReadonly] = React.useState<boolean>(true);
  return (
    <Card>
      <CardHeader className="px-3 py-3 justify-between flex flex-row border-b-2 border-secondary  relative">
        <CardTitle className="w-full mr-2 md:mr-5">
          <Input
            readOnly={isReadonly}
            id={`${topic.id}-module_name`}
            name={`${topic.id}-module_name`}
            type="text"
            className={cn(
              "w-full  md:text-xl font-medium focus:!ring-transparent ",
              isReadonly ? "bg-transparent  border-none " : ""
            )}
            value={topic.module_name}
            onChange={(e) => handleModuleNameChange(topic.id, e.target.value)}
          />
        </CardTitle>

        <div className="flex items-start gap-1 ">
          <AlertDialog
            onOpenChange={() => {
              setTimeout(() => (document.body.style.pointerEvents = ""), 100);
            }}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="h-8 text-xs md:text-sm">
                <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p className="text-sm">
                    What didn&apos;t you like about this module? Please select
                    one or more reasons and provide additional comments if
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
                          checked={selectedRegenerateModuleItems.includes(
                            item.id
                          )}
                          onCheckedChange={(checked) => {
                            return checked
                              ? setSelectedRegenerateModuleItems((prev) => [
                                  ...prev,
                                  item.id,
                                ])
                              : setSelectedRegenerateModuleItems(
                                  selectedRegenerateModuleItems.filter(
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
                    setSelectedRegenerateModuleItems([]);
                    setUserPrompt("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRegenerateModule(topic.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            className="h-8 text-xs md:text-sm"
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
            id={`${topic.id}-module_description`}
            name={`${topic.id}-module_description`}
            className={cn(
              "w-full  font-medium  focus:!ring-transparent ",
              isReadonly
                ? "bg-transparent border-none "
                : " focus:!ring-transparent"
            )}
            defaultValue={topic.module_description}
            onChange={(e) =>
              handleModuleDescriptionChange(topic.id, e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
