"use client";
import React from "react";
import { useState, Dispatch, SetStateAction, useEffect, use } from "react";
import Image from "next/image";

import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);
import lottieJson from "@/lib//assets/animations/data.json";
import { useMediaQuery } from "usehooks-ts";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

import { themeColors } from "@/lib/theme";

import { useUserContext } from "@/store/userContext";
import { useGameContext } from "@/store/gameContext";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import useNutrientsStore from "@/lib/hooks/use-nutrients-store";
import { useGameStore } from "@/lib/hooks/use-game";
import { Question } from "@/types/game.types";

type cardSwipeDirection = "left" | "right";
type Props = {
  id?: number;
  data: Question;
  setCardDrivenProps: Dispatch<SetStateAction<any>>;
  setIsDragging: Dispatch<SetStateAction<any>>;
  isDragging: boolean;
  isLast: boolean;
  setIsDragOffBoundary: Dispatch<SetStateAction<any>>;
  setDirection: Dispatch<SetStateAction<any>>;
};

const GameCard = ({
  id,
  data,
  setCardDrivenProps,
  setIsDragging,
  isDragging,
  isLast,
  setIsDragOffBoundary,
  setDirection,
}: Props) => {
  const pathname = usePathname();
  const [user, setUser] = useUserContext();
  const { score, previousScore } = user;

  const { gamedata, setGameData } = useGameDataStore();
  const { game, setGame } = useGameStore();

  const updateNutrientsData = useNutrientsStore(
    (state) => state.updateNutrientsData
  );

  const { questions: cards } = gamedata;
  const cardsAmount = 10;

  const [imgLoadingComplete, setImgLoadingComplete] = useState(false);
  const hasScoreIncreased = previousScore !== score;

  const x = useMotionValue(0);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const scoreVariants = {
    initial: {
      y: 0,
    },
    pop: {
      y: [0, -15, -20, -15, 0],
    },
  };

  const offsetBoundary = 150;

  const inputX = [offsetBoundary * -1, 0, offsetBoundary];
  const outputX = [-200, 0, 200];
  const outputY = [50, 0, 50];
  const outputRotate = [-40, 0, 40];
  const outputActionScaleBadAnswer = [3, 1, 0.3];
  const outputActionScaleRightAnswer = [0.3, 1, 3];
  const outputMainBgColor = [
    ["Healthy", "Water", "Fiber", "Protein"].includes(game.Name)
      ? themeColors.gameSwipe.left
      : themeColors.gameSwipe.right,
    themeColors.gameSwipe.neutral,
    ["Healthy", "Water", "Fiber", "Protein"].includes(game.Name)
      ? themeColors.gameSwipe.right
      : ["Fat", "Carbs"].includes(game.Name)
      ? themeColors.gameSwipe.orange
      : themeColors.gameSwipe.left,
  ];

  let drivenX = useTransform(x, inputX, outputX);
  let drivenY = useTransform(x, inputX, outputY);
  let drivenRotation = useTransform(x, inputX, outputRotate);
  let drivenActionLeftScale = useTransform(
    x,
    inputX,
    outputActionScaleBadAnswer
  );
  let drivenActionRightScale = useTransform(
    x,
    inputX,
    outputActionScaleRightAnswer
  );
  // let drivenBg = useTransform(x, inputX, outputMainBgColor);
  let drivenBg = useTransform(x, [-20, 0, 20], outputMainBgColor);

  useMotionValueEvent(x, "change", (latest) => {
    //@ts-ignore
    setCardDrivenProps((state) => ({
      ...state,
      cardWrapperX: latest,
      buttonScaleBadAnswer: drivenActionLeftScale,
      buttonScaleGoodAnswer: drivenActionRightScale,
      mainBgColor: drivenBg,
    }));
  });

  return (
    <>
      <div
        id="metrics"
        className="  absolute -top-10 md:-top-10 flex w-full items-center gap-2 justify-between "
      >
        <div className="text-gray-500">
          <span className="text-xl  leading-none">{id}</span>
          <span className="text-xs  ml-1">
            /<span className="ml-[2px]">{cardsAmount}</span>
          </span>
        </div>
        <Progress value={id! * 10} className="shadow-sm" />
        <div id="score" className="flex relative">
          <div className="text-xl  text-grey-500 leading-none relative">
            <motion.div
              id="scoreValue"
              className="relative text-green-700"
              variants={scoreVariants}
              initial="initial"
              animate={isLast && hasScoreIncreased ? "pop" : "initial"}
              transition={{
                stiffness: 2000,
                damping: 5,
              }}
            >
              {score}
            </motion.div>
            {isLast && hasScoreIncreased && (
              <div
                id="sparks"
                className="absolute w-[100px] h-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2]"
              >
                <Player
                  autoplay
                  src={lottieJson}
                  style={{ width: "100%", height: "100%" }}
                  speed={2}
                ></Player>
              </div>
            )}
          </div>
          {/* <SvgIconScoreLeaf className="w-[30px] h-auto relative top-[-3px]" /> */}
        </div>
      </div>
      <motion.div
        id={`cardDrivenWrapper-${id}`}
        className="absolute  bg-white  rounded-lg text-center w-full aspect-[80/110] md:aspect-[120/150] lg:aspect-[75/95] pointer-events-none text-black origin-bottom shadow-card select-none border border-blue-200 shadow-md shadow-yellow-200"
        style={{
          y: drivenY,
          rotate: drivenRotation,
          x: drivenX,
        }}
      >
        <div id="illustration" className="w-full  aspect-square h-[80%] ">
          {/* <div
            id="imgPlaceholder"
            className="bg-gameSwipe-neutral absolute object-cover w-full h-full"
            style={{
              maskImage: `url('/images/gamecard-image-mask.png')`,
              WebkitMaskImage: `url(/images/gamecard-image-mask.png)`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          ></div> */}
          <Image
            priority
            className={` ${
              !imgLoadingComplete ? "opacity-100" : "opacity-0"
            } duration-500 ease-out w-full h-full rounded-t-lg`}
            src={data.options[0].image}
            width={500}
            height={500}
            alt=""
            // style={{
            //   maskImage: `url('/images/gamecard-image-mask.png')`,
            //   WebkitMaskImage: `url(/images/gamecard-image-mask.png)`,
            //   maskSize: "contain",
            //   WebkitMaskSize: "contain",
            //   maskRepeat: "no-repeat",
            //   WebkitMaskRepeat: "no-repeat",
            // }}
            // onLoadingComplete={(img) => setImgLoadingComplete(true)}
          />
        </div>
        <p id="affirmation" className="px-3 py-5 text-2xl leading-tight">
          {data.options[0].option}
        </p>
      </motion.div>

      <motion.div
        id={`cardDriverWrapper-${id}`}
        className={`absolute w-full aspect-[100/150] ${
          !isDragging ? "hover:cursor-grab" : ""
        }`}
        drag="x"
        dragSnapToOrigin
        dragElastic={isMobile ? 0.2 : 0.06}
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => {
          const offset = info.offset.x;

          if (offset < -30 && offset < offsetBoundary * -1) {
            setIsDragOffBoundary("left");
          } else if (offset > 30 && offset > offsetBoundary) {
            setIsDragOffBoundary("right");
          } else {
            setIsDragOffBoundary(null);
          }
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          setIsDragOffBoundary(null);
          const isOffBoundary =
            info.offset.x > offsetBoundary || info.offset.x < -offsetBoundary;

          if (isOffBoundary) {
            const direction = info.offset.x > 0 ? "right" : "left";
            setDirection(direction);
          }

          // if (isOffBoundary) {
          //   console.log("offboundru");
          //   setGame({
          //     ...game,
          //     cards: game.cards.slice(0, -1),
          //   });
          //   setUser({
          //     score: handleScore({
          //       direction,
          //       score,
          //       cards,
          //       updateNutrientsData,
          //     }),
          //     previousScore: score,
          //   });
          //   setSwipeDirection("");
          // }
        }}
        style={{ x }}
      ></motion.div>
    </>
  );
};

export default GameCard;
