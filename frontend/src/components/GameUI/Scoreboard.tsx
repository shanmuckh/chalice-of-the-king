import { useEffect, useRef } from "react";
import type { Score } from "../../../../shared/types/types";

type Props = {
  scoreChart: Score[];
  onClose: () => void;
};

const Scoreboard = ({ scoreChart, onClose }: Props) => {
  const sorted = [...scoreChart].sort((a, b) => b.score - a.score);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] max-w-3xl w-full mx-4 bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] p-6 font-medievalsharp overflow-y-auto custom-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-2xl hover:text-yellow-300"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 text-center">
          Scoreboard
        </h2>

        {/* Player List */}
        <ul className="space-y-4 px-4 lg:w-[70%] mx-auto mb-8">
          {sorted.map((scoreInfo: Score) => (
            <li
              key={scoreInfo.playerId}
              className="flex justify-between items-center pb-2 text-lg font-cinzel text-white"
            >
              <span className="text-xl">{scoreInfo.name}</span>
              <span className="text-yellow-300 font-bold text-xl">
                {scoreInfo.score}
              </span>
            </li>
          ))}
        </ul>

        {/* Scoring Rules */}
        <div className="bg-[#2a2a2a] border-[4px] border-[#363636] shadow-[inset_0_0_8px_#000] p-4 text-sm text-gray-300 space-y-3">
          <h3 className="text-yellow-200 font-semibold text-lg mb-2 text-center">
            Scoring System
          </h3>
          <ul className=" space-y-1">
            <li> 
              <span className="text-yellow-400 font-semibold">+5 </span> points for taking risk and drinking the goblet.
            </li>
            <li>
              <span className="text-yellow-400 font-semibold">+4</span> points for inflicting poison on an opponent.
            </li>
            <li>
              <span className="text-yellow-400 font-semibold">+5</span> points for each remaining health point after surviving a round.
            </li>
            <li>
              <span className="text-red-400 font-semibold">-10</span>  points for being the first player eliminated in a round.
            </li>
          </ul>
          <p className="text-center italic text-gray-400 mt-4">
            May the most cunning survivor win.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
