import React, { useEffect, useRef } from "react";


interface ConfirmLeaveModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmLeaveModal: React.FC<ConfirmLeaveModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 font-medievalsharp">
      {/* Glowing corners */}
      <div className="relative" ref={modalRef}>
        <div className="absolute w-2 h-2 bg-white top-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white top-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white bottom-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white bottom-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />

        {/* Main Box */}
        <div className=" bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] p-6 w-[90vw] max-w-md text-white relative space-y-6 rounded-md">
          <h2 className="text-2xl text-yellow-300 font-bold text-center">
            Leave the Game?
          </h2>

          <p className="text-center text-lg text-gray-300">
            Are you sure you want to leave the game?
          </p>

          <div className="flex justify-center gap-6 pt-4">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold shadow-md"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLeaveModal;
