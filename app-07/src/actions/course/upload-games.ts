"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface Game {
  level_id: string;
  gameid: string;
  order: string | number;
  name: string;
  ImageLink: string;
  gameTip: string;
  in_gameTip: string;
  live: string;
  passage_text?: string | null;
  grade_band?: string | null;
  difficulty?: string | null;
  target_skill?: string | null;
}

interface GamesPayload {
  games: Game[];
  action: string;
}

export const uploadGames = async (content: GamesPayload) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/create-admin-game/",
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("gamedata", data);
    import("fs").then(fs => fs.appendFileSync("debug_uploadGames.log", JSON.stringify(content, null, 2) + "\n"));
    revalidatePath("/my-courses");

    return { success: data };
  } catch (error) {
    console.log("games", error);
    return { error: (error as AxiosError).message };
  }
};
