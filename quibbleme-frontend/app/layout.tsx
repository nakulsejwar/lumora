import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import ToastProvider from "@/components/providers/toast-provider";
import RootLayoutThatConfiguresAmplifyOnTheClient from "@/components/providers/AmplifyProvider";
import GlobalProvider from "@/components/providers/GlobalProvider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import { LoadingModal } from "@/components/modals/loading-modal";
import GoogleAdsense from "@/components/google-adsense";
import { Plus_Jakarta_Sans, Literata } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lumora.app/"),
  openGraph: {
    title: "Lumora",
    description: "AI Adaptive Reading Coach",
    url: "https://www.lumora.app",
    siteName: "Lumora",
    images: [
      {
        url: "/images/logo.svg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumora",
    description: "AI Adaptive Reading Coach",
    creator: "@lumoraapp",
    images: {
      url: "/images/logo.svg",
      alt: "Lumora",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${literata.variable}`}>
      <body className={`${plusJakarta.className} font-sans bg-[#faf8ff] text-[#131b2e] antialiased min-h-screen`}>
        <RootLayoutThatConfiguresAmplifyOnTheClient>
          <TanstackProvider>
            <GlobalProvider>
              <ToastProvider>
                {children}
                {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER ? (
                  <GoogleTagManager
                    gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}
                  />
                ) : null}
                <GoogleAdsense />
                <Toaster
                  position="top-center"
                  expand={false}
                  richColors
                  duration={1500}
                />
                <LoadingModal />
              </ToastProvider>
            </GlobalProvider>
          </TanstackProvider>
        </RootLayoutThatConfiguresAmplifyOnTheClient>
      </body>
    </html>
  );
}
