import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CourseCreation from "./_components/course-creation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 md:p-5 mt-16">
      <CourseCreation />
    </main>
  );
}
