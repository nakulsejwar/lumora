"use client";
import React, { useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/types/draft";
interface ProgressProps {
  courseDetails: Course;
  setIsButtonDisabled: (isDisabled: boolean) => void;
}

function ProgressDiv({ courseDetails, setIsButtonDisabled }: ProgressProps) {
  const [progress, setProgress] = React.useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>(-1);

  useEffect(() => {
    if (progress > 0) return;
    setIsButtonDisabled(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const updateProgress = () => {
      if (startTimeRef.current !== null) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000; // elapsed time in seconds
        const newProgress = (elapsed / 30) * 100;

        if (newProgress >= 100) {
          setProgress(100);
          setIsButtonDisabled(false);
        } else {
          setProgress(newProgress);
          setTimeout(updateProgress, 100); // call updateProgress every 100ms
        }
      }
    };

    const timeoutId = setTimeout(updateProgress, 100);

    return () => clearTimeout(timeoutId);
    //eslint-disable-next-line
  }, [courseDetails]);

  return (
    <Progress value={progress} className="h-7 w-full absolute rounded-lg" />
  );
}

export default ProgressDiv;
