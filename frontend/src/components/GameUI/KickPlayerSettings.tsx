import { useEffect, useRef } from "react";
import { FaUserSlash } from "react-icons/fa";
import type { Player } from "../../../../shared/types/types";
import { useSocket } from "../../contexts/SocketContext";
import { kickPlayer } from "../../utils/socket";

type Props = {
  roomId: string;
  players: Player[];
  myPlayerId: string;
  hostId: string;
  onClose: () => void;
};

const KickPlayerSettings = ({ roomId, players, myPlayerId, hostId, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {socket} = useSocket()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

    function handleKick(targetPlayerId : string) {
      if(roomId) kickPlayer(socket, roomId, targetPlayerId)
    }

  // Only host should see this modal
  if (myPlayerId !== hostId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] max-w-2xl w-full mx-4 bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] p-6 font-medievalsharp overflow-y-auto custom-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-2xl hover:text-yellow-300"
          aria-label="Close Kick Player Settings"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">
          Kick Players
        </h2>

        {/* Player List */}
        <ul className="space-y-6 px-4 lg:w-[70%] mx-auto text-white text-lg font-cinzel">
          {players
            .filter((player) => player.id !== hostId)
            .map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between gap-4"
              >
                <span>{player.name}</span>
                <button
                  onClick={()=> handleKick(player.id)}
                  className="text-red-500 hover:text-red-700 text-xl"
                  aria-label={`Kick ${player.name}`}
                  title={`Kick ${player.name}`}
                >
                  <FaUserSlash />
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default KickPlayerSettings;
