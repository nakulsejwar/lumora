export type GameDetails = {
  Name: string;
  Order: number;
  GameId: string;
  Level: string;
  LevelId?: string;
  Topic: string;
  Journey: string;
  Type: string;
  Title: string;
  ImageLink: string;
  Description: string;
  gameTip: string;
  questionTip: string;
  inGameTip: string;
  passage_text?: string | null;
  grade_band?: string | null;
  difficulty?: string | null;
  target_skill?: string | null;
};

export type GameData = {
  id?: string;
  questions: Question[];
};

export type Question = {
  id?: number;
  qid: string;
  question: string;
  type: string;
  isMultiCorrect: boolean;
  correctOption: number[] | string;
  options: QuestionOption[];
  tileid?: string;
  questionTip?: string;
  reason?: string;
  skill_tag?: string | null;
  has_reasoning_prompt?: boolean;
};

export type QuestionOption = {
  image: string;
  option: string;
};

export type CardSwipeDirection = "left" | "right";
export type IsDragOffBoundary = "left" | "right" | null;

export type Card = {
  id?: number;
  Name: string;
  ImageLink: string;
  isCorrect: boolean;
};
