import { FoodItem } from "@/lib/hooks/use-nutrients-store";
import {
  Card,
  type GameDetails,
  type GameData,
  Question,
} from "@/types/game.types";
import axios from "axios";

export type NextGameDetails = {
  Name: string;
  Order: number;
  GameId: string;
};

export const games: NextGameDetails[] = [
  {
    Name: "Sugar",
    Order: 1,
    GameId: "Sug0916",
  },
  {
    Name: "Water",
    Order: 2,
    GameId: "Wat3581",
  },
  {
    Name: "Calories",
    Order: 3,
    GameId: "Cal3334",
  },
  {
    Name: "Fiber",
    Order: 4,
    GameId: "Fib4080",
  },
  {
    Name: "Fat",
    Order: 5,
    GameId: "Fat5747",
  },
  {
    Name: "Protein",
    Order: 6,
    GameId: "Pro0742",
  },
  {
    Name: "Carbs",
    Order: 7,
    GameId: "Car9360",
  },
  {
    Name: "Healthy",
    Order: 8,
    GameId: "Hea8072",
  },
  {
    Name: "FoodComps",
    Order: 9,
    GameId: "Foo1909",
  },
];

// const getGames = async (): Promise<Games[]> => games;

// export const findTitleFromName = (name: string): Games | undefined => {
//   const game = games.find((game) => game.Name === name);
//   return game;
// };

export const getGames = async (): Promise<GameDetails[]> => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-games/`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data as GameDetails[];
  } catch (error) {
    throw new Error("Error fetching games");
  }
};

export const getGamesPlayed = async (email: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/get-played-games/`,
      {
        email,
        userId: "",
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: data };
  } catch (error) {
    console.log(error);
    return { error: (error as Error).message };
  }
};

export const getNextGame = async (id: string) => {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
        ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-next-gameid-main/`
        : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-next-gameid/`; // replace with your dev API endpoint

    const { data } = await axios.post(
      apiUrl,
      {
        gameid: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: data };
  } catch (error) {
    return { error: "An error occurred." };
  }
};

export const fetchNextGame = async (order: number, allOrders: number[]) => {
  const playedGameIds = new Set(allOrders);
  let nextId = order + 1;
  let game;
  while (true) {
    // If all games have been played, return a message indicating so
    if (playedGameIds.size === games.length) {
      return games[0];
    }

    // If the nextId exceeds the total number of games, reset it to 1
    if (nextId > games.length) {
      nextId = 1;
    }

    // If the nextId has not been played, return the corresponding game
    if (!playedGameIds.has(nextId)) {
      game = games.find((game) => game.Order === nextId);
      break;
    }

    // Increment nextId for the next iteration
    nextId++;
  }

  return game;
};

export const getGame = async (id: string): Promise<GameDetails> => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-games/`,
      {
        gameid: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data[0] as GameDetails;
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching game Info");
  }
};

import { getToken } from "@/lib/utils/utils.client";

const getGameOrder = (name: string) => {
  return games.find((game) => game.Name === name)?.Order;
};

export const getGameData = async (id: string) => {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
        ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-tile-data-main/`
        : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-tile-data/`;

    const token = await getToken();
    const { data } = await axios.post(
      apiUrl,
      {
        gameid: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
      }
    );

    return { id, questions: data };
  } catch (error) {
    throw new Error("An error occurred fetching game data.");
  }
};

const reversedCards = (cards: Question[]) => {
  const shuffledData = shuffleArray(cards);

  return shuffledData
    .map((item, i) => {
      return { ...item };
    })
    .reverse();
};

const shuffleArray = (data: Question[]) => {
  const shuffledData = [...data];

  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }

  return shuffledData;
};

// nutirents.api.ts
export const getNutrientsData = async (
  foodItems: string[]
): Promise<FoodItem[]> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/lumora/food-details/`,
    {
      food_items: foodItems.toString(),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};
