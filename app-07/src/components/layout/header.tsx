"use client";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, BookOpen, Layers, Sparkles, User, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Icons } from "../icons";
import { navItems } from "@/constants/data";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const mobileNavItems = [
    {
      label: "Studio",
      href: "/",
      icon: Sparkles,
      isActive: pathname === "/",
    },
    {
      label: "Courses",
      href: "/my-courses",
      icon: Layers,
      isActive: pathname.startsWith("/my-courses"),
    },
    {
      label: "Books",
      href: "/library",
      icon: BookOpen,
      isActive: pathname.startsWith("/library"),
    },
    {
      label: "Create",
      href: "/create-course",
      icon: PlusCircle,
      isActive: pathname.startsWith("/create-course"),
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
      <div className="bg-[#faf8ff] border-b border-[#c8c5d0]/60 shadow-xs sticky top-0 z-50">
        <header className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          {/* Brand Logo & Lumora Studio Badge */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white shadow-sm ring-1 ring-[#fe932c]/40 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-[#fe932c]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#070235]">
                  Lumora<span className="text-[#fe932c]">.</span>
                </span>
                <span className="text-[10px] font-mono font-extrabold text-[#904d00] tracking-widest uppercase bg-[#fe932c]/15 px-2 py-0.5 rounded border border-[#fe932c]/30">
                  Course Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden sm:flex items-center gap-6 ml-4">
              <Link
                href="/"
                className={cn(
                  "text-sm font-bold transition-colors pb-0.5",
                  pathname === "/"
                    ? "text-[#070235] border-b-2 border-[#fe932c]"
                    : "text-[#47464f] hover:text-[#070235]"
                )}
              >
                Studio Home
              </Link>
              <Link
                href="/my-courses"
                className={cn(
                  "text-sm font-bold transition-colors pb-0.5",
                  pathname.startsWith("/my-courses")
                    ? "text-[#070235] border-b-2 border-[#fe932c]"
                    : "text-[#47464f] hover:text-[#070235]"
                )}
              >
                My Courses
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
                Books
              </Link>
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#070235] text-xs font-mono font-bold uppercase tracking-wider transition-all border border-[#c8c5d0]/60">
                      <Image
                        width={28}
                        height={28}
                        src={
                          session.user?.image
                            ? session.user?.image
                            : "https://zaplynimages.s3.eu-west-2.amazonaws.com/sponge_avatar_6.svg"
                        }
                        alt="Avatar"
                        className="w-7 h-7 rounded-lg ring-1 ring-[#070235]/20 object-cover"
                      />
                      <span className="hidden md:inline">{session.user?.name || "Instructor"}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 rounded-2xl bg-white border border-[#c8c5d0]/70 shadow-lg" align="end">
                    <div className="grid gap-1">
                      {navItems.map((item) => {
                        const ItemIcon = Icons[item.icon || "arrowRight"] || Layers;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            prefetch={false}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#070235] hover:bg-[#eaedff] rounded-xl transition-all"
                          >
                            <ItemIcon className="w-4 h-4 text-[#0091cf]" /> {item.title}
                          </Link>
                        );
                      })}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#93000a] hover:bg-[#ffdad6] rounded-xl transition-all w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-[#ba1a1a]" />
                        Logout
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-5 py-2 rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 border border-[#89ceff]/30"
              >
                <span>Sign In</span>
                <Sparkles className="w-4 h-4 text-[#fe932c]" />
              </Link>
            )}
          </div>
        </header>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {session && (
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
