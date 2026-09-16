"use client";
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash, MoveRight } from "lucide-react";
import { deleteCourseData } from "@/actions/course/delete-course";
import { toast } from "sonner";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useCourseStore from "@/hooks/use-course-store";
import useChatSession from "@/hooks/use-chat-session";
import { useRouter } from "next/navigation";
function CourseComponent({ courses }: { courses: any }) {
  const router = useRouter();
  const loadingModal = useLoadingModal();
  const createCourse = useCourseStore((state) => state.createCourse);

  // --------------------------
  // 🔥 PAGINATION STATE
  // --------------------------
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // Change as needed

  const totalPages = Math.ceil(courses.length / itemsPerPage);

  // Courses to show on this page
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return [...courses].reverse().slice(start, start + itemsPerPage);
  }, [courses, page]);

  const deleteCourse = async (courseid: string) => {
    loadingModal.onOpen();
    const { error } = await deleteCourseData(courseid, "course");

    if (error) {
      loadingModal.onClose();
      return toast("Something went wrong");
    }

    toast.success("Course deleted successfully!🎉");
    loadingModal.onClose();
  };

  // console.log("courses----------", courses);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#c8c5d0]/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#070235]">
            Your Courses<span className="text-[#fe932c]">.</span>
          </h1>
          <p className="text-xs text-[#47464f] mt-1 font-medium">
            Manage your generated interactive reading courses and modules.
          </p>
        </div>
        <Link href="/">
          <Button className="bg-[#070235] hover:bg-[#1e1b4b] text-white font-mono text-xs uppercase tracking-wider rounded-xl">
            + New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedCourses.length > 0 ? (
          paginatedCourses.map((course: any) => (
            <Card
              className="bg-white border border-[#c8c5d0]/60 rounded-2xl shadow-sm hover:shadow-md hover:border-[#0091cf]/50 transition-all flex flex-col justify-between overflow-hidden group"
              key={course.id}
            >
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-extrabold text-[#070235]">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      className="text-left font-extrabold text-[#070235] hover:text-[#0091cf] transition-colors line-clamp-2"
                      onClick={() => {
                        createCourse(course);
                        router.push(`/course/${course.courseid}`);
                      }}
                    >
                      {course.name}
                    </button>

                    <button
                      onClick={() => deleteCourse(course.courseid)}
                      className="p-1.5 rounded-lg text-[#787680] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-all"
                      title="Delete Course"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </CardTitle>

                <CardDescription className="mt-2">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-extrabold text-[#904d00] tracking-widest uppercase bg-[#fe932c]/15 rounded border border-[#fe932c]/30 mb-2">
                    {course.courseid}
                  </span>
                  <p className="text-xs text-[#47464f]">
                    {dayjs(course.created_at).format("ddd, MMM D h:mm A")}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-5 py-3 bg-[#faf8ff] border-t border-[#c8c5d0]/40 flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="p-0 text-xs font-mono font-bold text-[#070235] hover:text-[#0091cf] uppercase tracking-wider flex items-center gap-1 w-full justify-between"
                  onClick={() => {
                    createCourse(course);
                    router.push(`/course/${course.courseid}`);
                  }}
                >
                  <span>Go to Course</span>
                  <MoveRight className="w-4 h-4 text-[#fe932c] group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-16 bg-white rounded-3xl border border-[#c8c5d0]/60 text-center flex flex-col items-center justify-center p-8">
            <p className="text-base font-extrabold text-[#070235] mb-2">No courses found</p>
            <p className="text-xs text-[#47464f] mb-6">Create your first reading course to get started.</p>
            <Link href="/">
              <Button variant="default">
                Create Course Now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {courses.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            variant="outline"
          >
            Previous
          </Button>

          <span className="text-xs font-mono font-bold text-[#070235]">
            Page {page} of {totalPages}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );

}

export default CourseComponent;
