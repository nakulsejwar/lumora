import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { CircleDot, Edit, GripVertical, Trash } from "lucide-react";
import { RelatedTile } from "@/types/course";
import { TileActionButton } from "@/app/(main)/course/[courseId]/_components/tile-action-button";
import { useBlogQuestionModal } from "@/hooks/use-edit-blog-question-modal";
import { useState } from "react";
import { ValidateQuestionModal } from "./validate-question";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { validateQuestion } from "@/actions/validate/validate-question";
import { isValid } from "zod";
import { toast } from "sonner";

interface TileCardProps {
  tile: RelatedTile;
  topic: string;
  handleDelete: (id: string) => void;
  isOverlay?: boolean;
  handleReplace: (tile: any) => void;
}

export type TileType = "Tile";

export interface TileDragData {
  type: TileType;
  tile: RelatedTile;
}

export function QuestionCard({
  tile,
  topic,
  handleDelete,
  isOverlay,
  handleReplace,
}: TileCardProps) {
  const editQuestionModal = useBlogQuestionModal();

  const [isValidateModalOpen, setIsValidateModalOpen] =
    useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [newTile, setNewTile] = useState<RelatedTile | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tile.tileid,
    data: {
      type: "Tile",
      tile,
    } satisfies TileDragData,
    attributes: {
      roleDescription: "Tile",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const handleValidate = async () => {
    setValidationResult(null);
    setIsValidateModalOpen(true);
    setIsValidating(true);
    // await a promise to resolve in 2 seconds
    const { success, error } = await validateQuestion(tile, topic);

    if (error) {
      toast.error("Something went wrong. Please try again later.");
      setIsValidating(false);

      setIsValidateModalOpen(false);
      return;
    }
    setNewTile(success?.tile);
    setValidationResult({
      isValid: success?.isValid,
      reason: success?.reason,
    });
    setIsValidating(false);
  };

  const handleReplaceTile = async () => {
    handleReplace({ ...newTile, tileid: tile.tileid, qno: tile.qno });
    setIsValidateModalOpen(false);
  };

  return (
    <>
      <ValidateQuestionModal
        onConfirm={handleReplaceTile}
        newTile={newTile!}
        isOpen={isValidateModalOpen}
        setIsOpen={setIsValidateModalOpen}
        confirmText="Replace"
        isPending={isValidating}
        validationResult={validationResult}
      />

      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
      >
        <CardHeader className="px-3 py-3 justify-between flex flex-row border-b-2 border-secondary relative">
          <Button
            type="button"
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move tile</span>
            <GripVertical />
          </Button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              title="validate"
              className="shadow-md rounded-sm p-1 md:p-1.5"
              onClick={handleValidate}
            >
              <CircleDot className="w-4 h-4 " />
            </button>

            <button
              type="button"
              title="edit"
              className="shadow-md rounded-sm p-1 md:p-1.5"
              onClick={() => editQuestionModal.onOpen("edit-question", tile)}
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="delete"
              className="shadow-md rounded-sm p-1 md:p-1.5"
              onClick={() => handleDelete(tile.tileid)}
            >
              <Trash className="w-4 h-4 " />
            </button>
          </div>

          {/* <Badge variant={"outline"} className="ml-auto font-semibold">
          tile
        </Badge> */}
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          <div className="grid w-full items-center ">
            <div className="flex items-center flex-1 grow justify-between">
              <p>
                <span className="text-lg">{tile.qno}.</span>
                <span> {tile.question}</span>
              </p>
            </div>
            <div className="md:pl-5">
              {tile?.options?.map((question, index) => (
                <p key={`${question.option}-${index}`}>
                  {question?.option &&
                    question?.option !== null &&
                    question?.option !== "" && (
                      <span>
                        <span className="text-xs ">{index + 1}</span>{" "}
                        {question.option}
                      </span>
                    )}
                </p>
              ))}

              {tile?.isMultiCorrect ? (
                <div className="flex items-center gap-3 italic font-medium">
                  correct answers:{" "}
                  <p className="space-x-2 divide-x-2">
                    {tile?.correctOption?.map((item, index) => (
                      <span key={`${index}-${item}`}>
                        {tile?.options[item - 1]?.option}
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <p className="italic font-medium">
                  correct answer:{" "}
                  {tile?.options[tile?.correctOption[0] - 1]?.option}
                </p>
              )}
              <p className="text-sm">Reason: {tile?.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
