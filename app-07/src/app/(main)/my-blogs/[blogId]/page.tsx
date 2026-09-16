import React from "react";
import BlogPage from "./blog-page";
import { getBlogData } from "@/actions/blog/get-blog-data";

async function page({ params }: { params: { blogId: string } }) {
  const { success: blog, error } = await getBlogData(params.blogId);

  if (error) {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pb-20">
        Blog not found
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pb-20">
      <BlogPage blog={blog} />
    </div>
  );
}

export default page;
