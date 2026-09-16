"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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

import LoadingQuestions from "../LoadingQuestions";
import { toast } from "sonner";
import { courseCreationSchema } from "@/schemas/course";
import { CourseType, RelatedLevel, RelatedTopic } from "@/types/course";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import useCourseStore from "@/hooks/use-course-store";
import generateGames from "@/actions/generate-games";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { uploadTopics } from "@/actions/course/upload-topics";
import { uploadLevels } from "@/actions/course/upload-levels";
const levelFormSchema = z.object({
  name: z.string().optional(),
  order: z.number(),
  imageLink: z.string().optional(),
  description: z.string().optional(),
  live: z.boolean().optional(),
});

const initializeFormValues = (level: RelatedLevel) => {
  return {
    order: level.order,
  };
};

type LevelFormValues = z.infer<typeof levelFormSchema>;

const LevelEditForm = ({ level }: { level: RelatedLevel }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const { data: session } = useSession();
  const editCourseModal = useCourseEditModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelFormSchema),
    defaultValues: initializeFormValues(level),
  });
  const [showLoader, setShowLoader] = React.useState(false);

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: uploadLevels,
  });

  const onSubmit = async (data: LevelFormValues) => {
    loadingModal.onOpen();

    const content = {
      levels: [
        {
          level_id: level.level_id,
          topic_id: level.topic_id,
          order: data.order ? data.order : level.order,
          name: data.name ? data.name : level.name,
          ImageLink: data.imageLink ? data.imageLink : level.ImageLink,
          level_tip: data.description ? data.description : level.level_tip,
          live: data.live ? "yes" : "no",
        },
      ],
      action: "update",
    };
    updateCourse(content, {
      onError: (error) => {
        loadingModal.onClose();
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast.error("Something went wrong. Please try again later.");
          }
        }
      },
      onSuccess: () => {
        updateCourseStore(`level_id`, level.level_id, {
          name: data.name,
          topic_tip: data.description,
          live: data.live,
        });
        editCourseModal.onClose();
        loadingModal.onClose();
        queryClient.invalidateQueries({
          queryKey: ["course", { courseId }],
        });
      },
    });
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level Name</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:!ring-transparent"
                    defaultValue={level.name}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level Tip</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    defaultValue={level.level_tip}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Link</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:!ring-transparent"
                    defaultValue={level.ImageLink}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      form.setValue("order", parseInt(e.target.value));
                    }}
                    min={1}
                  />
                </FormControl>
                <FormDescription>
                  The order of the level in the topic.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="live"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between w-52 rounded-lg border p-2">
                <div className="">
                  <FormLabel className="text-base">Live</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    defaultChecked={level.live === "yes" ? true : false}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-5">
            <Button disabled={isPending} type="submit">
              Update
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log("Clicke here");
                editCourseModal.onClose();
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

export default LevelEditForm;
