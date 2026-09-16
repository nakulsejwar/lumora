"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseReadingCheckReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  permissionDenied: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useReadingCheck(lang: string = "en-US"): UseReadingCheckReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef<boolean>(false);
  const restartAttemptsRef = useRef<number>(0);
  const finalTranscriptRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    restartAttemptsRef.current = 0;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore stop errors if already stopped
      }
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech Recognition isn't supported in this browser.");
      return;
    }

    stopListening();

    setError(null);
    setPermissionDenied(false);
    shouldListenRef.current = true;

    try {
      const instance = new SpeechRecognition();
      instance.continuous = true;
      instance.interimResults = true;
      instance.lang = lang;

      instance.onstart = () => {
        setIsListening(true);
        restartAttemptsRef.current = 0;
      };

      instance.onresult = (event: any) => {
        let interim = "";
        let finalStr = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0]?.transcript || "";
          if (res.isFinal) {
            finalStr += " " + text;
          } else {
            interim += " " + text;
          }
        }

        finalTranscriptRef.current = finalStr;
        setTranscript((finalStr + " " + interim).trim());
      };

      instance.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setPermissionDenied(true);
          setError("Microphone access is needed for Reading Check.");
          shouldListenRef.current = false;
          setIsListening(false);
        } else if (event.error === "network") {
          setError("Network issue detected during speech recognition.");
        }
      };

      instance.onend = () => {
        setIsListening(false);
        // If user wants to keep listening and it stopped unexpectedly (and not denied)
        if (shouldListenRef.current && !permissionDenied) {
          if (restartAttemptsRef.current < 3) {
            restartAttemptsRef.current += 1;
            setTimeout(() => {
              if (shouldListenRef.current) {
                try {
                  instance.start();
                } catch (e) {
                  // Ignore restart failures
                }
              }
            }, 300);
          }
        }
      };

      recognitionRef.current = instance;
      instance.start();
    } catch (err: any) {
      console.error("Failed to start SpeechRecognition:", err);
      setError("Could not start microphone listener.");
      setIsListening(false);
    }
  }, [lang, permissionDenied, stopListening]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    permissionDenied,
    startListening,
    stopListening,
    resetTranscript,
  };
}
