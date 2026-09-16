"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fontVarela } from "@/lib/fonts";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() {
  const router = useRouter();

  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/");
  //   }, 2000);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <section className="flex items-center h-full py-16 dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              width={100}
              height={100}
              alt=""
              className="w-8 h-8"
            />
            <p className="text-2xl font-semibold md:text-3xl">
              Your session has expired
            </p>
          </div>
          <p className="mt-4 mb-8 dark:text-gray-400">
            Don&apos;t worry, we&apos;re redirecting you to the homepage.
          </p>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "theme" }), "rounded-full")}
          >
            Refresh
          </Link>
        </div>
      </div>
    </section>
  );
}
