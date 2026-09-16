import ProfileComponent from "@/app/(main)/_components/ProfileComponent";
import { Suspense } from "react";

// This page always dynamically renders per request
export const dynamic = "force-dynamic";

export default async function page() {
  return (
    <Suspense>
      <ProfileComponent />
    </Suspense>
  );
}
