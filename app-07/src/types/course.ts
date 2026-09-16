export type Option = {
  option: string;
  image: string;
  isSelected?: boolean;
};

export type RelatedTile = {
  gameid: string;
  tileid: string;
  qno: number;
  type: string;
  questionTip: string;
  question: string;
  live: string;
  reason: string;
  skill_tag?: string | null;
  has_reasoning_prompt?: boolean;
  isMultiCorrect: boolean;
  correctOption: number[];
  options: Option[];
};

export type RelatedGame = {
  created_at: string;
  gameid: string;
  level_id: string;
  order: number;
  name: string;
  ImageLink: string;
  gameTip: string;
  in_gameTip: string;
  live: string;
  passage_text?: string | null;
  grade_band?: string | null;
  difficulty?: string | null;
  target_skill?: string | null;
  related_tiles: RelatedTile[];
};

export type RelatedLevel = {
  created_at: string;
  topic_id: string;
  level_id: string;
  order: number;
  name: string;
  ImageLink: string;
  level_tip: string;
  live: string;
  related_games: RelatedGame[];
};

export type RelatedTopic = {
  created_at: string;
  topic_id: string;
  courseid: string;
  order: number;
  name: string;
  ImageLink: string;
  topic_tip: string;
  live: string;
  related_levels: RelatedLevel[];
};

export type CourseType = {
  created_at: string;
  courseid: string;
  order: number;
  name: string;
  ImageLink: string;
  course_tip: string;
  live: string;
  related_topics: RelatedTopic[];
};
