"use client";

import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { getEmail, getToken } from "@/lib/utils/utils.client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { Suspense, useEffect } from "react";
import UserScoreComponent from "./user-score-component";
import useSessionStore from "@/lib/hooks/use-session-store";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { updateUserScore } from "@/actions/update-user-score";

function ScorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signupError = searchParams.get("error_description");

  if (signupError) {
    toast.error(signupError);
    router.push("/login");
  }
  const queryClient = useQueryClient();
  const { authUser, setAuthUser } = useAuthUserStore();
  const sessionData = useSessionStore((state) => state.sessionData);
  const clearSessionStorage = useSessionStore(
    (state) => state.clearSessionStorage
  );

  const { data, isLoading } = useQuery({
    queryKey: ["currentAuthUserData"],
    queryFn: async () => {
      try {
        const token = await getToken();

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/me/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        return data;
      } catch (error) {
        console.log("");
        return null;
      }
    },
  });

  const handleSendUserScore = async (content: any) => {
    try {
      const token = await getToken();
      const userEmail = await getEmail();

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/lumora/set-user-score/`,
        content,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      // console.log("data", data);

      return data;
    } catch (error) {
      console.log("");
      return null;
    }
  };

  useEffect(() => {
    if (data) {
      setAuthUser(data);
    } else {
      console.log("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (authUser && Object.keys(authUser).length > 0) {
      if (sessionData.length) {
        (async function revalidate() {
          for (const item of sessionData) {
            const data = {
              userId: authUser.user_id!,
              score: item.score!,
              gameId: item.gameid,
              totalQuestions: item.totalQuestions,
              isComplete: true,
            }; // Replace "session-id" with actual user session id
            await updateUserScore(data);
          }
        })();

        clearSessionStorage();
        queryClient.invalidateQueries({ queryKey: ["currentAuthUserScores"] });
      } else {
        console.log("");
      }
    }

    //eslint-disable-next-line
  }, [authUser]);

  return (
    <Suspense>
      <UserScoreComponent />
    </Suspense>
  );
}

export default ScorePage;
