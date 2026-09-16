"use client";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogInIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import Image from "next/image";

import { useAuthUserStore } from "@/lib/hooks/use-auth-user";

interface NavbarProps {}

const PublicHeader: FC<NavbarProps> = ({}) => {
  const pathname = usePathname();
  const { authUser } = useAuthUserStore();

  return (
    <div className={cn("bg-white shadow-sm")}>
      <header className="sticky inset-x-0 top-0 z-50  flex flex-col max-w-7xl mx-auto">
        <nav
          className="flex items-center justify-between px-4 py-2 lg:px-8  "
          aria-label="Global"
        >
          <div className="flex">
            <Link href="/" className="">
              {/* MOBILE LOGO (small) */}
              <Image
                src="logo.svg"
                width={100}
                height={100}
                className="sm:hidden w-6 h-6"
                alt=""
              />

              {/* DESKTOP LOGO (bigger – text removed) */}
              <Image
                src="logo.svg"
                width={150}
                height={150}
                className="hidden sm:block w-10 h-10 md:w-14 md:h-14"
                alt="Lumora"
              />
            </Link>
          </div>

          <div className="flex items-center justify-center ">
            <span className="sr-only">What&apos;s hot</span>
            <Link href="/courses" className="">
              <button
                className="animate-fade-up custom-gradient-text text-transparent font-bold  text-xl "
                style={{
                  animationDelay: "0.15s",
                  animationFillMode: "forwards",
                }}
              >
                What&apos;s hot
              </button>
              🔥
            </Link>
          </div>

          <div className=" flex items-center justify-end">
            <div className="flex items-center gap-6">
              {(!authUser || Object.keys(authUser).length === 0) ? (
                <Link
                  href="/login"
                  className={cn(
                    pathname === "/login" ? "hidden" : "flex items-center gap-1 "
                  )}
                >
                  <LogInIcon className="w-5 h-5 text-blue-600/60 md:hidden" />
                  <button className="hidden md:block w-full bg-gradient-to-br py-1 px-5 from-cyan-400 via-blue-500 to-cyan-500 text-white  rounded-full text-sm hover:scale-105 active:scale-100">
                    Sign In
                  </button>
                </Link>
              ) : (
                <Link href="/courses">
                  <button className="hidden md:block w-full bg-gradient-to-br py-1 px-5 from-blue-500 via-orange-500 to-blue-700 text-white  rounded-full text-sm hover:scale-105 active:scale-100">
                    Go to App
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default PublicHeader;
