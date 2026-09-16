"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlogQuestionModal } from "@/hooks/use-edit-blog-question-modal";
import AddQuestionForm from "../blog/add-question-form";
import EditQuestionForm from "../blog/edit-question-form";
import CopyQuestionForm from "../blog/copy-question-form";
import { RelatedTile } from "@/types/course";
export const BlogQuestionModal = ({
  quizQuestions,
  setQuizQuestions,
}: {
  quizQuestions: RelatedTile[];
  setQuizQuestions: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { isOpen, item, data, onClose } = useBlogQuestionModal();

  if (!item) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl ">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {" "}
            {item === "add-question"
              ? "Add Question"
              : item === "edit-question"
              ? "Edit Question"
              : ""}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full">
          {item === "edit-question" && (
            <EditQuestionForm
              tile={data}
              quizQuestions={quizQuestions}
              setQuizQuestions={setQuizQuestions}
            />
          )}
          {item === "add-question" && (
            <>
              <Tabs defaultValue="manual" className="">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="json">Tile Id</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <AddQuestionForm
                    quizQuestions={quizQuestions}
                    setQuizQuestions={setQuizQuestions}
                  />
                </TabsContent>
                <TabsContent value="json">
                  <CopyQuestionForm
                    quizQuestions={quizQuestions}
                    setQuizQuestions={setQuizQuestions}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
