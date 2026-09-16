"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignLeft } from "lucide-react";
import { useState } from "react";
import { SidebarBoard } from "./kanban/sidebar-kanban";

export function MobileSidebar({ courseDetails }: { courseDetails: any }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <AlignLeft />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0  ">
          <SheetHeader>
            <SheetTitle>{courseDetails.name}</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className=" space-y-3 relative flex flex-col p-3  min-h-screen border-r overflow-hidden ">
            <SidebarBoard courseTopics={courseDetails.related_topics} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
