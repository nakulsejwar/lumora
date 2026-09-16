"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UnitBanner } from "./unit-banner";
import LessonButtons from "./lesson-buttons";
import { TopicTipModal } from "../modals/topic-tip-modal";
import { sendGTMEvent } from "@next/third-parties/google";
import { useTopicTipModal } from "@/lib/hooks/use-topic-tip-modal";
function CourseJourney({ topicsData }: { topicsData: any }) {
  const params = useParams();
  const topicTipModal = useTopicTipModal();
  const [selectedTopicTip, setSelectedTopicTip] = React.useState<string>("");
  return (
    <div className="space-y-5 p-2 pb-16">
      {topicsData.map((item: any, index: number) => (
        <div key={item.topic_id}>
          <div
            onClick={() => {
              setSelectedTopicTip(item.topic_tip);
              sendGTMEvent({
                event: "topic_click",
                topicName: item.name,
              });
              topicTipModal.onOpen();
            }}
          >
            <UnitBanner title={item.name} description={item.topic_tip} />
          </div>
          <div className="relative flex flex-col items-center">
            <LessonButtons levels={item.related_levels} topicIndex={index} />
          </div>
        </div>
      ))}

      <TopicTipModal item={selectedTopicTip} />
    </div>
  );
}

export default CourseJourney;
