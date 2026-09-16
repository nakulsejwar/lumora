import React from "react";

import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { RelatedLevel } from "@/types/course";
import SortableLevel from "./level-item";

type Props = {
  levels: Array<RelatedLevel>;
};

const LevelContainer: React.FC<Props> = ({ levels }) => {
  return (
    <SortableContext
      items={levels.map((level) => level.level_id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className={`mt-2 space-y-2`}>
        {levels.map((level) => {
          return <SortableLevel key={level.level_id} level={level} />;
        })}
      </div>
    </SortableContext>
  );
};

export default LevelContainer;
