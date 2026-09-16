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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import LoadingQuestions from "../LoadingQuestions";
import { toast } from "sonner";
import { courseCreationSchema } from "@/schemas/course";
import useChatSession from "@/hooks/use-chat-session";
import generateCourse from "@/actions/generate-course";
import useDraftStore from "@/hooks/use-draft-store";
type Props = {
  topic: string;
};

type Input = z.infer<typeof courseCreationSchema>;

const CourseCreationForm = ({ path }: { path?: string }) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const createCourse = useDraftStore((state) => state.createCourse);

  const createChat = useChatSession((state) => state.createChat);
  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: generateCourse,
  });

  const form = useForm<Input>({
    resolver: zodResolver(courseCreationSchema),
  });

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        console.log(error);

        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast.error("Something went wrong. Please try again later.");
          }
        }
      },
      onSuccess: (data) => {
        if (data.error) {
          setShowLoader(false);
          return toast.error("Something went wrong. Please try again later.");
        }
        createChat([
          {
            userPrompt: data?.prompt!,
            modelResponse: JSON.stringify(data?.courseData),
          },
        ]);

        createCourse(data?.courseData);

        router.push(`${path ? path : "/course"}`);
        setShowLoader(false);
      },
    });
  };

  if (showLoader) {
    return <LoadingQuestions />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#070235]">
                  Course Topic
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Mystery of the Lost Pyramid, Solar System Exploration"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-[#47464f]">
                  Provide the core topic or story theme for your new reading course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modules"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-mono font-bold uppercase tracking-wider text-[#070235]">
                  Number of Modules
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="How many modules? (1-10)"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      form.setValue("modules", parseInt(e.target.value));
                    }}
                    min={1}
                    max={10}
                  />
                </FormControl>
                <FormDescription className="text-xs text-[#47464f]">
                  Choose how many structured modules to generate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#070235] hover:bg-[#1e1b4b] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-md border border-[#89ceff]/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Generate Course</span>
          </Button>
        </form>
      </Form>
    </div>
  );

};

export default CourseCreationForm;
