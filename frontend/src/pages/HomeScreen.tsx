import { useState } from "react";
import { useSound } from "../hooks/sound";
import MusicSelector from "../components/GameUI/MusicSelector";
import { GiMusicalNotes } from "react-icons/gi";


const HomeScreen = ({ onSelect }: { onSelect: (mode: string) => void }) => {
  const playSelectSound = useSound("/sounds/select.wav");
  const [showMusicPopup, setShowMusicPopup] = useState(false); // track toggle

  return (
    <div className="relative w-full h-screen bg-black text-white font-cinzel overflow-hidden">
      {/* Background Image */}
      <img
        src="/game_ui/homescreen.jpg"
        alt="Game Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay for dimming */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Music Toggle Button */}
      {/* Floating Music Button */}
      <button
        onClick={() => setShowMusicPopup(true)}
        className="absolute top-4 right-4 z-40 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
        title="Music Player"
      >
        <GiMusicalNotes />
      </button>

      {showMusicPopup && <MusicSelector onClose={() => setShowMusicPopup(false)} />}

      {/* Menu */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full gap-6 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-medievalsharp font-bold text-yellow-400 drop-shadow-[0_0_12px_#d4af37] mb-6">
          Chalice of the King
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {["Single Player", "Multi Player", "How to Play", "Lore", "Credits"].map((label) => (
            <button
              key={label}
              onClick={() => {
                if(label === "Single Player" || label === "Multi Player") {
                  stop(); 
                }
                playSelectSound();
                onSelect(label);
              }}
              className="text-white text-[28px] hover:text-yellow-400 transition-all duration-200 tracking-wide"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
