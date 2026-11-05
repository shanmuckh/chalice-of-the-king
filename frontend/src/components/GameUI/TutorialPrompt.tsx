type TutorialPrompt = {
  onStart: () => void;
  onCancel: () => void;
};


const TutorialPrompt = ({ onStart, onCancel }: TutorialPrompt) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-medievalsharp">
      {/* Background blur and dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Content Wrapper */}
      <div className="relative z-10 max-w-2xl w-full mx-4">
        {/* Glowing Corner Decorations */}
        <div className="z-20 absolute top-0 left-0 w-3 h-3 bg-white shadow-[0_0_6px_#ffffff]" />
        <div className="z-20 absolute top-0 right-0 w-3 h-3 bg-white shadow-[0_0_6px_#ffffff]" />
        <div className="z-20 absolute bottom-0 left-0 w-3 h-3 bg-white shadow-[0_0_6px_#ffffff]" />
        <div className="z-20 absolute bottom-0 right-0 w-3 h-3 bg-white shadow-[0_0_6px_#ffffff]" />

        {/* Popup Box */}
        <div className="bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] px-8 py-6 text-gray-200 space-y-6 relative">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl text-center font-bold text-yellow-400 drop-shadow-[0_0_12px_#d4af37]">
            A Royal Decree?
          </h1>

          {/* Description */}
          <p className="text-lg text-center text-gray-300">
            Before you face the King's game, would you like a quick tour of the court? Or do you already fancy yourself a master of deception?
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
                onClick={onCancel}
                className="ml-4 bg-gray-700 hover:bg-gray-600 text-white font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200"
            >
              I Know My Fate
            </button>
            <button
              onClick={onStart}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200"
            >
              Show Me the Ropes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPrompt