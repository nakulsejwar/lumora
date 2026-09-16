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
import { useRouter } from "next/navigation";

import LoadingQuestions from "../LoadingQuestions";
import { toast } from "sonner";
import { courseCreationSchema } from "@/schemas/course";
import { CourseType } from "@/types/course";
import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import useCourseStore from "@/hooks/use-course-store";
import generateGames from "@/actions/generate-games";
import { uploadCourse } from "@/actions/course/upload-course";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useLoadingModal } from "@/hooks/use-loading-modal";

const courseFormSchema = z.object({
  name: z.string().optional(),
  imageLink: z.string().optional(),
  description: z.string().optional(),
  live: z.boolean().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const CourseEditForm = ({ course }: { course: CourseType }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const editCourseModal = useCourseEditModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
  });
  // ADD — local image replace + preview
  const [newImage, setNewImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string>(course.ImageLink);

  const [showLoader, setShowLoader] = React.useState(false);

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: uploadCourse,
  });
  // Upload image file to Cloudinary via central backend API route
  async function uploadImageToCloudinary(file: File, key: string) {
    const form = new FormData();
    form.append("file", file);
    form.append("key", key);

    const res = await fetch("/api/upload-image", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || "Cloudinary Upload failed");
    }
    return data.url as string;
  }

  // REPLACE — upload new image if chosen, then save
  const onSubmit = async (data: CourseFormValues) => {
    loadingModal.onOpen();
    try {
      // Start with existing image
      let finalImageLink = course.ImageLink;

      // If user picked a new image, upload to Cloudinary first
      if (newImage) {
        const cleanName = `${course.courseid}-${Date.now()}.png`;
        const key = `course/${cleanName}`;
        finalImageLink = await uploadImageToCloudinary(newImage, key);
        // keep preview in sync (already set on change)
        setPreview(finalImageLink);
      }

      const content = {
        courseid: course.courseid,
        order: `${course.order}`,
        name: data.name ? data.name : course.name,
        ImageLink: data.imageLink ? data.imageLink : finalImageLink, // ensures new URL goes to DB
        course_tip: data.description ? data.description : course.course_tip,
        live: data.live ? "yes" : "no",
        email: session?.user?.email!,
        action: "update",
      };

      updateCourse(content, {
        onSuccess: () => {
          // reflect changes into your store
          useCourseStore.getState().updateCourse(`courseid`, course.courseid, {
            name: data.name,
            ImageLink: content.ImageLink,
            course_tip: data.description,
            live: data.live,
          });

          loadingModal.onClose();
          editCourseModal.onClose();
          queryClient.invalidateQueries({
            queryKey: ["course", { courseId: course.courseid }],
          });
        },
        onError: () => {
          loadingModal.onClose();
          toast.error("Something went wrong. Please try again later.");
        },
      });
    } catch (err) {
      loadingModal.onClose();
      toast.error("Upload failed.");
    }
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
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:!ring-transparent"
                    defaultValue={course.name}
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
                <FormLabel>Course Tip</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    defaultValue={course.course_tip}
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
                <FormLabel>Course Image</FormLabel>

                {/* Preview current/new image */}
                {preview ? (
                  <img
                    src={preview}
                    alt="Course image"
                    className="w-40 h-40 object-cover rounded border mb-3"
                  />
                ) : null}

                {/* File picker to replace */}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewImage(file);
                    setPreview(file ? URL.createObjectURL(file) : course.ImageLink);
                  }}
                />

                {/* Keep a hidden field bound to form so submit carries current preview URL */}
                <input type="hidden" {...field} value={preview ?? ""} />

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
                    defaultChecked={course.live === "yes" ? true : false}
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

export default CourseEditForm;
