"use client";
import React from "react";
import dayjs from "dayjs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, MoveRight, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deleteBlog } from "@/actions/blog/delete-blog";
import DateComponent from "@/components/date-component";
import Image from "next/image";
function Blogs({ blogs }: { blogs: any }) {
  const router = useRouter();
  const loadingModal = useLoadingModal();

  const onDelete = async (id: string) => {
    loadingModal.onOpen();
    const { success, error } = await deleteBlog(id);
    if (error) {
      loadingModal.onClose();
      return toast("Something went wrong");
    }

    toast.success("Blog deleted successfully!🎉");
    loadingModal.onClose();
  };

  return (
    <div className="px-10">
      <h1 className="text-xl py-5">Your Blogs</h1>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 mx-auto gap-6 items-stretch">
        {blogs?.length > 0 ? (
          blogs?.map((blog: any) => (
            <div key={blog.blog_id} className="">
              <Link href={`/my-blogs/${blog.blog_id}`}>
                <div className="w-full h-40">
                  <Image
                    src={blog.ImgUrl}
                    alt={blog.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover  "
                  />
                </div>{" "}
                <p className="text-2xl py-2">{blog.title}</p>
              </Link>
              <div className="flex items-center justify-between ">
                <p className="text-xs text-muted-foreground">
                  <DateComponent datetime={blog.created_at} type="relative" />
                </p>
                <button onClick={() => onDelete(blog.blog_id)}>
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-center">No Blogs available</p>
            <Link
              href={`/`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Create Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;
