import { getCourses } from "@/actions/course/get-courses";
import { getHistory } from "@/actions/history/get-history";
import { auth } from "@/auth";
import React from "react";
import CourseComponent from "./course-component";
import HistoryComponent from "./history-component";
import QueueComponent from "./queue-component";

async function page() {
  const session = await auth();

  const courses = await getCourses(session?.user?.email!, "");

  if (courses.error) {
    return <div>No data available.</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pb-20">
      <CourseComponent courses={courses.success} />
      <HistoryComponent />
      <QueueComponent />
    </div>
  );
}

export default page;
