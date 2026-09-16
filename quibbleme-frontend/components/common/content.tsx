import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";

export function Content() {
  return (
    <BentoGrid className="max-w-4xl mx-3 lg:mx-auto my-5 ">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          // icon={item.icon}
          className={item.className}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-40 rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Expand Your Horizons",
    description:
      "Discover fascinating facts, explore new topics, and broaden your general knowledge. Our quizzes cover a vast array of subjects, ensuring there's always something to pique your interest.",
    header: <Skeleton />,
    className: "md:col-span-1",
    // icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Test Your Limits",
    description:
      "Challenge your brain with thought-provoking questions that will push your knowledge to the edge. From easy to expert, we've got quizzes to suit every skill level.",
    header: <Skeleton />,
    className: "md:col-span-1",
    // icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Unwind and Have Fun",
    description:
      "Take a break from the daily grind and enjoy a relaxing yet stimulating experience. Our quizzes are designed to be entertaining and enjoyable, while also giving your brain a workout.",
    header: <Skeleton />,
    className: "md:col-span-1",
    // icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
];

const b = ["$@1", ["2ndgCwAbU4vatuvB6Tqs3", null]];
const t = {
  success: true,
  bets: [
    {
      id: 86,
      bet_maker_address: "B5NzvxCcjydqGtqfH7AnmwAbSs4xe9rU1Ktxqhgj4ksH",
      maker_bet:
        "d5a689ed2f669582c2e8a02d470e668c:7431e07751348fa937f684136e8eab74",
      bet_taker_address: "A8C77q2RE1W6NpvuRcrKAumdCypQcAEC3t8VBswfVq7w",
      taker_bet: "Paper",
      bet_amount: "0.010000000",
      winner_address: "A8C77q2RE1W6NpvuRcrKAumdCypQcAEC3t8VBswfVq7w",
      is_maker: false,
    },
    {
      id: 55,
      bet_maker_address: "BiLCTDe2KphnuAN4Ja6rT5Pt73QyzP3HWboZdUoFygi3",
      maker_bet:
        "9c2f5ac159472392e2d488d72ed3decf:5c1a29bd7b26f53a8a7094cae63c6925",
      bet_taker_address: "A8C77q2RE1W6NpvuRcrKAumdCypQcAEC3t8VBswfVq7w",
      taker_bet: "Rock",
      bet_amount: "0.100000000",
      winner_address: "BiLCTDe2KphnuAN4Ja6rT5Pt73QyzP3HWboZdUoFygi3",
      is_maker: false,
    },
    {
      id: 79,
      bet_maker_address: "A8C77q2RE1W6NpvuRcrKAumdCypQcAEC3t8VBswfVq7w",
      maker_bet: "Paper",
      bet_taker_address: "CYbxZ8QvV5ZfyfcuvoF7arbEN8GkLSGrKDrtdecW2vag",
      taker_bet: "Rock",
      bet_amount: "0.020000000",
      winner_address: "A8C77q2RE1W6NpvuRcrKAumdCypQcAEC3t8VBswfVq7w",
      is_maker: true,
    },
    {
      id: 78,
      bet_maker_address: "4k2kmTcWwZyQKSAqAoX8v2iJMPL8CEWwDjPEpBXkaN2L",
      maker_bet:
        "1eb94b3a93dbaced51b0caf055b0da13:f2977dafa76376107bf8d20e01b5286e",
      bet_taker_address: "A8C77q2RE1W6NpvuRcrKAumdCypQcAEC3t8VBswfVq7w",
      taker_bet: "Rock",
      bet_amount: "0.010000000",
      winner_address: "DRAW",
      is_maker: false,
    },
  ],
};
