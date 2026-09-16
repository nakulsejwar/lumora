import CourseView from "@/app/_components/course-view";
import CreateCourseView from "@/app/_components/create-course-view";
import React, { Suspense } from "react";

function page() {
  return (
    <div className="max-w-6xl mx-auto ">
      <CreateCourseView />
    </div>
  );
}

export default page;
