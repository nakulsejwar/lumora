import React from "react";
import { Progress } from "./ui/progress";
import Image from "next/image";

type Props = { finished: boolean };

const loadingTexts = [
  "Generating Course...",
  "Unleashing the power of curiosity...",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

const LoadingQuestions = () => {
  const [progress, setProgress] = React.useState(10);
  const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[70vw] md:w-[60vw] flex flex-col items-center">
      <Image
        src={"/assets/loading.gif"}
        width={200}
        height={200}
        alt="loading"
        unoptimized
      />
      {/* <Progress value={progress} className="w-full mt-4" /> */}
      <h1 className="mt-2 text-lg italic">
        We are generating a basic structure for your course. This might take a
        few seconds.
      </h1>
    </div>
  );
};

export default LoadingQuestions;
