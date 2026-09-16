import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCourses } from "@/actions/course/get-courses";
import { auth } from "@/auth";
import { getQueryClient } from "@/components/providers/query";
import React from "react";
import CourseEditView from "./_components/course-edit-view";

async function page({ params }: { params: { courseId: string } }) {
  const session = await auth();

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["course", { courseId: params.courseId }],
    queryFn: async () => {
      const course = await getCourses(session?.user?.email!, params.courseId);

      if (course.error) throw new Error((course.error as Error).message);
      if (course.success) return course.success[0];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CourseEditView />
    </HydrationBoundary>
  );
}

export default page;
