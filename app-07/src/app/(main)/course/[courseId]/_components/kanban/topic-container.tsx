import React from "react";

import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { RelatedTopic } from "@/types/course";
import SortableTopic from "./topic-item";

interface Props {
  topics: Array<RelatedTopic>;
}

const TopicsContainer: React.FC<Props> = ({ topics }) => {
  return (
    <SortableContext
      items={topics.map((topic) => topic.topic_id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className="space-y-3">
        {topics.map((topic) => (
          <SortableTopic key={topic.topic_id} topic={topic} />
        ))}
      </div>
    </SortableContext>
  );
};

export default TopicsContainer;
