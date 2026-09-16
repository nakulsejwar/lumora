"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcw, RotateCcw } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getQueueData } from "@/actions/queue/get-queue-data";
import { generateCoursesQueue } from "@/actions/generate-courses-queue";
import { toast } from "sonner";

export default function QueueComponent() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // -----------------------------------------
  // 🔥 React Query – Fetch Queue Items
  // -----------------------------------------
  const {
    data: queueResponse,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["queue", { user: session?.user?.email }],
    queryFn: async () => {
      const queue = await getQueueData(session?.user?.email!);
      if (queue.error) throw new Error((queue.error as Error).message);
      return queue.success;
    },
  });

  // -----------------------------------------
  // 🔥 Normalize Queue Data into an array
  // -----------------------------------------
  const queueList = Array.isArray(queueResponse)
    ? queueResponse
    : Array.isArray(queueResponse?.queue)
    ? queueResponse.queue
    : [];

  // -----------------------------------------
  // 🔥 Pagination Hooks (Always at top level)
  // -----------------------------------------
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(queueList.length / itemsPerPage);

  const paginatedQueue = useMemo(() => {
    const reversed = [...queueList].reverse();
    const start = (page - 1) * itemsPerPage;
    return reversed.slice(start, start + itemsPerPage);
  }, [queueList, page]);

  // -----------------------------------------
  // 🔥 Retry queue item
  // -----------------------------------------
  const handleRetryQueue = async (topic: string) => {
    await generateCoursesQueue({
      topics: [{ topic, modules: 2 }],
      email: session?.user?.email,
    });
  };

  // -----------------------------------------
  // 🔥 Refresh Queue
  // -----------------------------------------
  const handleRefreshQueue = async () => {
    toast.loading("Refreshing...");
    await queryClient.invalidateQueries({
      queryKey: ["queue", { user: session?.user?.email }],
    });
    toast.success("Refreshed");
    toast.dismiss();
  };

  // -----------------------------------------
  // 🔥 Combined Loading State
  // -----------------------------------------
  const isQueueLoading = isLoading || !queueResponse || error;

  // -----------------------------------------
  // 🔥 Component UI
  // -----------------------------------------
  return (
    <div className="px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl py-5">Queue</h1>
        <Button variant="outline" onClick={handleRefreshQueue}>
          <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isQueueLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Queue Items */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 mx-auto gap-6">
            {paginatedQueue.length > 0 ? (
              paginatedQueue.map((queue: any) => (
                <Card className="max-w-xs border-blue-200" key={queue.topic}>
                  <CardHeader className="pb-3">
                    <CardTitle>
                      <div className="flex items-center justify-between">
                        <span>{queue.topic}</span>

                        <button onClick={() => handleRetryQueue(queue.topic)}>
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </CardTitle>

                    <CardDescription>{queue.status}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center">
                <p>No items in queue</p>
                <Link
                  href={`/`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Create Course
                </Link>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {queueList.length > itemsPerPage && (
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
        </>
      )}
    </div>
  );
}
