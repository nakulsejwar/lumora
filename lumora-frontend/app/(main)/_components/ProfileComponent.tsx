"use client";

import React, { useState } from "react";
import { useGlobalContext } from "@/components/providers/GlobalProvider";
import { getToken } from "@/lib/utils/utils.client";
import { Avatar } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  Camera,
  Trophy,
  BookOpen,
  Compass,
  Copy,
  Check,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileComponent = () => {
  const { userAvatar, setUserAvatar, userAvatarArray } = useGlobalContext();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUserStore();
  const [selectedAvatar, setSelectedAvatar] = useState(authUser.image || userAvatar);

  const { toast } = useToast();
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (authUser?.email) {
      navigator.clipboard.writeText(authUser.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Email Copied to Clipboard!",
      });
    }
  };

  const handleAvatarChange = async () => {
    try {
      const token = await getToken();
      const link = `${process.env.NEXT_PUBLIC_API_URL}/lumora/`;
      const response = await fetch(link + "set-user-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          email: authUser.email,
          username: authUser.name,
          image: selectedAvatar,
        }),
      });

      const json = await response.json();

      if (json["Notification-text"] === "failed") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please try again later!",
        });
      } else {
        setUserAvatar(selectedAvatar!);
        toast({
          title: json["Notification-text"] || "Avatar updated successfully!",
        });
        queryClient.invalidateQueries({
          queryKey: ["currentAuthUserData"],
        });
        setAvatarModalIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not update avatar. Please try again.",
      });
    }
  };

  if (authUser && Object.keys(authUser).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full animate-bounce bg-[#070235]" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-[#fe932c] [animation-delay:0.2s]" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-[#0091cf] [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  const currentImage = authUser.image || userAvatar || "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070235] text-[#89ceff] text-xs font-mono font-extrabold uppercase tracking-widest shadow-xs mb-3 border border-[#0091cf]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
          <span>LUMORA BUREAU • DETECTIVE PROFILE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#070235]">
          ACCOUNT PROFILE & PREFERENCES<span className="text-[#fe932c]">.</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#47464f] max-w-md mx-auto font-medium">
          Manage your reader avatar, identity credentials, and reading statistics.
        </p>
      </div>

      {/* PROFILE CARD HERO */}
      <div className="bg-white rounded-3xl border border-[#c8c5d0]/60 shadow-xl overflow-hidden mb-8">
        {/* Top Decorative Gradient Cover */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-[#0091cf] relative p-6 flex items-end justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#fe932c_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <span className="relative z-10 text-[10px] font-mono font-extrabold text-[#fe932c] uppercase tracking-widest bg-[#070235]/80 px-3 py-1 rounded-full border border-[#fe932c]/40 backdrop-blur-xs">
            STATUS: ACTIVE DETECTIVE
          </span>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 sm:px-10 pb-8 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar Container with Pulse Glow */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#fe932c] to-[#0091cf] blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300" />
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-[#070235] overflow-hidden shadow-2xl flex items-center justify-center">
                <Image
                  src={currentImage}
                  alt={authUser.name || "User Avatar"}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatar(currentImage);
                  setAvatarModalIsOpen(true);
                }}
                className="absolute bottom-1 right-1 bg-[#070235] hover:bg-[#1e1b4b] text-[#fe932c] p-2.5 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/score" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-[#070235] text-[#070235] font-extrabold text-xs gap-2 shadow-xs"
                >
                  <Trophy className="w-4 h-4 text-[#fe932c]" />
                  <span>View Score Card</span>
                </Button>
              </Link>
              <Link href="/courses" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white font-extrabold text-xs gap-2 shadow-xs">
                  <Compass className="w-4 h-4 text-[#89ceff]" />
                  <span>Missions</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* User Name & Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#070235] tracking-tight">
              {authUser.name || "Reader Detective"}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-[#47464f]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#faf8ff] border border-[#c8c5d0]/50 font-medium">
                <Mail className="w-3.5 h-3.5 text-[#0091cf]" />
                <span>{authUser.email}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#fe932c]/10 text-[#904d00] font-mono font-bold uppercase border border-[#fe932c]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#fe932c]" />
                <span>VERIFIED ACCOUNT</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Account Details Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c8c5d0]/60 shadow-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c8c5d0]/40">
            <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
              <User className="w-5 h-5 text-[#fe932c]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#070235] text-base">Account Identity</h3>
              <p className="text-xs text-[#47464f]">Your registered user profile credentials.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#47464f] mb-1">
                Display Name
              </label>
              <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#c8c5d0]/50 text-sm font-bold text-[#070235] flex items-center justify-between">
                <span>{authUser.name}</span>
                <User className="w-4 h-4 text-[#80757a]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#47464f] mb-1">
                Email Address
              </label>
              <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#c8c5d0]/50 text-sm font-medium text-[#070235] flex items-center justify-between">
                <span className="truncate mr-2">{authUser.email}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg hover:bg-white text-[#070235] transition-colors cursor-pointer shrink-0"
                  title="Copy Email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#47464f]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#47464f] mb-1">
                Auth Method
              </label>
              <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#c8c5d0]/50 text-xs font-mono font-bold text-[#070235] uppercase flex items-center justify-between">
                <span>{authUser.provider || "Lumora Secure Auth"}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bureau Accomplishments Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c8c5d0]/60 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c8c5d0]/40">
              <div className="w-10 h-10 rounded-xl bg-[#0091cf]/15 flex items-center justify-center text-[#0091cf]">
                <Trophy className="w-5 h-5 text-[#0091cf]" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#070235] text-base">Reading Quick Stats</h3>
                <p className="text-xs text-[#47464f]">Your score rank and active achievements.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-[#070235]/5 border border-[#070235]/10 text-center">
                <span className="text-[10px] font-mono font-bold uppercase text-[#47464f] block mb-1">
                  CURRENT RANK
                </span>
                <span className="text-sm font-extrabold text-[#070235]">Reading Detective</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#fe932c]/10 border border-[#fe932c]/20 text-center">
                <span className="text-[10px] font-mono font-bold uppercase text-[#904d00] block mb-1">
                  AVATAR STYLE
                </span>
                <span className="text-sm font-extrabold text-[#070235]">Custom</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedAvatar(currentImage);
                setAvatarModalIsOpen(true);
              }}
              className="w-full py-5 rounded-xl border-[#070235] text-[#070235] font-extrabold text-xs flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#fe932c]" />
              <span>Change Reader Avatar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTION MODAL */}
      <AnimatePresence>
        {avatarModalIsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070235]/70 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#c8c5d0]/70 relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c8c5d0]/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
                    <Camera className="w-5 h-5 text-[#fe932c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#070235]">Select Reader Avatar</h3>
                    <p className="text-xs text-[#47464f]">Choose an avatar to represent your profile.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAvatarModalIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-[#faf8ff] text-[#47464f] hover:text-[#070235] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8 max-h-64 overflow-y-auto p-2">
                {userAvatarArray.map((item: Avatar) => {
                  const isSelected = selectedAvatar === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAvatar(item.url)}
                      className={`relative rounded-2xl p-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                        isSelected
                          ? "bg-[#070235] ring-4 ring-[#fe932c] scale-105 shadow-md"
                          : "bg-[#faf8ff] hover:bg-[#eaedff] border border-[#c8c5d0]/40"
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt="Avatar Option"
                        width={80}
                        height={80}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#fe932c] text-[#070235] flex items-center justify-center font-bold text-xs shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c8c5d0]/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAvatarModalIsOpen(false);
                    setSelectedAvatar(currentImage);
                  }}
                  className="px-6 py-2.5 rounded-xl border-[#c8c5d0] text-[#070235] font-extrabold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAvatarChange}
                  className="px-8 py-2.5 rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white font-extrabold text-xs shadow-md"
                >
                  Save Avatar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileComponent;
