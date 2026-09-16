"use client";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
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

  return (
    <div className="bg-[#faf8ff] border-b border-[#c8c5d0]/60 shadow-xs sticky top-0 z-50">
      <header className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
  );
};

export default Navbar;

