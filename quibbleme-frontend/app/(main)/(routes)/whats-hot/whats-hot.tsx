"use client";
import { getEmail, getToken } from "@/lib/utils/utils.client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import DateComponent from "@/components/date-component";
import AdBanner from "@/components/google-ads-banner";
function WhatsHot() {
  const { data: blogs, isLoading: isBlogsDataLoading } = useQuery({
    queryKey: ["blogsData"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-blogs/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const moddata = data.filter(
          (item: any) => item.userEmail !== "ge.dev009@gmail.com"
        );

        return process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
          ? moddata.filter((item: any) => item.isLive).reverse()
          : moddata.reverse();
      } catch (error) {
        console.log("");
        return null;
      }
    },
  });

  const handleShare = (coursename: string, courseid: string) => {
    //copy to clipboard function with a toast messsage  "copied to clipboard"
    sendGTMEvent({
      event: "share_game",
      shareGame: ` ${coursename} course shared`,
    });
    const urlToCopy = `https://www.lumora.app/courses/${courseid}`;
    navigator.clipboard.writeText(urlToCopy).then(
      function () {
        /* clipboard successfully set */
        toast.success("Copied to clipboard");
      },
      function () {
        /* clipboard write failed */
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  if (isBlogsDataLoading) {
    return (
      <>
        <div className=" flex items-center justify-center gap-2 mt-20">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col my-10  max-w-5xl mx-auto">
      <div className="px-2 md:px-10">
        <div className="grid md:grid-cols-5   mx-auto gap-6 ">
          {blogs && blogs?.length > 0 ? (
            blogs?.slice(0, 3).map((blog: any, idx: number) => (
              <div
                key={blog.blog_id}
                className={cn(
                  "group  ",
                  idx === 0
                    ? "md:col-span-3 md:row-span-2 w-full h-full"
                    : "md:col-span-2 row-span-1 "
                )}
              >
                <Link
                  onClick={() => {
                    sendGTMEvent({
                      event: "blog_click",
                      blogId: `${blog.blog_id}`,
                      blogTitle: `${blog.title}`,
                    });
                  }}
                  href={`/whats-hot/${blog.blog_id}`}
                >
                  <div
                    className={cn(
                      "w-full",
                      idx === 0 ? "md:h-[398px]" : "md:h-[156px]"
                    )}
                  >
                    <Image
                      src={blog.ImgUrl}
                      alt={blog.title}
                      width={200}
                      height={200}
                      className={`w-full h-52 md:h-full object-cover  group-hover:opacity-80  `}
                    />
                  </div>{" "}
                  <p className="text-2xl pt-2 pb-1 group-hover:underline underline-offset-2">
                    {blog.title}
                  </p>
                  <div className="text-muted-foreground text-xs">
                    <DateComponent datetime={blog.created_at} type="relative" />
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-center">No Blogs available</p>
            </div>
          )}
        </div>

        <div className="my-2 max-w-fit md:hidden">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="9824239573"
          />
        </div>

        <div className="hidden md:block my-2 max-w-fit">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="9763927184"
            style={{ width: "1200px", height: "150px" }}
          />
        </div>

        <div className="grid md:grid-cols-2 mt-20 mx-auto gap-6 ">
          {blogs &&
            blogs?.length > 3 &&
            blogs?.slice(3).map((blog: any, idx: number) => (
              <div key={blog.blog_id} className={cn("group ")}>
                <Link
                  onClick={() => {
                    sendGTMEvent({
                      event: "blog_click",
                      blogId: `${blog.blog_id}`,
                      blogTitle: `${blog.blog_title}`,
                    });
                  }}
                  href={`/whats-hot/${blog.blog_id}`}
                >
                  <div className="w-full h-52">
                    <Image
                      src={blog.ImgUrl}
                      alt={blog.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover  group-hover:opacity-80  "
                    />
                  </div>{" "}
                  <p className="text-2xl pt-2 pb-1 group-hover:underline underline-offset-2">
                    {blog.title}
                  </p>
                  <div className="text-muted-foreground text-xs">
                    <DateComponent datetime={blog.created_at} type="relative" />
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default WhatsHot;
