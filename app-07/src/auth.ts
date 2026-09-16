import Github from "next-auth/providers/github";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { validateUser } from "./data/validate-user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session as any).accessToken = token.accessToken;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
