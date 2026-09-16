import React from "react";
import { getBlogData } from "@/actions/blog/get-blog-data";
import { EditBlogForm } from "./edit-blog-form";

async function EditPage({ params }: { params: { blogId: string } }) {
  const { success: blog, error } = await getBlogData(params.blogId);

  if (error) {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pb-20">
        Blog not found
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-16 pb-20">
      <h1 className="py-4 text-2xl font-semibold">Edit Blog</h1>
      <EditBlogForm blog={blog} />
    </div>
  );
}

export default EditPage;
