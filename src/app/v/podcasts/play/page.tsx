"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const PlayPodcastPage = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const audioUrl = searchParams.get("audioUrl");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [script, setScript] = useState<
    { speaker: string; text: string; duration: number }[]
  >([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedScript = localStorage.getItem("script");
    if (storedScript) {
      setScript(JSON.parse(storedScript));
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("play", () => {
        const wordDurations = script.reduce((acc, item) => {
          const words = item.text.split(" ");
          const wordDuration = item.duration / words.length;
          words.forEach((word) => {
            acc.push({ word, duration: wordDuration });
          });
          return acc;
        }, [] as { word: string; duration: number }[]);

        let elapsed = 0;
        intervalRef.current = setInterval(() => {
          if (audio.paused || audio.ended) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return;
          }
          elapsed += 100;
          const currentWord = wordDurations[currentWordIndex];
          if (currentWord && elapsed >= currentWord.duration) {
            elapsed = 0;
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
          }
        }, 100);
      });

      audio.addEventListener("ended", () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setCurrentWordIndex(0);
      });
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("play", () => {});
        audioRef.current.removeEventListener("ended", () => {});
      }
    };
  }, [audioUrl, script, currentWordIndex]);

  const startPlayback = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const renderScript = () => {
    const wordDurations = script.reduce((acc, item) => {
      const words = item.text.split(" ");
      const wordDuration = item.duration / words.length;
      words.forEach((word) => {
        acc.push({ word, duration: wordDuration });
      });
      return acc;
    }, [] as { word: string; duration: number }[]);

    return wordDurations.map((wordObj, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: currentWordIndex === index ? 1 : 0.5 }}
        transition={{ duration: 0.1 }}
        style={{
          backgroundColor:
            currentWordIndex === index ? "yellow" : "transparent",
          display: "inline-block",
          marginRight: "4px",
        }}
      >
        {wordObj.word}
      </motion.span>
    ));
  };

  return (
    <div>
      <h1>{title}</h1>
      <div>{renderScript()}</div>
      <button onClick={startPlayback}>Play</button>
      <button onClick={pausePlayback}>Pause</button>
    </div>
  );
};

export default PlayPodcastPage;
