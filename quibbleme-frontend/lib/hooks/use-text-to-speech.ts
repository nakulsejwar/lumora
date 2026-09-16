"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseTextToSpeechReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore synthesis cancel errors
      }
    }
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!text || !text.trim()) return;

      stop();

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Slightly deliberate storytelling pace for reading clarity
        utterance.pitch = 1.0;
        utterance.lang = "en-US";

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceRef.current = null;
        };

        utterance.onerror = (e) => {
          console.warn("SpeechSynthesis error:", e);
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Failed to execute speechSynthesis.speak:", err);
        setIsSpeaking(false);
      }
    },
    [stop]
  );

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    stop,
  };
}
