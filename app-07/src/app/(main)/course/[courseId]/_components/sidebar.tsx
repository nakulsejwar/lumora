"use client";
import * as React from "react";

import { TopicsCollapsible } from "./collapsible";
import { SidebarBoard } from "./kanban/sidebar-kanban";

function Sidebar({ courseDetails }: { courseDetails: any }) {
  return (
    <div className=" space-y-3 relative hidden lg:flex flex-col p-3  min-h-screen border-r overflow-hidden ">
      <span className="text-lg font-semibold">{courseDetails.name}</span>
      {/* {courseDetails?.related_topics?.map((topic: any) => (
        <div
          key={topic.topic_id}
          className="rounded-md border p-1 px-2 font-mono text-sm"
        >
          <TopicsCollapsible topic={topic} />
        </div>
      ))} */}

      <SidebarBoard courseTopics={courseDetails.related_topics} />
    </div>
  );
}

export default Sidebar;
