"use client";

import { deleteCourseData } from "@/actions/course/delete-course";

import { useCourseEditModal } from "@/hooks/use-edit-course-modal";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import { RelatedTile } from "@/types/course";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDot, Copy, Edit, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface CellActionProps {
  data: RelatedTile;
}

export const TileActionButton: React.FC<CellActionProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const { courseId } = useParams<{ courseId: string }>();
  const loadingModal = useLoadingModal();
  const editCourseModal = useCourseEditModal();

  const handleDelete = async () => {
    loadingModal.onOpen();
    await deleteCourseData(data.tileid, "tile");
    await queryClient.invalidateQueries({
      queryKey: ["course", { courseId }],
    });

    loadingModal.onClose();
  };

  const handleCopy = () => {
    const tileData = {
      tileid: "",
      gameid: "",
      qno: 1,
      type: data.type,
      question: data.question,
      questionTip: data.questionTip,
      correct: data.correctOption.toString(),
      op1: data.options[0].option,
      op1Link: data.options[0].image,
      op2: data.options[1].option,
      op2Link: data.options[1].image,
      op3: data.options[2].option,
      op3Link: data.options[2].image,
      op4: data.options[3].option,
      op4Link: data.options[3].image,
      op5: data.options[4].option,
      op5Link: data.options[4].image,
      op6: data.options[5].option,
      op6Link: data.options[5].image,
      op7: data.options[6].option,
      op7Link: data.options[6].image,
      op8: data.options[7].option,
      op8Link: data.options[7].image,
      reason: data.reason,
      live: "yes",
    };

    navigator.clipboard.writeText(data.tileid).then(
      function () {
        /* clipboard successfully set */
        toast.success("Copied tile id to clipboard");
      },
      function () {
        /* clipboard write failed */
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        title="Edit"
        className="shadow-md rounded-sm p-1 md:p-1.5"
        onClick={() => editCourseModal.onOpen("tile", data)}
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        type="button"
        title="Copy"
        className="shadow-md rounded-sm p-1 md:p-1.5"
        onClick={handleCopy}
      >
        <Copy className="w-4 h-4 " />
      </button>

      <button
        type="button"
        title="Delete"
        className="shadow-md rounded-sm p-1 md:p-1.5"
        onClick={handleDelete}
      >
        <Trash className="w-4 h-4 " />
      </button>
    </div>
  );
};
