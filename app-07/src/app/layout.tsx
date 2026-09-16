import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/header";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/providers/query-provider";
import { LoadingModal } from "@/components/modals/loading-modal";
import { Toaster } from "@/components/ui/sonner";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumora Admin",
  description: "Lumora Admin Portal",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={cn(inter.className, "antialiased min-h-screen bg-[#faf8ff] text-[#131b2e] selection:bg-[#fe932c]/30 font-sans")}>
          <QueryProvider>
            <Navbar />
            {children}
            <LoadingModal />

            <Toaster richColors position="top-right" duration={3000} />
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
