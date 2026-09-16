"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LevelsComponent from "@/components/levels/levels-component";
import { useParams } from "next/navigation";
import {
  ScrollMenu,
  VisibilityContext,
  publicApiType,
} from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import usePreventBodyScroll from "./use-prevent-body-scroll";
import { ArrowLeftCircle, ArrowRightCircle, Info } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import GamesComponent from "./games-component";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function Topics({ coursesData }: { coursesData: any }) {
  const params = useParams();
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const { courseId, topicId, levelId, setCourseId } = useCourseIdStore();

  return (
    <main className="flex flex-col  gap-4 p-3 sm:px-6 sm:py-0 md:gap-8  ">
      <Tabs
        defaultValue={
          topicId
            ? topicId
            : coursesData[Number(params.courseIndex)].related_topics[0]
                ?.topic_id
        }
        className="flex flex-col !p-0 !my-0"
      >
        <TabsList className="bg-yellow-100 !pt-1 shadow-md ">
          <div
            className="w-full max-w-xs mx-auto md:mx-0 sm:max-w-md md:max-w-2xl lg:max-w-5xl   "
            onMouseEnter={disableScroll}
            onMouseLeave={enableScroll}
          >
            <ScrollMenu
              onWheel={onWheel}
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
            >
              {coursesData[Number(params.courseIndex)].related_topics?.map(
                (item: any) => (
                  <TabsTrigger
                    className="text-xs md:text-sm mx-1 "
                    key={item?.topic_id}
                    value={item?.topic_id}
                    onClick={() => {
                      sendGTMEvent({
                        event: "topic_click",
                        topicName: `${item.name}`,
                      });
                      setCourseId(courseId, item.topic_id, null);
                    }}
                  >
                    {item.name}
                  </TabsTrigger>
                )
              )}
            </ScrollMenu>
          </div>
        </TabsList>
        {coursesData[Number(params.courseIndex)].related_topics?.map(
          (item: any) => (
            <TabsContent
              key={item?.topic_id}
              value={item?.topic_id}
              className="!p-0 !m-0"
            >
              {/* <LevelsComponent data={item} /> */}
              <GamesComponent levels={item.related_levels} />
            </TabsContent>
          )
        )}
      </Tabs>
    </main>
  );
}

export default Topics;

export function LeftArrow() {
  const visibility = React.useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);

  return (
    <Arrow
      disabled={isFirstItemVisible}
      onClick={() => visibility.scrollPrev()}
    >
      <ArrowLeftCircle className="mr-2 " />
    </Arrow>
  );
}

export function RightArrow() {
  const visibility = React.useContext<publicApiType>(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);

  return (
    <Arrow disabled={isLastItemVisible} onClick={() => visibility.scrollNext()}>
      <ArrowRightCircle className="ml-2" />
    </Arrow>
  );
}

function Arrow({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        right: "1%",
        opacity: disabled ? "0.2" : "1",
        userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}
