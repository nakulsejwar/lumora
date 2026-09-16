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
import { RelatedTile } from "@/types/course";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import useCourseStore from "@/hooks/use-course-store";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { uploadTiles } from "@/actions/course/upload-tiles";
import { Checkbox } from "../ui/checkbox";
import { useBlogQuestionModal } from "@/hooks/use-edit-blog-question-modal";

const optionSchema = z.object({
  option: z.string().optional(),
  image: z.string().optional(),
  isSelected: z.boolean().optional(),
});

const tileFormSchema = z.object({
  tileid: z.string().optional(),
  type: z.string().optional(),
  questionTip: z.string().optional(),
  question: z.string().optional(),
  live: z.string().optional(),
  reason: z.string().optional(),
  isMultiCorrect: z.boolean().optional(),
  correctOption: z.array(z.number()).optional(),
  options: z.array(optionSchema),
});

type TileFormValues = z.infer<typeof tileFormSchema>;

const initializeFormValues = (tile: any) => {
  const correctOptionSet = new Set(tile.correctOption);
  const optionsWithSelection = tile.options.map(
    (option: any, index: number) => ({
      ...option,
      isSelected: correctOptionSet.has(index + 1),
    })
  );
  return {
    ...tile,
    options: optionsWithSelection,
  };
};

const EditQuestionForm = ({
  quizQuestions,
  tile,
  setQuizQuestions,
}: {
  quizQuestions: RelatedTile[];
  tile: RelatedTile;
  setQuizQuestions: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const editQuestionModal = useBlogQuestionModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<TileFormValues>({
    resolver: zodResolver(tileFormSchema),
    defaultValues: initializeFormValues(tile),
  });

  const { fields, append } = useFieldArray({
    name: "options",
    control: form.control,
  });

  const handleCheckboxChange = (index: number) => {
    const options = form.getValues("options");

    if (form.getValues("isMultiCorrect")) {
      form.setValue(`options.${index}.isSelected`, !options[index].isSelected);
    } else {
      options.forEach((option, i) => {
        form.setValue(`options.${i}.isSelected`, i === index);
      });
    }
    form.trigger("options");
  };

  const onSubmit = async (data: TileFormValues) => {
    // loadingModal.onOpen();

    const correctOptions = data.options
      .map((option, index) => (option.isSelected ? index + 1 : null))
      .filter((option) => option !== null);
    const updatedItem = {
      tileid: tile.tileid,
      qno: tile.qno,
      type: tile.type,
      question: data.question ? data.question : tile.question,
      questionTip: data.questionTip ? data.questionTip : tile.questionTip,
      correct: correctOptions.toString(),
      options: data.options,
      reason: data.reason ? data.reason : tile.reason,
      live: tile.live,
    };

    const quizData = quizQuestions.map((item) =>
      item.tileid === tile.tileid ? { ...item, ...updatedItem } : item
    );

    setQuizQuestions(quizData);

    editQuestionModal.onClose();
    loadingModal.onClose();
  };

  useEffect(() => {
    form.setValue;
    //eslint-disable-next-line
  }, [form.watch("options")]);

  return (
    <div className=" ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 h-[calc(100vh-15rem)] px-3"
        >
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:!ring-transparent"
                    defaultValue={tile.question}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questionTip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Tip</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    defaultValue={tile.questionTip}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    defaultValue={tile.reason}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isMultiCorrect"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between max-w-xs rounded-lg border p-2">
                <div className="">
                  <FormLabel className="text-base">
                    Is Multiple Correct
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    defaultChecked={tile.isMultiCorrect}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`options.${index}.isSelected`}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange(index);
                            }}
                            disabled={
                              form.getValues(`options.${index}.option`) === ""
                            }
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <div>
                  <FormField
                    control={form.control}
                    name={`options.${index}.option`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn("")}>
                          Option {index + 1}{" "}
                        </FormLabel>

                        <FormControl>
                          <Input
                            className=" focus:!ring-transparent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`options.${index}.image`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Link</FormLabel>
                        <FormControl>
                          <Input
                            className=" focus:!ring-transparent"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="live"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between max-w-xs  rounded-lg border p-2">
                <div className="">
                  <FormLabel className="text-base">Live</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    defaultChecked={tile.live === "yes" ? true : false}
                    checked={field.value === "yes" ? true : false}
                    onCheckedChange={field.onChange}
                    disabled
                    area-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-5">
            <Button type="submit">Update</Button>
            <Button
              type="button"
              onClick={() => {
                editQuestionModal.onClose();
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

export default EditQuestionForm;
