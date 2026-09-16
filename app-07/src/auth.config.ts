import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username: credentials.email, 
              password: credentials.password 
            })
          });
          
          const user = await res.json();
          if (res.ok && user) {
            // Also fetch user info
            const meRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/me/", {
              headers: { "Authorization": `Bearer ${user.access}` }
            });
            const meData = await meRes.json();
            return {
              id: meData.user_id?.toString() || credentials.email,
              name: meData.name || credentials.email,
              email: credentials.email as string,
              token: user.access
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      }
    })
  ],
} satisfies NextAuthConfig;
