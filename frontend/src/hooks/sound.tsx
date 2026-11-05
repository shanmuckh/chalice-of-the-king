// hooks/useSound.ts
import { useRef } from "react";
import { Howl } from "howler";

export const useSound = (src: string) => {
  const soundRef = useRef<Howl | null>(null);

  if (!soundRef.current) {
    soundRef.current = new Howl({
      src: [src],
      volume: 1.0,
      preload: true,
    });
  }

  const play = () => {
    soundRef.current?.stop();
    soundRef.current?.play();
  };

  return play;
};

