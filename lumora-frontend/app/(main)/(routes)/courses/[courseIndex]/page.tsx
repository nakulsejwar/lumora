"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LevelsComponent from "@/components/levels/levels-component";
import { useParams } from "next/navigation";
import { BreadcrumbComponent } from "@/components/breadcrumb";
import "react-horizontal-scrolling-menu/dist/styles.css";
import Topics from "@/components/levels/topics";
import CourseJourney from "@/components/journey/journey";
import { getToken } from "@/lib/utils/utils.client";

const ITEM_WIDTH = 200;
function CoursePage() {
  const params = useParams();
  const [tab, setActiveTab] = useState("stake");
  const { data: topicsData, isLoading: isTopicsDataLoading } = useQuery({
    queryKey: ["topicsData", { courseId: params.courseIndex }],
    queryFn: async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
            ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-topics-data-main/`
            : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-topics-data/`;

        const token = await getToken();
        const { data } = await axios.post(
          apiUrl,
          { course_id: params.courseIndex },
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: "Bearer " + token } : {}),
            },
          }
        );

        return data;
      } catch (error) {
        console.error("[topicsData] Error fetching topics:", error);
        return null;
      }
    },
  });

  if (isTopicsDataLoading) {
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

  const courseName =
    Array.isArray(topicsData) && topicsData.length > 0 && topicsData[0]?.course_name
      ? topicsData[0].course_name
      : "Course Journey";

  return (
    <div className="flex min-h-screen w-full flex-col  max-w-6xl mx-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="pt-4 px-4 sm:px-6">
          <BreadcrumbComponent courseName={courseName} />
        </div>
        {/* <Topics coursesData={coursesData} /> */}
        <CourseJourney topicsData={topicsData || []} />
      </div>
    </div>
  );
}

export default CoursePage;
