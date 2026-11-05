import { useEffect, useRef } from "react";
import { useMusic } from "../../contexts/MusicContext";

const MusicSelector = ({ onClose }: { onClose: () => void }) => {
  const {
    isPlaying,
    play,
    pause,
    next,
    prev,
    volume,
    setVolume,
    currentTrack,
  } = useMusic();

  const popupRef = useRef<HTMLDivElement>(null);
  const togglePlay = () => (isPlaying ? pause() : play());

  // Close when clicking outside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      {/* Glowing corners */}
      <div className="relative" ref={popupRef}>
        <div className="absolute w-2 h-2 bg-white top-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white top-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white bottom-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white bottom-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />

        {/* Main Box */}
        <div className="bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] p-6 w-[90vw] max-w-md font-medievalsharp text-white relative space-y-6 rounded-md">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close music player"
            className="absolute top-2 right-2 hover:text-amber-300 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl "
          >
            ×
          </button>

          {/* Track Info */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-yellow-300">{currentTrack.title}</h2>
            <p className="text-lg italic text-gray-300">{currentTrack.artist}</p>
            <p className="text-sm text-gray-400">{currentTrack.license}</p>
            <a
              href={currentTrack.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline hover:text-yellow-300 transition"
            >
              Source & Attribution
            </a>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 text-3xl">
            <button
              onClick={prev}
              aria-label="Previous track"
              className="hover:text-yellow-400 transition"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="hover:text-yellow-400 transition"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={next}
              aria-label="Next track"
              className="hover:text-yellow-400 transition"
            >
              ⏭
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-yellow-400 text-xl">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicSelector;
