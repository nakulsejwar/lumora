"use client";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Link from "next/link";
import { signOut, FetchUserAttributesOutput } from "@/lib/utils/auth-service";
import { toast } from "../ui/use-toast";
import { AuthUser, useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import {
  LogInIcon,
  Search,
  Award,
  BookOpen,
  LogOut,
  Compass,
  Flame,
  User,
  Sparkles,
} from "lucide-react";

interface NavbarProps { }

const Navbar: FC<NavbarProps> = () => {
  const router = useRouter();
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const pathname = usePathname();
  const { authUser, setAuthUser } = useAuthUserStore();

  const isLoggedIn = authUser && Object.keys(authUser).length > 0;

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

  // Mobile Bottom Navigation Tabs Definition
  const mobileNavItems = [
    {
      label: "Missions",
      href: "/courses",
      icon: Compass,
      isActive: pathname.startsWith("/courses"),
    },
    {
      label: "Library",
      href: "/library",
      icon: BookOpen,
      isActive: pathname.startsWith("/library"),
    },
    {
      label: "Progress",
      href: "/score",
      icon: Award,
      isActive: pathname === "/score",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
    },
  ];

  return (
    <>
      {/* STICKY TOP NAVBAR (DESKTOP & MOBILE HEADER) */}
      <div className="bg-[#faf8ff] border-b border-[#c8c5d0]/60 shadow-xs sticky top-0 z-50">
        <header className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          {/* DESKTOP NAVBAR */}
          <nav
            className="hidden sm:flex items-center justify-between"
            aria-label="Global Navigation"
          >
            {/* Brand Logo & Lumora AI Bureau Badge */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white shadow-sm ring-1 ring-[#fe932c]/40 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5 text-[#fe932c]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-[#070235]">
                    Lumora AI
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-6 ml-4">
                {isLoggedIn && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
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

          {/* MOBILE TOP HEADER */}
          <div className="flex sm:hidden items-center justify-between w-full py-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#070235] flex items-center justify-center text-white shadow-xs ring-1 ring-[#fe932c]/40">
                <Search className="w-4.5 h-4.5 text-[#fe932c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold leading-tight text-[#070235]">
                  Lumora AI
                </span>
                <span className="text-[9px] font-mono font-bold text-[#fe932c] uppercase tracking-widest">
                  Bureau
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#93000a] text-xs font-bold transition-all shadow-2xs border border-[#ffb4ab]/60"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-bold text-white bg-[#070235] px-3.5 py-1.5 rounded-xl shadow-xs border border-[#89ceff]/30 flex items-center gap-1.5"
                >
                  <span>Sign In</span>
                  <LogInIcon className="w-3.5 h-3.5 text-[#fe932c]" />
                </Link>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {isLoggedIn && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070235] text-white border-t border-[#fe932c]/30 shadow-2xl backdrop-blur-lg px-2 py-1.5">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {mobileNavItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px]",
                    item.isActive
                      ? "text-[#fe932c] font-extrabold scale-105"
                      : "text-[#c8c5d0] hover:text-white"
                  )}
                >
                  {/* Active Indicator Top Pill */}
                  {item.isActive && (
                    <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#fe932c] shadow-xs" />
                  )}
                  <div
                    className={cn(
                      "p-1 rounded-lg transition-colors",
                      item.isActive ? "bg-white/10" : "bg-transparent"
                    )}
                  >
                    <ItemIcon
                      className={cn(
                        "w-5 h-5 transition-transform",
                        item.isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"
                      )}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-tight uppercase mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
