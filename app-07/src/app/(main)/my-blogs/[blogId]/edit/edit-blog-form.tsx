"use client";

import React, { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { getImage } from "@/actions/pexels/get-images";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Loader2, SearchIcon } from "lucide-react";
import generateQuiz from "@/actions/blog/generate-quiz";
import { GenerateQuestionsAlertDialog } from "@/app/(main)/my-blogs/[blogId]/generate-questions-alert";
import { RelatedTile } from "@/types/course";
import { useBlogQuestionModal } from "@/hooks/use-edit-blog-question-modal";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { BlogQuizKanban } from "@/components/blog/blog-questions-kanban";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlogQuestionModal } from "@/components/modals/blog-question-modal";
import { Switch } from "@/components/ui/switch";
import { BlogUpdatePayload, updateBlog } from "@/actions/blog/update-blog";

const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "title must be at least 3 characters.",
    })
    .max(100, {
      message: "title must not be longer than 30 characters.",
    }),
  content: z
    .string({ message: "Content is required." })
    .max(10000, {
      message: "Content must not be longer than 10000 characters.",
    })
    .min(1000, { message: "Content must be at least 1000 characters." }),
  isLive: z.boolean().default(false),
  imgUrl: z.string({ required_error: "Please select an image." }),
  courseId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const initializeFormValues = (blog: any) => {
  return {
    title: blog.title,
    content: blog.content,
    isLive: blog.isLive,
    imgUrl: blog.ImgUrl,
    courseId: blog.metadata.courseId,
  };
};

export function EditBlogForm({ blog }: { blog: any }) {
  const router = useRouter();
  const { data: session } = useSession();
  const loadingModal = useLoadingModal();
  const addQuestionModal = useBlogQuestionModal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initializeFormValues(blog),
  });

  const [searchImg, setSearchImage] = useState<boolean>(false);
  const [searchImgKey, setSearchImgKey] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState<RelatedTile[]>(
    blog.quiz.questions
  );
  const [quizQuestionsError, setQuizQuestionsError] = useState<boolean>(false);
  const [quizLength, setQuizLength] = useState<number>(0);

  const {
    data: images,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`blog-images-${searchImgKey}`],
    queryFn: async () => {
      const { success, error } = await getImage(searchImgKey);
      setSearchImage(false);
      if (error) throw new Error(error.message);
      if (success) return success;
    },
    enabled: searchImg,
  });

  async function generateQuestions() {
    loadingModal.onOpen();
    toast.loading("Generating questions...");
    const { success, error } = await generateQuiz(
      form.getValues("content"),
      quizLength
    );
    if (error) {
      console.log(error);
      loadingModal.onClose();
      return toast.error("something went wrong!");
    }

    if (success.length === 0) {
      toast.error("Something went wrong!", {
        description: "Please try again.",
      });
      toast.dismiss();
      loadingModal.onClose();
      return;
    }

    setQuizQuestions(success);
    toast.success("Questions generated successfully!");
    toast.dismiss();
    loadingModal.onClose();
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    loadingModal.onOpen();
    const content: BlogUpdatePayload = {
      blog_id: blog.blog_id,
      email: session?.user?.email!,
      updates: {
        title: data.title,
        content: data.content,
        islive: data.isLive,
        quiz: { questions: quizQuestions },
        metadata: {
          courseId: data.courseId,
        },
        ImgUrl: data.imgUrl ? data.imgUrl : blog.ImgUrl,
      },
    };
    const { success, error } = await updateBlog(content);

    if (error) {
      loadingModal.onClose();
      return toast.error("Oops!", {
        description: error.message,
      });
    }
    loadingModal.onClose();
    toast.success("Blog updated successfully!");
    router.push(`/my-blogs/${blog.blog_id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input defaultValue={""} placeholder="title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Content</FormLabel>
              <FormDescription>Add your blog content here</FormDescription>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div>
            <p className="text-sm font-semibold pt-3">Quiz Questions</p>
            <p className="text-muted-foreground text-sm">
              Add questions to your blog.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <div>
              <GenerateQuestionsAlertDialog
                setQuizLength={setQuizLength}
                handleAlertClose={generateQuestions}
                content={form.getValues("content")}
                title={quizQuestions.length > 0 ? "Re-generate" : "Generate"}
              />
            </div>
            <span>or</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                addQuestionModal.onOpen("add-question", "question")
              }
            >
              Add {quizQuestions ? "More" : "Custom"} Questions
            </Button>
          </div>
        </div>
        {quizQuestionsError && (
          <p className="text-xs text-red-500">
            Please add blog content to generate questions. Content should be
            more than 1000 characters.
          </p>
        )}

        <div>
          {quizQuestions && quizQuestions.length > 0 && (
            <BlogQuizKanban
              quizTiles={quizQuestions}
              setQuizTiles={setQuizQuestions}
              topic={blog.title}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="imgUrl"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Image</FormLabel>
              <FormDescription> Find an image for you blog.</FormDescription>
              <FormMessage />
              <div className="flex items-center gap-5">
                <Input
                  className=""
                  placeholder="search here.."
                  defaultValue=""
                  value={searchImgKey}
                  onChange={(e) => setSearchImgKey(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (searchImg) {
                      refetch();
                    } else {
                      setSearchImage(true);
                    }
                  }}
                >
                  <SearchIcon className="w-5 h-5" />
                </Button>
              </div>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 max-w-xl md:grid-cols-4 gap-5 pt-2"
              >
                {images ? (
                  images?.photos?.map((item: any, idx: number) => (
                    <FormItem key={idx}>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem
                            value={item.src.original}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                          <div className="space-y-2 rounded-sm bg-[#ecedef] cursor-pointer">
                            <Image
                              src={item.src.small}
                              alt={item.alt}
                              width={100}
                              height={100}
                              className="rounded-sm w-full h-full"
                            />
                          </div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))
                ) : (
                  <div className="flex col-span-2 md:col-span-4 items-center w-full p-1">
                    <Image
                      src={field.value}
                      alt=""
                      width={100}
                      height={100}
                      className="rounded-sm w-full max-w-fit h-full"
                    />
                  </div>
                )}
              </RadioGroup>
            </FormItem>
          )}
        />

        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching relevant images..
          </div>
        )}

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Course</FormLabel>
              <FormControl>
                <Input defaultValue={""} placeholder="courseid" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isLive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between w-40 py-3">
              <div className="">
                <FormLabel className="">Live</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" size="sm">
          Save Changes
        </Button>
      </form>

      <BlogQuestionModal
        quizQuestions={quizQuestions}
        setQuizQuestions={setQuizQuestions}
      />
    </Form>
  );
}
