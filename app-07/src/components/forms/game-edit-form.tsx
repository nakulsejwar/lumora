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
import {
  CourseType,
  RelatedGame,
  RelatedLevel,
  RelatedTopic,
} from "@/types/course";
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
import { uploadGames } from "@/actions/course/upload-games";
const gameFormSchema = z.object({
  name: z.string().optional(),
  order: z.number(),
  imageLink: z.string().optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
  live: z.boolean().optional(),
  passageText: z.string().optional(),
  gradeBand: z.string().optional(),
  difficulty: z.string().optional(),
  targetSkill: z.string().optional(),
});

type GameFormValues = z.infer<typeof gameFormSchema>;
const initializeFormValues = (game: RelatedGame) => {
  return {
    order: game.order,
  };
};

const GameEditForm = ({ game }: { game: RelatedGame }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const editCourseModal = useCourseEditModal();
  const loadingModal = useLoadingModal();
  const updateCourseStore = useCourseStore((state) => state.updateCourse);
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: initializeFormValues(game),
  });

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: uploadGames,
  });

  const onSubmit = async (data: GameFormValues) => {
    loadingModal.onOpen();

    const content = {
      games: [
        {
          level_id: game.level_id,
          gameid: game.gameid,
          order: data.order ? data.order : game.order,
          name: data.name ? data.name : game.name,
          ImageLink: data.imageLink ? data.imageLink : game.ImageLink,
          gameTip: data.description ? data.description : game.gameTip,
          in_gameTip: game.in_gameTip,
          live: data.live ? "yes" : "no",
          passage_text:
            data.passageText !== undefined
              ? data.passageText
              : game.passage_text,
          grade_band:
            data.gradeBand !== undefined ? data.gradeBand : game.grade_band,
          difficulty:
            data.difficulty !== undefined ? data.difficulty : game.difficulty,
          target_skill:
            data.targetSkill !== undefined
              ? data.targetSkill
              : game.target_skill,
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
        updateCourseStore(`gameid`, game.gameid, {
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
                <FormLabel>Game Name</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:!ring-transparent"
                    defaultValue={game.name}
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
                <FormLabel>Game Tip</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full  font-medium  focus:!ring-transparent ",
                      " focus:!ring-transparent"
                    )}
                    defaultValue={game.gameTip}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passageText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading Passage</FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "w-full font-medium focus:!ring-transparent",
                      "focus:!ring-transparent"
                    )}
                    rows={6}
                    placeholder="The full story text the learner reads before answering..."
                    defaultValue={game.passage_text ?? ""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Shown on the passage screen before the questions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="gradeBand"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Grade Band</FormLabel>
                  <FormControl>
                    <Input
                      className="focus:!ring-transparent"
                      placeholder="3, 5, or 7"
                      defaultValue={game.grade_band ?? ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Input
                      className="focus:!ring-transparent"
                      placeholder="explicit, simple_inference..."
                      defaultValue={game.difficulty ?? ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="targetSkill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Skill (adaptive lessons only)</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-transparent"
                    placeholder="main-idea, vocabulary, inference, cause-effect, sequence, or evidence"
                    defaultValue={game.target_skill ?? ""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Leave blank for a standard (non-adaptive) lesson.
                </FormDescription>
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
                    defaultValue={game.ImageLink}
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
                    defaultChecked={game.live === "yes" ? true : false}
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

export default GameEditForm;
