"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export function BreadcrumbComponent({ courseName }: { courseName: string }) {
  return (
    <Breadcrumb className="font-mono text-xs uppercase font-extrabold tracking-wider">
      <BreadcrumbList className="flex items-center gap-1.5 text-[#47464f]">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/courses"
            className="text-[#0091cf] hover:text-[#070235] transition-colors"
          >
            Reading Missions
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-[#c8c5d0]">
          <ChevronRight className="w-3.5 h-3.5" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-[#070235] font-extrabold">
            {courseName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

