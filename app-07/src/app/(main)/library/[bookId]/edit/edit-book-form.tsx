"use client";

import React, { useEffect, useState } from "react";
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
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { useSession } from "next-auth/react";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getImage } from "@/actions/pexels/get-images";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Loader2, SearchIcon, Upload, Image as ImageIcon } from "lucide-react";
import generateQuiz from "@/actions/library/generate-quiz";
import { GenerateQuestionsAlertDialog } from "@/app/(main)/my-blogs/[blogId]/generate-questions-alert";
import { RelatedTile } from "@/types/course";
import { BlogQuizKanban } from "@/components/blog/blog-questions-kanban";
import { BlogQuestionModal } from "@/components/modals/blog-question-modal";
import { useBlogQuestionModal } from "@/hooks/use-edit-blog-question-modal";
import { BookUpdatePayload, updateBook } from "@/actions/library/update-book";
import { GENRES } from "@/components/forms/create-book-form";

const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  category: z.string().min(1, { message: "Please select a genre." }),
  content: z
    .string({ message: "Content is required." })
    .max(10000, {
      message: "Content must not be longer than 10000 characters.",
    })
    .min(100, { message: "Content must be at least 100 characters." }),
  isLive: z.boolean().default(false),
  imgUrl: z.string({ required_error: "Please select a cover image." }),
  courseId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const initializeFormValues = (book: any) => {
  return {
    title: book.title || "",
    category: book.category || "Mystery",
    content: book.content || "",
    isLive: book.isLive || book.islive || false,
    imgUrl: book.ImgUrl || "",
    courseId: book.metadata?.courseId || "",
  };
};

export function EditBookForm({ book }: { book: any }) {
  const router = useRouter();
  const { data: session } = useSession();
  const loadingModal = useLoadingModal();
  const addQuestionModal = useBlogQuestionModal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initializeFormValues(book),
  });

  const [searchImg, setSearchImage] = useState<boolean>(false);
  const [searchImgKey, setSearchImgKey] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState<RelatedTile[]>(
    book?.quiz?.questions || []
  );
  const [quizLength, setQuizLength] = useState<number>(0);

  // Custom Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const id = book?.book_id || book?.blog_id;

  const {
    data: images,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`book-images-${searchImgKey}`],
    queryFn: async () => {
      const { success, error } = await getImage(searchImgKey);
      setSearchImage(false);
      if (error) throw new Error(error.message);
      if (success) return success;
    },
    enabled: searchImg,
  });

  async function uploadImageToCloudinary(file: File): Promise<string> {
    const cleanName = `book-${Date.now()}.png`;
    const key = `books/${cleanName}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);

    const res = await fetch("/api/upload-image", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || "Image upload failed");
    }
    return data.url as string;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);
    toast.loading("Uploading cover image to Cloudinary...", { id: "img-upload" });

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      form.setValue("imgUrl", uploadedUrl, { shouldValidate: true });
      toast.success("Cover image uploaded successfully!", { id: "img-upload" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image", { id: "img-upload" });
    } finally {
      setUploadingImage(false);
    }
  };

  async function generateQuestions() {
    loadingModal.onOpen();
    toast.loading("Generating questions...");
    const { success, error } = await generateQuiz(
      form.getValues("content"),
      quizLength
    );
    if (error) {
      loadingModal.onClose();
      return toast.error("Something went wrong generating questions!");
    }

    if (!success || success.length === 0) {
      toast.error("Could not generate questions from content", {
        description: "Please check your content length.",
      });
      loadingModal.onClose();
      return;
    }

    setQuizQuestions(success);
    toast.success("Questions generated successfully!");
    loadingModal.onClose();
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    loadingModal.onOpen();
    try {
      let finalImgUrl = data.imgUrl;

      if (imageFile && !finalImgUrl) {
        finalImgUrl = await uploadImageToCloudinary(imageFile);
      }

      const payload: BookUpdatePayload = {
        book_id: id,
        blog_id: id,
        email: session?.user?.email!,
        updates: {
          title: data.title,
          category: data.category,
          content: data.content,
          islive: data.isLive,
          quiz: { questions: quizQuestions },
          metadata: {
            courseId: data.courseId,
          },
          ImgUrl: finalImgUrl ? finalImgUrl : book.ImgUrl,
        },
      };

      const { error } = await updateBook(payload);

      if (error) {
        loadingModal.onClose();
        return toast.error("Oops!", {
          description: error.message,
        });
      }
      loadingModal.onClose();
      toast.success("Book updated successfully!");
      router.push(`/library/${id}`);
    } catch (err: any) {
      loadingModal.onClose();
      toast.error(err.message || "Failed to update book");
    }
  }

  const currentCoverUrl = form.watch("imgUrl");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[#070235]">Book Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[#070235]">Genre</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    >
                      {GENRES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-[#070235]">Book Passage / Story Content</FormLabel>
              <FormDescription>Write and format your reading material here.</FormDescription>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* COVER IMAGE UPLOAD & SEARCH SECTION */}
        <FormField
          control={form.control}
          name="imgUrl"
          render={({ field }) => (
            <FormItem className="space-y-3 bg-[#faf8ff] p-5 rounded-2xl border border-[#c8c5d0]/60">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-bold text-[#070235] text-base flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#fe932c]" />
                    Book Cover Image
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Upload an image file from your computer OR search stock images online.
                  </FormDescription>
                </div>
              </div>

              {/* CURRENT COVER PREVIEW */}
              {currentCoverUrl && (
                <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-[#c8c5d0]/60 max-w-md">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <Image src={currentCoverUrl} alt="Cover Preview" fill className="object-cover" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#070235]">Active Cover Image</p>
                    <p className="text-[#47464f] truncate max-w-[200px] mt-0.5">{currentCoverUrl}</p>
                    <button
                      type="button"
                      onClick={() => form.setValue("imgUrl", "", { shouldValidate: true })}
                      className="text-red-500 font-bold hover:underline mt-1 block"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <FormMessage />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* METHOD 1: UPLOAD LOCAL IMAGE FILE */}
                <div className="p-4 bg-white rounded-xl border border-[#c8c5d0]/70 flex flex-col justify-center">
                  <label className="text-xs font-bold text-[#070235] mb-2 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4 text-[#fe932c]" />
                    <span>Upload Image File (Cloudinary)</span>
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="text-xs cursor-pointer"
                  />
                  {uploadingImage && (
                    <p className="text-[11px] text-[#904d00] font-bold mt-2 flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading image...
                    </p>
                  )}
                </div>

                {/* METHOD 2: SEARCH ONLINE STOCK IMAGES */}
                <div className="p-4 bg-white rounded-xl border border-[#c8c5d0]/70 flex flex-col justify-center">
                  <label className="text-xs font-bold text-[#070235] mb-2 flex items-center gap-1.5">
                    <SearchIcon className="w-4 h-4 text-[#0091cf]" />
                    <span>Search Stock Photos</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g. mystery, sci-fi, nature..."
                      value={searchImgKey}
                      onChange={(e) => setSearchImgKey(e.target.value)}
                      className="text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (searchImg) {
                          refetch();
                        } else {
                          setSearchImage(true);
                        }
                      }}
                    >
                      <SearchIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* SEARCH RESULTS GRID */}
              {images && (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3"
                >
                  {images?.photos?.map((item: any, idx: number) => (
                    <FormItem key={idx}>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-[#fe932c]">
                        <FormControl>
                          <RadioGroupItem value={item.src.original} className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-xl border-2 border-muted p-1 hover:border-[#fe932c] cursor-pointer">
                          <div className="relative w-full h-24 rounded-lg bg-slate-100 overflow-hidden">
                            <Image
                              src={item.src.small}
                              alt={item.alt || "Stock Image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#47464f] pt-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#fe932c]" />
                  Searching stock images...
                </div>
              )}
            </FormItem>
          )}
        />

        {/* QUIZ GENERATION SECTION */}
        <div>
          <div>
            <p className="text-sm font-bold text-[#070235]">Story Quiz & Comprehension Questions</p>
            <p className="text-xs text-[#47464f]">
              Generate or manually edit interactive questions for this book.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-3">
            <GenerateQuestionsAlertDialog
              setQuizLength={setQuizLength}
              handleAlertClose={generateQuestions}
              content={form.getValues("content")}
              title={quizQuestions.length > 0 ? "Re-generate Questions" : "AI Generate Questions"}
            />
            <span className="text-xs text-[#47464f]">or</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addQuestionModal.onOpen("add-question", "question")}
            >
              Add Custom Question
            </Button>
          </div>
        </div>

        {quizQuestions && quizQuestions.length > 0 && (
          <BlogQuizKanban
            quizTiles={quizQuestions}
            setQuizTiles={setQuizQuestions}
            topic={book.title}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-[#070235]">Related Course ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. The247502" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isLive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-3 rounded-xl border border-[#c8c5d0]/60 bg-[#faf8ff]">
                <div>
                  <FormLabel className="font-bold text-[#070235]">Publish / Live</FormLabel>
                  <FormDescription className="text-xs">Visible to learners in Lumora Library</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="bg-[#070235] text-white font-bold w-full sm:w-auto">
          Save Book Changes
        </Button>
      </form>

      <BlogQuestionModal quizQuestions={quizQuestions} setQuizQuestions={setQuizQuestions} />
    </Form>
  );
}
