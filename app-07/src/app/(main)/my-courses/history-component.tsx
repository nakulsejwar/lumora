"use client";
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDraftStore from "@/hooks/use-draft-store";
import { MoveRight, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import useChatSession from "@/hooks/use-chat-session";
import { deleteHistory } from "@/actions/history/delete-history";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHistory } from "@/actions/history/get-history";
import { toast } from "sonner";
function HistoryComponent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: historyData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["drafts", { user: session?.user?.email }],
    queryFn: async () => {
      const history = await getHistory(session?.user?.email!);

      if (history.error) throw new Error((history.error as Error).message);
      if (history.success) return history.success;
    },
  });
  const createCourse = useDraftStore((state) => state.createCourse);
  const createChat = useChatSession((state) => state.createChat);

  const handleDeleteHistory = async (uid: string) => {
    toast.loading("deleting..");
    await deleteHistory(uid);

    await queryClient.invalidateQueries({
      queryKey: ["drafts", { user: session?.user?.email }],
    });
    toast.success("deleted successfully");
    toast.dismiss();
  };

  // -------------------------------------
  // 🔥 PAGINATION
  // -------------------------------------
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // change if needed

  const historyList = historyData?.history || [];
  const totalPages = Math.ceil(historyList.length / itemsPerPage);

  const paginatedHistory = useMemo(() => {
    const reversed = [...historyList].reverse();
    const start = (page - 1) * itemsPerPage;
    return reversed.slice(start, start + itemsPerPage);
  }, [historyList, page]);

  return (
    <div className="px-10">
      <h1 className="text-xl py-5">Your Drafts</h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 mx-auto gap-6">
        {paginatedHistory.map((history: any) => (
          <Card className="max-w-xs border-yellow-200" key={history.uid}>
            <CardHeader className="!pb-2">
              <CardTitle>
                <div className="flex items-center justify-between">
                  <button
                    className="text-left"
                    onClick={() => {
                      createCourse(history.data.courseDetails);

                      createChat(history.data.chat!);

                      router.push(`/drafts?uid=${history.uid}`);
                    }}
                  >
                    {history.data.courseDetails.course_name}
                  </button>

                  <button onClick={() => handleDeleteHistory(history.uid)}>
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </CardTitle>
              <CardDescription>
                <p className="text-xs text-muted-foreground">
                  {dayjs(history.created_at).format("ddd, MMM D h:mm A")}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="!pb-2">
              <p className="text-xs line-clamp-2">
                {history.data.courseDetails.course_description}
              </p>
            </CardContent>
            <CardFooter className="!p-0 group !m-0">
              <Button
                variant="link"
                className="flex items-center justify-between w-full"
                onClick={() => {
                  createCourse(history.data.courseDetails);

                  createChat(history.data.chat!);

                  router.push(`/drafts?uid=${history.uid}`);
                }}
              >
                <span className="text-xs">Go to draft</span>
                <MoveRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* -------------------------------------
            🔥 PAGINATION CONTROLS
        ------------------------------------- */}
      {historyList.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-4 my-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default HistoryComponent;
