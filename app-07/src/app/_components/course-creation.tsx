import CreateSingleCourseForm from "@/components/forms/stepper-form";
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function CourseCreation() {
  return (
    <div className="flex items-center justify-center w-full max-w-7xl mx-auto">
      <Tabs defaultValue="custom" className="w-full max-w-2xl mx-auto">
        <TabsContent value="custom">
          <CreateSingleCourseForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
