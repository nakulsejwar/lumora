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
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import LoadingQuestions from "../LoadingQuestions";
import { toast } from "sonner";
import useChatSession from "@/hooks/use-chat-session";
import useDraftStore from "@/hooks/use-draft-store";
import { Textarea } from "../ui/textarea";
import generateCourseFromText from "@/actions/generate-course-from-text";

const courseFormSchema = z.object({
  text: z
    .string()
    .min(100, {
      message: "Topic must be at least 100 characters long",
    })
    .max(10000, {
      message: "Topic must be at most 10000 characters long",
    }),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;
const CreateCourseFromTextForm = ({ path }: { path?: string }) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const createCourse = useDraftStore((state) => state.createCourse);

  const createChat = useChatSession((state) => state.createChat);
  const { mutate: getCourse, isPending } = useMutation({
    mutationFn: generateCourseFromText,
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
  });

  const onSubmit = async (data: CourseFormValues) => {
    setShowLoader(true);
    getCourse(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast.error("Something went wrong. Please try again later.");
          }
        }
      },
      onSuccess: (data) => {
        createChat([
          {
            userPrompt: data?.prompt!,
            modelResponse: data?.courseData?.body!,
          },
        ]);

        createCourse(JSON.parse(data?.courseData?.body!));

        router.push(`${path ? path : "/course"}`);
        setShowLoader(false);
      },
    });
  };

  if (showLoader) {
    return <LoadingQuestions />;
  }

  return (
    <div className=" w-full  max-w-xl lg:max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Textarea placeholder="weight loss." {...field} />
                </FormControl>
                <FormDescription>
                  Please provide any relevant information on the course you
                  would like to create.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseFromTextForm;
