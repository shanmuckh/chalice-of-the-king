import { useState, useRef } from "react";
import { attributions } from "../data/attributions";
import { MusicContext } from "../contexts/MusicContext";

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const soundRef = useRef<Howl | null>(null);

  const playTrack = (index: number = currentTrackIndex) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [attributions[index].path],
      loop: true,
      volume: volume,
      onend: () => {
        next();
      },
    });

    soundRef.current.play();
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const play = () => {
    if (!soundRef.current) {
      playTrack();
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    soundRef.current?.pause();
    setIsPlaying(false);
  };

  const next = () => {
    const nextIndex = (currentTrackIndex + 1) % attributions.length;
    playTrack(nextIndex);
  };

  const prev = () => {
    const prevIndex = (currentTrackIndex - 1 + attributions.length) % attributions.length;
    playTrack(prevIndex);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    soundRef.current?.volume(v);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrackIndex,
        volume,
        play,
        pause,
        next,
        prev,
        setVolume: changeVolume,
        currentTrack: attributions[currentTrackIndex] ?? attributions[0],
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
