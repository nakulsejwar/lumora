"use client";

import { createUser } from "@/actions/create-user";
import { fetchNextGame } from "@/app/api/games.api";
import { useGlobalContext } from "@/components/providers/GlobalProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { useNickNameModal } from "@/lib/hooks/use-nickname-modal";
import { getEmail, getToken } from "@/lib/utils/utils.client";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserAttributes } from "@/lib/utils/auth-service";
import axios from "axios";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserStreak from "./user-streak";

const calculateTotalScore = (data: any): number => {
  let totalScore = 0;
  Object.keys(data).forEach((key) => {
    totalScore += data[key].score;
  });
  return totalScore;
};

// Function to get all gameOrder values
const getAllGameOrders = (data: any): number[] => {
  const gameOrders = new Set<number>();
  Object.keys(data).forEach((key) => {
    gameOrders.add(data[key].game_order);
  });
  return Array.from(gameOrders).sort((a, b) => a - b);
};

// Function to find the next available game order
const findNextAvailableGameOrder = (data: any): number => {
  const allGameOrders = getAllGameOrders(data);
  const maxGameOrder = Math.max(...allGameOrders);
  return maxGameOrder + 1;
};

function UserScoreComponent() {
  const queryclient = useQueryClient();
  const router = useRouter();
  const { authUser } = useAuthUserStore();
  const { userAvatar } = useGlobalContext();
  const nickNameModal = useNickNameModal();
  const [tab, setActiveTab] = React.useState("stake");
  const { data, isLoading } = useQuery({
    queryKey: ["currentAuthUserScores"],
    queryFn: async () => {
      try {
        const token = await getToken();
        const userEmail = await getEmail();

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/lumora/get-user-score/`,
          JSON.stringify({
            userId: authUser.user_id,
            email: userEmail,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        return data;
      } catch (error) {
        // console.log("", error);
        return null;
      }
    },
    enabled: !!authUser && !!authUser.user_id,
  });

  const { data: userStreak, isLoading: isUserStreakLoading } = useQuery({
    queryKey: ["currentAuthUserStreak"],
    queryFn: async () => {
      try {
        const token = await getToken();
        const userEmail = await getEmail();

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/lumora/get-streak-data/`,
          {
            userId: authUser?.user_id,
          },
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
    enabled: !!authUser && !!authUser.user_id,
  });

  useEffect(() => {
    if (authUser && Object.keys(authUser).length !== 0) return;
    (async function checkUser() {
      try {
        const authUserData = await fetchUserAttributes();
        if (authUserData.identities) {
          const identities = JSON.parse(authUserData?.identities!);
          const userData = {
            email: authUserData.email,
            image: userAvatar,
            username: authUserData.name,
            provider: identities[0].providerName,
          };
          await createUser(JSON.stringify(userData));
        } else {
          const userData = {
            email: authUserData.email,
            image: userAvatar,
            username: authUserData.email?.split("@")[0],
            provider: "custom",
          };
          await createUser(JSON.stringify(userData));
        }
      } catch (error) {
        console.log("");
      }

      queryclient.invalidateQueries({ queryKey: ["currentAuthUserData"] });
    })();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      authUser &&
      Object.keys(authUser).length &&
      [`${authUser.email?.split("@")[0]}`, ""].includes(authUser?.name!)
    ) {
      nickNameModal.onOpen();
    }

    //eslint-disable-next-line
  }, [authUser]);

  if (
    (authUser && Object.keys(authUser).length === 0) ||
    isLoading ||
    isUserStreakLoading
  ) {
    return (
      <>
        <div className=" flex items-center justify-center gap-2 mt-20">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-200" />
        </div>
      </>
    );
  }

  return (
    <>
      {data && data.userScore ? (
        <div className="container p-2 max-w-md md:max-w-xl lg:max-w-4xl mx-auto sm:p-4 rounded-xl ">
          {/* {Object.keys(data).length < 8 && (
            <div className="text-xl font-semibold py-5 text-center">
              {" "}
              Games Played : {Object.keys(data).length}{" "}
              <span className="text-sm">/ 8</span>
            </div>
          )} */}
          <h1
            className="animate-fade-up custom-gradient  text-center font-display text-3xl font-bold  text-transparent   drop-shadow-sm [text-wrap:balance] md:!leading-[5rem]"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          >
            Your Score Card
          </h1>
          <div className="flex flex-col  gap-3 mt-5 w-full max-w-2xl mx-auto">
            <UserStreak data={userStreak} />
            <motion.div
              className="animate-fade-up custom-gradient-v2 rounded-lg p-[1px]  font-display text-sm md:text-base font-bold  w-full  max-w-xs mx-auto  drop-shadow-sm [text-wrap:balance] "
              style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            >
              <Card className="w-full border border-blue-200 max-w-xs">
                <CardContent className="flex justify-between !p-2">
                  <p className=" font-medium"> ⚡ Total XP :</p>
                  <p className="">{data.userScore}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <p className="flex items-ceneter justify-start w-full max-w-xs mx-auto mt-5">
            Recent Courses
          </p>
          <div className=" flex flex-col items-center gap-3">
            {data.top_courses
              .filter((course: any) => course.course_name !== null)
              .map((course: any) => (
                <div key={course.courseId} className="w-full max-w-xs mx-auto">
                  <Card className="border w-full border-blue-200 max-w-xs">
                    <CardContent className="flex items-center justify-between !p-2">
                      <Link href={`/courses/${course.courseId}`}>
                        <p className=" font-medium">{course.course_name}</p>
                      </Link>
                      <p className="flex items-center ">
                        {course.score} <span className="text-xs">⚡</span>{" "}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
          <div className="flex flex-col  md:mt-16 items-center">
            <Link
              href="/feedback"
              prefetch={false}
              id="Back to home"
              className="flex items-center justify-center w-full  mt-2 text-center  z-10"
              // onClick={() => clearStorage()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-square-heart mt-1 text-blue-600/60 "
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8" />
              </svg>
              <span>Feedback</span>
            </Link>
            <button
              // variant="link"
              // href="/courses"
              // prefetch={false}
              id="Back to home"
              className="flex items-center justify-center w-full  mt-2 text-center  z-10"
              onClick={() => router.push("/courses")}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </button>
          </div>
          {/* {data.length < 8 ? (
            <div className="flex flex-col items-center mt-5">
              <div className="flex items-center gap-5">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Link
                    href="/"
                    prefetch={false}
                    id="Back to home"
                    className="flex flex-col text-xs md:text-base items-center   z-10"
                  >
                    <Button
                      className={cn(
                        buttonVariants({ variant: "theme" }),
                        "rounded-full w-12 h-12   shadow-md"
                      )}
                    >
                      <ArrowLeft className="" />
                    </Button>

                    <span>
                      Back to <br className="md:hidden" />
                      home
                    </span>
                  </Link>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center text-xs md:text-base text-gray-600"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Button
                    onClick={() => handleNextGame(nextGameOrder!)}
                    id="Next challenge"
                    className={cn(
                      buttonVariants({ variant: "theme" }),
                      "rounded-full w-12 h-12   shadow-md"
                    )}
                  >
                    <ArrowRight className="" />
                  </Button>
                  Next
                  <br className="md:hidden" /> Game
                </motion.div>
              </div>
            </div>
          ) : (
            <div></div>
          )} */}
        </div>
      ) : (
        <div className="py-5">
          <div className="flex flex-col items-center">
            <h3 className="text-xl">Welcome {authUser.name}!</h3>
            <h3 className="md:text-lg"> Thank You for signing up!</h3>
            <p className="py-2">Get started with the games to earn points.</p>

            <Link href="/courses">
              <Button variant="theme">Play Now</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default UserScoreComponent;
