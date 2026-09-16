"use client";
import DateComponent from "@/components/date-component";
import Content from "@/components/tiptap/content";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import QuizComponent from "./quiz-component";
import { cn } from "@/lib/utils";
import AdBanner from "@/components/google-ads-banner";

function BlogPage({ blog }: { blog: any }) {
  return (
    <div className="py-5 px-3 flex flex-col items-center md:max-w-3xl mx-auto">
      <h1 className="text-2xl font-medium py-2 w-full">{blog.title}</h1>
      <div className="flex items-center justify-between w-full text-xs text-muted-foreground pb-5">
        <DateComponent datetime={blog.created_at} type="date" />
        <p>{blog.user_email}</p>
      </div>
      <div className="w-full mx-auto ">
        <Image
          src={blog.ImgUrl}
          alt={blog.title}
          width={200}
          height={200}
          className=" h-80 w-full max-w-fit mx-auto"
        />
      </div>

      <div className="py-5 w-full max-w-sm sm:max-w-md md:max-w-2xl">
        <QuizComponent quiz={blog.quiz} />
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
      <div className=" ">
        <Content content={blog.content} />
      </div>

      <div className="my-5 w-full space-y-2">
        <p className=" font-sans text-base md:text-lg font-semibold">
          Want to know more? Here&apos;s a fun way to learn more about this
          topic!
        </p>

        <Link
          href={`/courses/${blog.metadata.courseId}`}
          scroll={true}
          className={cn(buttonVariants({ variant: "theme" }), " ")}
        >
          Explore Games
        </Link>
      </div>
    </div>
  );
}

export default BlogPage;
