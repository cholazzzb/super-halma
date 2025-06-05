import { useEffect, useRef, useState } from "react";

import { backsound1, backsound2, backsound3, backsound4 } from "@/data/music";
import { logger } from "../logger";

const tracks = [backsound1, backsound2, backsound3, backsound4];

export function useMusicPlayer() {
  const audioRef = useRef(new Audio());
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Get a new random index that's not the current one
  const getNextRandomIndex = (excludeIndex: number) => {
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * tracks.length);
    } while (newIndex === excludeIndex);
    return newIndex;
  };

  // Play a track at a given index
  const playTrack = async (index: number) => {
    const audio = audioRef.current;
    audio.src = tracks[index];
    audio.load();
    await audio.play().catch(logger.warn);
    setCurrentIndex(index);
  };

  // Initial autoplay when component mounts
  useEffect(() => {
    const handleEnded = () => {
      const nextIndex = getNextRandomIndex(currentIndex);
      playTrack(nextIndex);
    };

    const audio = audioRef.current;
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  const play = async () => {
    try {
      const firstTrackIndex = Math.floor(Math.random() * tracks.length);
      await playTrack(firstTrackIndex);
    } catch (error) {
      logger.error(`failed to play backsound ${error}`);
    }
  };

  return { play };
}
