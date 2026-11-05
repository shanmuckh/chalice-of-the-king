import { useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { useVoiceChatContext } from "../../contexts/VoiceChatContext";
import type { Player } from "../../../../shared/types/types";

type Props = {
  players: Player[];
  myPlayerId: string;
  onClose: () => void;
};

const VoiceSettings = ({ players, myPlayerId, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { muteMap, setUserMuted, remoteVolume, setUserVolume } = useVoiceChatContext();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  if (!muteMap || Object.keys(muteMap).length === 0) return null;

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
          aria-label="Close Voice Settings"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 text-center">
          Voice Settings
        </h2>

        {/* Players List */}
        <ul className="space-y-6 px-4 lg:w-[70%] mx-auto">
          {players.map((player) => {
            const isMuted = muteMap[player.socketId] ?? false;
            const isMe = player.id === myPlayerId;
            const volume = remoteVolume[player.socketId] ?? 1;

            return (
              <li
                key={player.id}
                className="flex items-center justify-between gap-4 text-lg font-cinzel text-white"
              >
                <div className="flex items-center gap-3">
                  {/* Mute Button */}
                  {isMe ? (
                    <button
                      onClick={() => setUserMuted(player.socketId, !isMuted)}
                      className="text-green-400 hover:text-green-600"
                      aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                      title={isMuted ? "Unmute microphone" : "Mute microphone"}
                    >
                      {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                  ) : (
                    <button
                      onClick={() => setUserMuted(player.socketId, !isMuted)}
                      className="text-yellow-400 hover:text-yellow-600"
                      aria-label={isMuted ? "Unmute speaker" : "Mute speaker"}
                      title={isMuted ? "Unmute speaker" : "Mute speaker"}
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                  )}

                  {/* Player Name */}
                  <span className={isMe ? "text-green-400 font-semibold" : ""}>
                    {player.name}
                  </span>
                </div>

                {/* Volume Slider (only for others, but you can show for self too) */}
                {!isMe && (
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) =>
                      setUserVolume(player.socketId, parseFloat(e.target.value))
                    }
                    className="w-32 accent-yellow-400"
                    aria-label={`Volume control for ${player.name}`}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default VoiceSettings;
