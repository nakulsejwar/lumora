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
import { Share2, Search, BookOpen, Compass, Award } from "lucide-react";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";

function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const { setCourseId } = useCourseIdStore();

  const { data, isLoading } = useQuery({
    queryKey: ["currentAuthUserData"],
    queryFn: async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/me/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        return data;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: coursesData, isLoading: isCoursesDataLoading } = useQuery({
    queryKey: ["coursesData"],
    queryFn: async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
            ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-journey-data-main/`
            : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-journey-data/`;

        const token = await getToken();
        const { data } = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: "Bearer " + token } : {}),
          },
        });

        if (Array.isArray(data)) {
          return data.filter((course: any) => course?.live?.toLowerCase() !== "no");
        }

        return data;
      } catch (error) {
        return null;
      }
    },
  });

  React.useEffect(() => {
    if (!coursesData) return;
    const activeCourses = Array.isArray(coursesData)
      ? coursesData.filter((course: any) => course?.live?.toLowerCase() !== "no")
      : [];

    if (!searchQuery.trim()) {
      setFilteredCourses(activeCourses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = activeCourses.filter(
        (course: any) =>
          course.name.toLowerCase().includes(query) ||
          (course.course_tip && course.course_tip.toLowerCase().includes(query)) ||
          (course.courseid && course.courseid.toLowerCase().includes(query))
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, coursesData]);

  const handleShare = (coursename: string, courseid: string) => {
    sendGTMEvent({
      event: "share_game",
      shareGame: ` ${coursename} course shared`,
    });
    const urlToCopy = `https://www.lumora.app/courses/${courseid}`;
    navigator.clipboard.writeText(urlToCopy).then(
      function () {
        toast.success("Copied to clipboard");
      },
      function () {
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  if (isLoading || isCoursesDataLoading) {
    return (
      <div className="flex items-center justify-center gap-3 mt-24">
        <div className="w-4 h-4 rounded-full animate-bounce bg-[#070235]" />
        <div className="w-4 h-4 rounded-full animate-bounce bg-[#0091cf] delay-100" />
        <div className="w-4 h-4 rounded-full animate-bounce bg-[#fe932c] delay-200" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col max-w-6xl mx-auto px-4 sm:px-6 py-8 bg-[#faf8ff] text-[#131b2e]">
      {/* Header Badge & Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaedff] border border-[#0091cf]/30 text-[#070235] text-xs font-mono font-extrabold uppercase tracking-widest mb-3">
          <BookOpen className="w-4 h-4 text-[#fe932c]" />
          <span>OFFICIAL READING MISSIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#070235] tracking-tight leading-tight">
          Reading Missions
        </h1>
        <p className="text-sm sm:text-base text-[#47464f] mt-2 font-medium">
          Select a reading mission below to inspect reading passages, evaluate textual evidence, and complete reading missions.
        </p>
      </div>

      {/* 🔍 Search Input Bar */}
      <div className="flex justify-center items-center w-full mb-8">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search reading missions by topic, title, or keyword..."
            className="w-full border border-[#c8c5d0] focus:border-[#070235] rounded-2xl py-3.5 pl-12 pr-6 outline-none transition-all shadow-inner bg-white text-[#131b2e] placeholder-[#787680] text-sm focus:ring-2 focus:ring-[#0091cf]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787680] w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2">
        {[...(filteredCourses.length ? filteredCourses : coursesData || [])]
          .reverse()
          .slice(0, visibleCount)
          ?.map((course: any) => (
            <Link
              href={`/courses/${course.courseid}`}
              key={course.courseid}
              className="group relative border border-[#c8c5d0]/70 bg-white hover:bg-[#faf8ff] flex flex-col w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                sendGTMEvent({
                  event: "course_click",
                  courseName: `${course.name}`,
                });
                setCourseId(`${course.courseid}`, null, null);
              }}
            >
              {/* Share Icon Overlay */}
              <motion.div
                className="absolute top-3 right-3 z-10"
                whileTap={{ scale: 0.9 }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare(course.name, course.courseid);
                  }}
                  id="share"
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#c8c5d0] flex items-center justify-center text-[#070235] hover:bg-[#eaedff] transition-colors shadow-sm"
                  title="Share Mission Link"
                >
                  <Share2 className="w-4 h-4 text-[#fe932c]" />
                </button>
              </motion.div>

              {/* Cover Image Container */}
              <div className="h-48 w-full bg-[#eaedff] relative overflow-hidden">
                <Image
                  priority
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  src={
                    course.ImageLink &&
                      typeof course.ImageLink === "string" &&
                      course.ImageLink.trim() !== "" &&
                      course.ImageLink !== "None" &&
                      course.ImageLink !== "null"
                      ? course.ImageLink.trim()
                      : "/images/healthy-foods.png"
                  }
                  width={400}
                  height={300}
                  alt={course.name}
                />
                <div className="absolute bottom-2 left-3 bg-[#070235]/90 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-xs">
                  MISSION #{String(course.courseid).toUpperCase()}
                </div>
              </div>

              {/* Course Title & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#070235] group-hover:text-[#0091cf] transition-colors leading-snug line-clamp-2">
                    {course.name}
                  </h3>
                  {course.course_tip && course.course_tip !== "None" && (
                    <p className="text-xs text-[#47464f] line-clamp-2 mt-1 leading-relaxed">
                      {course.course_tip}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs font-mono font-bold text-[#0091cf]">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#fe932c]" /> Start Mission
                  </span>
                  <span className="text-[#070235] group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Load More Control */}
      {visibleCount < (coursesData?.length || 0) && (
        <div className="w-full flex justify-center py-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-8 py-3 bg-[#070235] hover:bg-[#1e1b4b] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 border border-[#89ceff]/30"
          >
            <span>Load More Reading Missions</span>
            <BookOpen className="w-4 h-4 text-[#fe932c]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;

