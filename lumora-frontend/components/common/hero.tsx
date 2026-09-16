"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="z-10 w-full max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto p-5 md:p-10 xl:px-0">
      <h1
        className="animate-fade-up custom-gradient  text-center font-display text-3xl font-bold  text-transparent py-2 md:pt-7  drop-shadow-sm [text-wrap:balance] md:text-5xl xl:text-7xl  md:!leading-[3.5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        Ignite Your Curiosity
        <br />
        <span className="text-xl md:text-4xl xl:text-5xl">
          Discover. Learn. Enjoy.
        </span>
      </h1>

      <p
        className="animate-fade-up text-center text-gray-500 md:py-2  [text-wrap:balance] "
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        Hungry for knowledge? Craving a challenge? Look no further. We&apos;ve
        got a world of trivia, puzzles, and quizzes just waiting to be explored.
        Challenge yourself, learn something new, or just have a
        blast.
      </p>
      <div
        className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 "
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        <Link href="/courses">
          <motion.button
            className=" w-full custom-gradient-button py-1 px-5 md:!py-2 md:!px-8 text-white  rounded-full text-3xl md:text-5xl "
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.05 }}
          >
            Start Exploring
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
