import { createContext, useContext } from "react";
import { attributions } from "../data/attributions";

export type MusicContextType = {
  isPlaying: boolean;
  currentTrackIndex: number;
  volume: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  currentTrack: typeof attributions[0];
};

export const MusicContext = createContext<MusicContextType | undefined>(undefined);


export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
