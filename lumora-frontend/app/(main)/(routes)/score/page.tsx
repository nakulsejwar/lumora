// import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import ScorePage from "./_components/score-page";
import { Suspense } from "react";
// This page always dynamically renders per request
export const dynamic = "force-dynamic";

export default async function page() {
  // console.log("authuserStore", useAuthUserStore.getState().authUser);
  return (
    <Suspense>
      <ScorePage />
    </Suspense>
  );
}
