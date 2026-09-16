"use client";

import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "@/lib/utils/auth-service";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface GamePlayed {
  created_at: string;
  LumoraUserId: string;
  gameid: string;
  score_id: string;
  score: number;
  course_id: string;
}

const intitialUserAvatarArray = [
  {
    url: "/images/lumora_avatar_1.svg",
    id: 1,
  },
  {
    url: "/images/lumora_avatar_2.svg",
    id: 2,
  },
  {
    url: "/images/lumora_avatar_3.svg",
    id: 3,
  },
  {
    url: "/images/lumora_avatar_4.svg",
    id: 4,
  },
  {
    url: "/images/lumora_avatar_5.svg",
    id: 5,
  },
  {
    url: "/images/lumora_avatar_6.svg",
    id: 6,
  },
  {
    url: "/images/lumora_avatar_7.svg",
    id: 7,
  },
];

interface UserAvatarT {
  url: string;
  id: number;
}
const intitialUserAvatar =
  "/images/lumora_avatar_6.svg";

interface ContextType {
  isAuthUserDataLoading: boolean;
  userAvatarArray: UserAvatarT[];
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  gamesPlayed: null | GamePlayed[] | undefined;
}

export const GlobalContext = createContext<ContextType>({
  isAuthUserDataLoading: false,
  userAvatarArray: intitialUserAvatarArray,
  userAvatar: intitialUserAvatar,
  setUserAvatar: (avatar: string) => {},
  gamesPlayed: null,
});

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  // userAvatar
  const [userAvatarArray, setUserAvatarArray] = useState(
    intitialUserAvatarArray
  );
  const [userAvatar, setUserAvatar] = useState(intitialUserAvatar);

  // const [gamesPlayed, setGamesPlayed] = useState<GamePlayed[] | null>(null)
  const { authUser, setAuthUser } = useAuthUserStore();

  // const { data: userData } = useGetUserAuthData();

  const { data: authUserData, isLoading: isAuthUserDataLoading } = useQuery({
    queryKey: ["currentAuthUserData"],
    queryFn: async () => {
      const user = await fetchUserAttributes();
      return user;
    },
  });

  const { data: gamesPlayed, isLoading: isGamesPlayedLoading } = useQuery({
    queryKey: ["gamesPlayed"],
    queryFn: async () => {
      const token = await fetchAuthSession();
      const user = await fetchUserAttributes();

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/lumora/get-played-games/`,
          {
            email: user.email,
            userId: "",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token.tokens?.accessToken.toString(),
            },
          }
        );

        if (data.status) return null;

        return data as GamePlayed[];
      } catch (error) {
        return null;
      }
    },
    enabled: !!authUserData,
  });

  useEffect(() => {
    if (authUserData) {
      if (authUserData.image && authUserData.image !== "null") {
        setUserAvatar(authUserData.image);
      }
      setAuthUser(authUserData);
    } else {
      console.log("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserData]);

  // console.log(authUser);

  return (
    <>
      <GlobalContext.Provider
        value={{
          isAuthUserDataLoading,
          userAvatar,
          setUserAvatar,
          userAvatarArray,
          gamesPlayed,
        }}
      >
        {children}
      </GlobalContext.Provider>
    </>
  );
};

export default GlobalProvider;

// Create a custom hook for using the context
export function useGlobalContext() {
  return useContext(GlobalContext);
}
