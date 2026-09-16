import { z } from "zod";

import { StaticImageData } from "next/image";
import { SetStateAction } from "react";

export const AvatarSchema = z.object({
  id: z.number(),
  url: z.string(),
});

export type Avatar = z.infer<typeof AvatarSchema>;

type TracksData = {
  name: string;
  artist: string;
  img: string;
};

export type CardData = {
  id: number;
  title: string;
  src: string;
  isCorrect: boolean;
};

export type CardProps = {
  data: CardData;
  active: boolean;
  removeCard: (data: CardData, action: "right" | "left") => void;
};

export type SwipeButtonProps = {
  exit: (value: SetStateAction<number>) => void;
  removeCard: (id: number, action: "right" | "left") => void;
  id: number;
};
