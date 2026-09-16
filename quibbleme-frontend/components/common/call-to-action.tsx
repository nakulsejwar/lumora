"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
export function CallToAction() {
  return (
    <div className="max-w-4xl mx-3 lg:mx-auto py-8 ">
      <p className="text-center py-1 text-lg">Ready to dive in?</p>
      <div
        className="mx-auto  flex animate-fade-up items-center justify-center  "
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        <Link href="/register">
          <motion.button
            className=" w-full custom-gradient-button py-1.5 px-6  text-white  rounded-full text-lg md:text-2xl "
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.05 }}
          >
            Let&apos;s go!
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
