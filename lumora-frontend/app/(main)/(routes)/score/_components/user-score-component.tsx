"use client";

import { createUser } from "@/actions/create-user";
import { useGlobalContext } from "@/components/providers/GlobalProvider";
import { Button } from "@/components/ui/button";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { useNickNameModal } from "@/lib/hooks/use-nickname-modal";
import { getEmail, getToken } from "@/lib/utils/utils.client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserAttributes } from "@/lib/utils/auth-service";
import axios from "axios";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  BookOpen,
  Trophy,
  MessageSquare,
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import UserStreak from "./user-streak";
import SkillMasteryPanel from "@/app/(main)/_components/mastery/skill-mastery-panel";

function UserScoreComponent() {
  const queryclient = useQueryClient();
  const router = useRouter();
  const { authUser } = useAuthUserStore();
  const { userAvatar } = useGlobalContext();
  const nickNameModal = useNickNameModal();

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full animate-bounce bg-[#070235]" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-[#fe932c] [animation-delay:0.2s]" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-[#0091cf] [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  const topCourses = data?.top_courses?.filter((course: any) => course.course_name !== null) || [];

  return (
    <div className="flex min-h-screen w-full flex-col my-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* HEADER BANNER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaedff] border border-[#0091cf]/30 text-[#070235] text-xs font-mono font-extrabold uppercase tracking-widest mb-3">
          <Trophy className="w-3.5 h-3.5 text-[#fe932c]" />
          <span>LUMORA ACCOMPLISHMENTS • SCORE CARD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#070235]">
          YOUR SCORE & PROGRESS CARD<span className="text-[#fe932c]">.</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#47464f] max-w-md mx-auto font-medium">
          Track your earned XP points, daily reading streaks, and recent course missions.
        </p>
      </div>

      {data && data.userScore !== undefined ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* TOP METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STREAK CARD (Spans 2 cols on MD) */}
            <div className="md:col-span-2">
              <UserStreak data={userStreak} />
            </div>

            {/* TOTAL XP CARD */}
            <div className="bg-gradient-to-br from-[#070235] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-[#fe932c]/30">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-[#fe932c]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[#fe932c] bg-[#fe932c]/20 px-2.5 py-1 rounded-full border border-[#fe932c]/40">
                    TOTAL EXPERIENCE
                  </span>
                  <Zap className="w-5 h-5 text-[#fe932c] fill-[#fe932c]" />
                </div>
                <span className="text-xs font-mono text-[#89ceff] uppercase font-bold tracking-wider block mb-1">
                  XP POINTS EARNED
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {data.userScore} <span className="text-lg font-bold text-[#fe932c]">⚡</span>
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#89ceff]">
                <span>Rank Status</span>
                <span className="font-extrabold text-white uppercase">Master Reader</span>
              </div>
            </div>
          </div>

          {/* RECENT COURSES SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c8c5d0]/60 shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c8c5d0]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5 text-[#fe932c]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#070235] text-lg">Recent Courses & Missions</h3>
                  <p className="text-xs text-[#47464f]">Courses you have completed and earned XP scores from.</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#070235] bg-[#faf8ff] px-3 py-1 rounded-full border border-[#c8c5d0]/50">
                {topCourses.length} COURSES
              </span>
            </div>

            {topCourses.length > 0 ? (
              <div className="space-y-3">
                {topCourses.map((course: any) => (
                  <Link
                    key={course.courseId}
                    href={`/courses/${course.courseId}`}
                    className="block group"
                  >
                    <div className="p-4 rounded-2xl bg-[#faf8ff] hover:bg-[#eaedff] border border-[#c8c5d0]/50 hover:border-[#070235]/40 transition-all duration-200 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#070235]/10 text-[#070235] flex items-center justify-center font-bold text-xs group-hover:bg-[#070235] group-hover:text-white transition-colors">
                          <Gamepad2 className="w-4 h-4 text-[#fe932c]" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#070235] text-sm group-hover:text-[#0091cf] transition-colors">
                            {course.course_name}
                          </h4>
                          <span className="text-[11px] text-[#47464f] font-mono">
                            Course ID: #{course.courseId}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-sm font-extrabold text-[#070235] bg-white px-3 py-1 rounded-xl border border-[#c8c5d0]/50 shadow-2xs">
                          <span>{course.score}</span>
                          <span className="text-xs text-[#fe932c]">⚡</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#80757a] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-[#faf8ff] rounded-2xl border border-dashed border-[#c8c5d0]">
                <BookOpen className="w-10 h-10 text-[#c8c5d0] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#070235]">No Courses Completed Yet</h4>
                <p className="text-xs text-[#47464f] mt-1 mb-4">Start your first reading mission to earn XP points!</p>
                <Link href="/courses">
                  <Button size="sm" className="bg-[#070235] text-white font-extrabold text-xs rounded-xl">
                    Explore Reading Missions
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* ADAPTIVE SKILL ANALYSIS & ADAPTIVE LESSON GENERATOR */}
          <SkillMasteryPanel />

          {/* FOOTER ACTIONS BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/courses")}
              className="w-full sm:w-auto rounded-xl border-[#070235] text-[#070235] font-extrabold text-xs gap-2 shadow-xs py-5"
            >
              <ArrowLeft className="w-4 h-4 text-[#fe932c]" />
              <span>Back to Reading Missions</span>
            </Button>

            <Link href="/feedback" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-[#c8c5d0] text-[#070235] font-extrabold text-xs gap-2 shadow-xs py-5 hover:bg-[#faf8ff]"
              >
                <MessageSquare className="w-4 h-4 text-[#0091cf]" />
                <span>Submit App Feedback</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* WELCOME NEW USER STATE */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#c8c5d0]/60 shadow-xl max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#070235] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-8 h-8 text-[#fe932c]" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#070235] tracking-tight">
            Welcome, {authUser.name || "Detective"}!
          </h3>
          <p className="text-xs sm:text-sm text-[#47464f] mt-2 mb-6">
            Thank you for signing up for Lumora. Complete your first reading game mission to start earning XP points and building your streak!
          </p>
          <Link href="/courses">
            <Button className="w-full py-6 bg-[#070235] hover:bg-[#1e1b4b] text-white font-extrabold text-sm rounded-xl shadow-md">
              Start Reading Missions Now →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default UserScoreComponent;
