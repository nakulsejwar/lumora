import { getGames } from "@/app/api/games.api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Home from "../../_components/home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Home />
      </HydrationBoundary>
    </>
  );
}
