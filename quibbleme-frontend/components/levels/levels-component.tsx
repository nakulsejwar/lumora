"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FundamentalsComponent from "./fundamentals-component";
import { SparklesIcon } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";
import { useParams } from "next/navigation";
import {
  ScrollMenu,
  VisibilityContext,
  publicApiType,
} from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import usePreventBodyScroll from "./use-prevent-body-scroll";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
export default function LevelsComponent({ data }: { data: any }) {
  const [tab, setActiveTab] = useState("stake");
  const { courseId, topicId, levelId, setCourseId } = useCourseIdStore();
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  return (
    <div className="flex  w-full flex-col  max-w-5xl mx-auto   ">
      <main className="grid flex-1 items-start ">
        {data.related_levels.length > 0 ? (
          <Tabs
            defaultValue={levelId ? levelId : data.related_levels[0].level_id}
            onValueChange={setActiveTab}
            className="flex flex-col"
          >
            <TabsList className="!pt-1 bg-blue-300 shadow-md">
              <div
                className=" w-full max-w-xs mx-auto md:mx-0 sm:max-w-md md:max-w-2xl lg:max-w-5xl  "
                onMouseEnter={disableScroll}
                onMouseLeave={enableScroll}
              >
                <ScrollMenu
                  onWheel={onWheel}
                  LeftArrow={LeftArrow}
                  RightArrow={RightArrow}
                >
                  {data.related_levels?.map((item: any) => (
                    <TabsTrigger
                      className="text-xs data-[state=active]:p-2 !mx-1 md:text-sm rounded-t-sm data-[state=active]:bg-background  data-[state=active]:border-t data-[state=active]:border-blue-200 data-[state=active]:shadow-md"
                      key={item.level_id}
                      value={item.level_id}
                      onClick={() => {
                        sendGTMEvent({
                          event: "level_click",
                          levelName: `${item.name}`,
                        });

                        setCourseId(courseId, topicId, item.level_id);
                      }}
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </ScrollMenu>
              </div>
            </TabsList>

            {data.related_levels?.map((item: any) => (
              <TabsContent key={item.level_id} value={item.level_id}>
                {item.level_tip && item.level_tip !== "None" ? (
                  <div className=" md:px-8">
                    <div className="bg-gray-50 rounded-md md:px-2 py-1 ">
                      <div className="flex gap-2 p-2 text-xs">
                        <SparklesIcon className="w-4 h-4 text-blue-200 hidden md:block" />
                        <div>
                          <span>{item.level_tip}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <FundamentalsComponent levelData={item} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="">
            <h1
              className="animate-fade-up custom-gradient  text-center font-display text-3xl font-bold  text-transparent py-2 md:pt-7  drop-shadow-sm [text-wrap:balance] md:text-6xl xl:text-7xl md:!leading-[5rem]"
              style={{
                animationDelay: "0.15s",
                animationFillMode: "forwards",
              }}
            >
              Coming Soon
            </h1>
            <p className="text-sm md:text-xl text-center ">
              We&apos;re working hard to bring you something amazing. Stay
              tuned!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export function LeftArrow() {
  const visibility = React.useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);

  return (
    <Arrow
      disabled={isFirstItemVisible}
      onClick={() => visibility.scrollPrev()}
    >
      <ArrowLeftCircle className="mx-2 " />
    </Arrow>
  );
}

export function RightArrow() {
  const visibility = React.useContext<publicApiType>(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);

  return (
    <Arrow disabled={isLastItemVisible} onClick={() => visibility.scrollNext()}>
      <ArrowRightCircle className="mx-2 " />
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
