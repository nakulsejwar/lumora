"use client";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Link from "next/link";
import { signOut, FetchUserAttributesOutput } from "@/lib/utils/auth-service";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { AuthUser, useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import { LogInIcon, Search, Award, BookOpen, Settings, LogOut } from "lucide-react";
import Logo from "@/public/logo.svg";

interface NavbarProps { }

const Navbar: FC<NavbarProps> = () => {
  const router = useRouter();
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const pathname = usePathname();
  const { authUser, setAuthUser } = useAuthUserStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthUser({} as AuthUser);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast({
        title: (error as Error).message,
      });
    }
  };

  return (
    <div className="bg-[#faf8ff] border-b border-[#c8c5d0]/60 shadow-xs sticky top-0 z-50">
      <header className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* DESKTOP NAVBAR */}
        <nav
          className="hidden sm:flex items-center justify-between"
          aria-label="Global Navigation"
        >
          {/* Brand Logo & Lumora AI Bureau Badge */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white shadow-sm ring-1 ring-[#fe932c]/40">
                <Search className="w-5 h-5 text-[#fe932c]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#070235]">
                  Lumora AI
                </span>
                <span className="text-[10px] font-mono font-extrabold text-[#904d00] tracking-widest uppercase bg-[#fe932c]/15 px-2 py-0.5 rounded border border-[#fe932c]/30">
                  Reading Bureau
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6 ml-4">
              {authUser && Object.keys(authUser).length > 0 && (
                <Link
                  href="/courses"
                  className={cn(
                    "text-sm font-bold transition-colors pb-0.5",
                    pathname.startsWith("/courses")
                      ? "text-[#070235] border-b-2 border-[#fe932c]"
                      : "text-[#47464f] hover:text-[#070235]"
                  )}
                >
                  Reading Missions
                </Link>
              )}
              {authUser && Object.keys(authUser).length > 0 && (
                <Link
                  href="/score"
                  className={cn(
                    "text-sm font-bold transition-colors pb-0.5",
                    pathname === "/score"
                      ? "text-[#070235] border-b-2 border-[#fe932c]"
                      : "text-[#47464f] hover:text-[#070235]"
                  )}
                >
                  My Progress
                </Link>
              )}
              {authUser && Object.keys(authUser).length > 0 && (
                <Link
                  href="/library"
                  className={cn(
                    "text-sm font-bold transition-colors pb-0.5",
                    pathname.startsWith("/library")
                      ? "text-[#070235] border-b-2 border-[#fe932c]"
                      : "text-[#47464f] hover:text-[#070235]"
                  )}
                >
                  Lumora Library
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {authUser && Object.keys(authUser).length > 0 ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="px-3.5 py-1.5 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#070235] text-xs font-mono font-bold uppercase tracking-wider transition-all border border-[#c8c5d0]/60 flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-[#fe932c]" />
                  <span>Detective Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl bg-white border border-[#c8c5d0] hover:bg-[#ffdad6] hover:text-[#93000a] text-[#47464f] transition-all shadow-xs"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 border border-[#89ceff]/30"
              >
                <span>Sign In</span>
                <LogInIcon className="w-4 h-4 text-[#fe932c]" />
              </Link>
            )}
          </div>
        </nav>

        {/* MOBILE NAVBAR */}
        <div className="flex sm:hidden items-center justify-between w-full py-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#070235] flex items-center justify-center text-white">
              <Search className="w-4 h-4 text-[#fe932c]" />
            </div>
            <span className="text-base font-extrabold text-[#070235]">
              Lumora AI
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="text-xs font-bold text-[#070235] bg-[#eaedff] px-2.5 py-1 rounded-md"
            >
              Reading Missions
            </Link>
            {authUser && Object.keys(authUser).length > 0 ? (
              <button
                onClick={handleSignOut}
                className="text-xs font-bold text-[#ba1a1a]"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold text-white bg-[#070235] px-3 py-1 rounded-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;

