export type LumoraSkill =
  | "main-idea"
  | "vocabulary"
  | "inference"
  | "cause-effect"
  | "sequence"
  | "evidence";

export type McqQuestion = {
  id: string;
  type: string;
  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correct_answer: string;
  reason: string;

  // Lumora adaptive learning metadata
  skill_tag?: LumoraSkill | null;
  has_reasoning_prompt?: boolean;
};

export type Game = {
  id: string;
  game_name: string;
  game_description: string;

  questions: McqQuestion[];

  // Lumora reading metadata
  passage_text?: string;
  grade_band?: string;
  difficulty?: string;
  target_skill?: LumoraSkill;
};

export type Levels = {
  id: string;
  level: number;
  level_name: string;
  level_description: string;
  games?: Game[];
};

export type Module = {
  id: string;
  module_name: string;
  module_description: string;
  levels: Levels[];
};

export type Course = {
  course_name: string;
  course_description: string;
  modules: Module[];
  ImageLink?: string;
  image_file?: File | null;
};