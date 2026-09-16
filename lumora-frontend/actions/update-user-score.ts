"use server";

import { getTokenServer } from "@/lib/utils/utils.server";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

interface ScorePayload {
  userId: string;
  gameId: string;
  score: number;
  totalQuestions: number;
  isComplete?: boolean;
}

export const updateUserScore = async (content: ScorePayload) => {
  const token = await getTokenServer();

  /*
   * Do not attempt to call the backend without an auth token.
   *
   * This prevents confusing 401/403 requests when the auth session
   * has not finished initializing.
   */
  if (!token) {
    console.warn("updateUserScore: no authentication token available");

    return {
      success: false,
      error: "Authentication token is unavailable",
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        "updateUserScore: NEXT_PUBLIC_API_URL is not configured"
      );

      return {
        success: false,
        error: "API URL is not configured",
      };
    }

    const endpoint = `${apiUrl}/lumora/set-user-score/`;

    const { data } = await axios.post(
      endpoint,
      JSON.stringify(content),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        /*
         * A score request should not hang the completion screen forever.
         */
        timeout: 15000,
      }
    );

    revalidatePath("/");
    revalidatePath("/score");

    return data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;

    /*
     * Log the REAL backend error instead of replacing it with
     * "Error fetching user data".
     *
     * This will make the next backend problem immediately visible
     * in the terminal.
     */
    if (axiosError.response) {
      console.error(
        "updateUserScore: backend request failed",
        {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data,
          url: axiosError.config?.url,
        }
      );

      return {
        success: false,
        error:
          typeof axiosError.response.data === "string"
            ? axiosError.response.data
            : axiosError.response.data?.detail ||
            axiosError.response.data?.error ||
            `Score update failed with status ${axiosError.response.status}`,
      };
    }

    if (axiosError.request) {
      console.error(
        "updateUserScore: backend did not respond",
        axiosError.message
      );

      return {
        success: false,
        error: "The score server did not respond.",
      };
    }

    console.error(
      "updateUserScore: request could not be created",
      axiosError.message
    );

    return {
      success: false,
      error: axiosError.message || "Unable to update score.",
    };
  }
};