import CourseView from "@/app/_components/course-view";
import CreateCourseView from "@/app/_components/create-course-view";
import React, { Suspense } from "react";

function page() {
  return (
    <div className="max-w-6xl mx-auto ">
      <Suspense>
        {/* <CourseView /> */}
        <CreateCourseView />
      </Suspense>
    </div>
  );
}

export default page;
