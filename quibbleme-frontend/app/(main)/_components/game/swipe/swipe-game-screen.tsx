"use client";
import React from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import GameCards from "./game-cards";

const SwipeGameScreen = () => {
  const gameScreenVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 2, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
    },
  };

  return (
    <main className="min-h-screen h-full w-full mx-auto bg-gameSwipe-neutral">
      <AnimatePresence mode="wait">
        <motion.div
          key="swipeGameScreen"
          id="swipeGameScreen"
          variants={gameScreenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <GameCards />
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default SwipeGameScreen;
