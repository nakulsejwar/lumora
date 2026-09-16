"use client";
import DateComponent from "@/components/date-component";
import Content from "@/components/tiptap/content";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function BlogPage({ blog }: { blog: any }) {
  return (
    <div className="py-5 flex flex-col items-center max-w-3xl mx-auto">
      <div className="flex items-center justify-end w-full">
        <Link href={`/my-blogs/${blog.blog_id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl font-medium py-2 w-full">{blog.title}</h1>
      <div className="flex items-center justify-between w-full text-xs text-muted-foreground pb-5">
        <DateComponent datetime={blog.created_at} type="date" />
        <p>{blog.user_email}</p>
      </div>
      <div className="w-full max-w-xl mx-auto ">
        <Image
          src={blog.ImgUrl}
          alt={blog.title}
          width={200}
          height={200}
          className=" h-80 w-full max-w-fit mx-auto"
        />
      </div>
      <Content content={blog.content} />
    </div>
  );
}

export default BlogPage;
