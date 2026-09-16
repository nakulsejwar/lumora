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
import { CourseType, RelatedTopic } from "@/types/course";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import useCourseStore from "@/hooks/use-course-store";
import generateGames from "@/actions/generate-games";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { uploadTopics } from "@/actions/course/upload-topics";
const topicFormSchema = z.object({
  name: z.string().optional(),
  order: z.number(),
  imageLink: z.string().optional(),
  description: z.string().optional(),
  live: z.boolean().optional(),
});

type TopicFormValues = z.infer<typeof topicFormSchema>;
const initializeFormValues = (topic: RelatedTopic) => {
  return {
    order: topic.order,
  };
};

const TopicEditForm = ({ topic }: { topic: RelatedTopic }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const { data: session } = useSession();
  const editCourseModal = useCourseEditModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: initializeFormValues(topic),
  });
  const [showLoader, setShowLoader] = React.useState(false);

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: uploadTopics,
  });

  const onSubmit = async (data: TopicFormValues) => {
    loadingModal.onOpen();

    const content = {
      topics: [
        {
          topic_id: topic.topic_id,
          courseid: topic.courseid,
          order: data.order ? data.order : topic.order,
          name: data.name ? data.name : topic.name,
          ImageLink: data.imageLink ? data.imageLink : topic.ImageLink,
          topic_tip: data.description ? data.description : topic.topic_tip,
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
        updateCourseStore(`topic_id`, topic.topic_id, {
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
                <FormLabel>Topic Name</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:!ring-transparent"
                    defaultValue={topic.name}
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
                <FormLabel>Topic Tip</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    defaultValue={topic.topic_tip}
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
                    defaultValue={topic.ImageLink}
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
                  The order of the topic in the course.
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
                    defaultChecked={topic.live === "yes" ? true : false}
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

export default TopicEditForm;
