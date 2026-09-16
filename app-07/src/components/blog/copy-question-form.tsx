"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";
import { RelatedGame, RelatedTile } from "@/types/course";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import useCourseStore from "@/hooks/use-course-store";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { uploadTiles } from "@/actions/course/upload-tiles";
import { Checkbox } from "../ui/checkbox";
import { copyCourseData } from "@/actions/course/copy-data";
import { fetchTileData } from "@/actions/blog/get-tile-data";
import { useBlogQuestionModal } from "@/hooks/use-edit-blog-question-modal";

const tileFormSchema = z.object({
  tileid: z.string(),
});

type TileFormValues = z.infer<typeof tileFormSchema>;

const CopyQuestionForm = ({
  quizQuestions,
  setQuizQuestions,
}: {
  quizQuestions: RelatedTile[];
  setQuizQuestions: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const addQuestionModal = useBlogQuestionModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<TileFormValues>({
    resolver: zodResolver(tileFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: TileFormValues) => {
    loadingModal.onOpen();

    const { success, error } = await fetchTileData(data.tileid);

    if (error) {
      loadingModal.onClose();
      return toast.error("Something went wrong!", {
        description: error.message,
      });
    }
    const newData = {
      tileid: `id-${quizQuestions.length}`,
      question: success.question,
      qno: quizQuestions.length + 1,
      type: "mcq",
      isMultiCorrect: success.isMultiCorrect,
      questionTip: success.questionTip,
      correctOption: success.correctOption,
      //get first 4 items
      options: success.options.slice(0, 4),
      reason: success.reason,
      live: "yes",
    };

    setQuizQuestions([...quizQuestions, newData]);
    loadingModal.onClose();
    addQuestionModal.onClose();
    toast.success("Tile Copied successfully!");
  };

  return (
    <div className=" ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 h-[calc(100vh-15rem)] px-3"
        >
          <FormField
            control={form.control}
            name="tileid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Tile id</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-5">
            <Button type="submit">Add Question</Button>
            <Button
              type="button"
              onClick={() => {
                addQuestionModal.onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CopyQuestionForm;
