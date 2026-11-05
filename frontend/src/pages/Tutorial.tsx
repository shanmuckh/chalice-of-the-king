import { useState } from "react";
import type { ActionMessage } from "../../../shared/types/types";
import { tutorialGameState } from "../data/tutorial";
import PlayingAreaTutorial from "../components/TutorialUI/PlayingAreaTutorial";
import EventAreaTutorial from "../components/TutorialUI/EventAreaTutorial";
import { useTour } from "../hooks/useTour";
import { useNavigate } from "react-router-dom";


function Tutorial() {

  const game = tutorialGameState;
  const actionMessage: ActionMessage = {
    type: 'turn',
    userId: tutorialGameState.players[tutorialGameState.activePlayerIndex].id,
    result: `It is your turn`,
};

  const [canDrink, setCanDrink] = useState<boolean>(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEndTutorial, setShowEndTutorial] = useState(false);

  const handleStepChange = (stepId: string) => {
    if (stepId === 'mobile-event-area-intro') {
      setCanDrink(false);
    } else {
      setCanDrink(true);
    }
  };
  
  const handleTourComplete = () => {
    setShowEndTutorial(true);
  };

  const { startTour } = useTour({ onStepChange: handleStepChange, onComplete: handleTourComplete, });

  const handleStart = () => {
      localStorage.setItem("tutorialSeen", "yes");
      setShowWelcome(false);
      startTour();
      
  };





  return (
<div className="flex w-full h-screen bg-black text-white">
  {showWelcome && <WelcomePopup  onStart={handleStart} />}
  {showEndTutorial && <EndTutorial />}

  {/* Game Scene Panel (Left side on desktop, full screen on mobile when allowed) */}
  <div
    className={`
      relative bg-table-pattern
      ${canDrink  ? 'block w-full' : 'hidden'} 
      lg:block 
      lg:w-[60%]
    `}
  >
    {game && game.players  && (
      <PlayingAreaTutorial
        currentPlayerId={game.players[game.activePlayerIndex].id}
        canDrink={canDrink}
        myPlayerId={game.players[0].id}
        players={game.players}
      />
    )}
  </div>

  {/* Event Log Panel (Right side on desktop, full screen on mobile when not drinking/stealing) */}
  <div
    className={`
      overflow-y-auto bg-zinc-900 border-l border-gray-700
      ${!canDrink ? 'block w-full' : 'hidden'}
      lg:block 
      lg:w-[40%]
    `}
  >
    {game && actionMessage && (
      <EventAreaTutorial actionMessage={actionMessage} />
    )}
  </div>
</div>

  );
}

export default Tutorial;

type WelcomePopupProps = {
  onStart: () => void;
};


const WelcomePopup = ({ onStart }: WelcomePopupProps) => {

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
            Behold, a New Challenger!
          </h1>

          {/* Description */}
          <p className="text-lg text-center text-gray-300">
            You've bravely (or foolishly) stepped into the King's court. Prepare for deception, fate, and perhaps a quick, embarrassing exit. Let's see if you've got what it takes.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onStart}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200"
            >
              Enter the Court
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EndTutorial = () => {
  const navigate = useNavigate();
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
          <h1 className="text-5xl md:text-6xl text-center font-bold text-green-400 drop-shadow-[0_0_12px_#00ff9f]">
            You Survived... The Tutorial!
          </h1>

          {/* Description */}
          <p className="text-lg text-center text-gray-300">
            Congratulations! You've navigated my brilliant tutorial. Now, go prove you can do it when it actually counts. Don't disappoint me in front of the King.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => navigate('/singleplayer')}
              className="bg-green-400 hover:bg-green-500 text-black font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200"
            >
              Begin My Reign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
