import UserProvider from "@/store/userContext";
import { getUser } from "../api/user.api";

import { NickNameModal } from "@/components/modals/nick-name-modal";
import { SignUpModal } from "@/components/modals/sign-up-modal";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getEmailServer, getTokenServer } from "@/lib/utils/utils.server";
import axios from "axios";
import AdBanner from "@/components/google-ads-banner";
export const dynamic = "force-dynamic";
const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const user = await getUser();
  await queryClient.prefetchQuery({
    queryKey: ["currentAuthUserData"],
    queryFn: async () => {
      try {
        const token = await getTokenServer();

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

  await queryClient.prefetchQuery({
    queryKey: ["currentAuthUserScores"],
    queryFn: async () => {
      try {
        const token = await getTokenServer();
        const userEmail = await getEmailServer();

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/lumora/get-user-score/`,
          JSON.stringify({
            userId: "",
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
        console.log("error", (error as Error).message);
        return null;
      }
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProvider user={user}>
        <div className=" flex flex-col  w-full  min-h-screen overflow-hidden ">
          <aside className="min-h-screen w-full mx-auto ">{children}</aside>
          <div className="my-2 max-w-5xl mx-auto">
            <AdBanner
              dataAdFormat="auto"
              dataFullWidthResponsive={true}
              dataAdSlot="9824239573"
            />
          </div>

          <SignUpModal />

          <NickNameModal />
        </div>
      </UserProvider>
    </HydrationBoundary>
  );
};

export default MainLayout;
