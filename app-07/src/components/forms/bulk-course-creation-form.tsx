"use client";
import React from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { generateCoursesQueue } from "@/actions/generate-courses-queue";
import { useSession } from "next-auth/react";
import { Trash } from "lucide-react";

const bulkCourseFormSchema = z.object({
  topics: z.array(courseCreationSchema).optional(),
});

type FormValues = z.infer<typeof bulkCourseFormSchema>;

const defaultValues: Partial<FormValues> = {
  topics: [{ topic: "", modules: 0 }],
};

const BulkCourseCreationForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showLoader, setShowLoader] = React.useState(false);
  const createCourse = useDraftStore((state) => state.createCourse);

  const createChat = useChatSession((state) => state.createChat);
  const { mutate: generateBulkCourses, isPending } = useMutation({
    mutationFn: generateCoursesQueue,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(bulkCourseFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "topics",
    control: form.control,
  });

  const onSubmit = async (data: FormValues) => {
    toast.loading("creating courses..");
    const content = {
      topics: data.topics,
      email: session?.user?.email,
    };

    generateBulkCourses(content, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast.error("Something went wrong. Please try again later.");
          }
        }
      },
      onSuccess: (data) => {
        // createChat([
        //   {
        //     userPrompt: data?.prompt!,
        //     modelResponse: data?.courseData?.body!,
        //   },
        // ]);

        // createCourse(JSON.parse(data?.courseData?.body!));

        router.push("/my-courses");
      },
    });
  };

  if (showLoader) {
    return <LoadingQuestions />;
  }

  return (
    <div className=" w-full flex items-center  max-w-2xl lg:max-w-5xl mx-auto p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id}>
              <FormField
                control={form.control}
                name={`topics.${index}.topic`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex w-full items-center justify-between">
                        <span>Topic</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="weight loss." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`topics.${index}.modules`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Modules</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many modules?"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue(
                            `topics.${index}.modules`,
                            parseInt(e.target.value)
                          );
                        }}
                        min={1}
                        max={10}
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many modules you would like to have in
                      your course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <div className="flex items-center  gap-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ topic: "", modules: 1 })}
            >
              Add Topic
            </Button>

            <Button
              variant="default"
              size="sm"
              disabled={isPending}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BulkCourseCreationForm;
