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

const tileFormSchema = z.object({
  tileid: z.string(),
});

type TileFormValues = z.infer<typeof tileFormSchema>;

const CopyTileForm = ({
  data: courseData,
  toId,
}: {
  data: string;
  toId: string;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const editCourseModal = useCourseEditModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<TileFormValues>({
    resolver: zodResolver(tileFormSchema),
    mode: "onChange",
  });

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: copyCourseData,
  });

  const onSubmit = async (data: TileFormValues) => {
    loadingModal.onOpen();
    const payloadcontent = {
      data: courseData,
      copy_from: data.tileid,
      copy_to: toId,
    };

    // console.log("Create ---", content);

    updateCourse(payloadcontent, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error("Something went wrong");
        } else {
          toast.success(`Copied ${courseData} `);
        }
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
            name="tileid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add {courseData} id</FormLabel>
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
            <Button disabled={isPending} type="submit">
              Add {courseData}
            </Button>
            <Button
              type="button"
              onClick={() => {
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

export default CopyTileForm;
