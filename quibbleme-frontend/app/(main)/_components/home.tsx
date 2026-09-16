"use client";
import { getEmail, getToken } from "@/lib/utils/utils.client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LevelsComponent from "@/components/levels/levels-component";

function Home() {
  const [tab, setActiveTab] = useState("stake");
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

  const { data: coursesData, isLoading: isCoursesDataLoading } = useQuery({
    queryKey: ["coursesData"],
    queryFn: async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
            ? `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-journey-data-main/`
            : `${process.env.NEXT_PUBLIC_API_URL}/lumora/fetch-journey-data/`;

        const { data } = await axios.get(
          apiUrl,

          {
            headers: {
              "Content-Type": "application/json",
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

  if (isLoading || isCoursesDataLoading) {
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
    <div className="flex min-h-screen w-full flex-col  max-w-5xl mx-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs
            defaultValue={coursesData[0].related_topics[0].topic_id}
            onValueChange={setActiveTab}
          >
            <div className="flex items-center">
              <TabsList>
                {coursesData[0].related_topics?.map((item: any) => (
                  <TabsTrigger key={item.topic_id} value={item.topic_id}>
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {coursesData[0].related_topics?.map((item: any) => (
              <TabsContent key={item.topic_id} value={item.topic_id}>
                <LevelsComponent data={item} />
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default Home;
