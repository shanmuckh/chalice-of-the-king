import Typewriter from 'typewriter-effect';
import type { ActionMessage } from '../../../../shared/types/types';

const EventAreaTutorial = ({
  actionMessage,
}: {
  actionMessage: ActionMessage;
}) => {

    const imagePath = "/game_scenes/player1_scenes/lives.webp"
    const message = actionMessage.result ?? '';

  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={imagePath}
        alt="event"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute p-4 w-full bottom-0">
        <div className="relative  bg-[#2a2a2a] border-[6px] border-[#363636] p-2 shadow-[inset_0_0_8px_#000] text-3xl font-medievalsharp h-[130px] w-full text-white px-4 flex items-center z-10">
          {/* ✨ Glowing Corners */}
        <div className="absolute w-2 h-2 bg-white top-0 left-0 shadow-[0_0_6px_#ffffff]"></div>
        <div className="absolute w-2 h-2 bg-white top-0 right-0 shadow-[0_0_6px_#ffffff]"></div>
        <div className="absolute w-2 h-2 bg-white bottom-0 left-0 shadow-[0_0_6px_#ffffff]"></div>
        <div className="absolute w-2 h-2 bg-white bottom-0 right-0 shadow-[0_0_6px_#ffffff]"></div>

          <Typewriter
            options={{
              strings: [message],
              autoStart: true,
              loop: false,
              deleteSpeed: 99999999,
              delay: 30,
              cursor: "",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EventAreaTutorial;
