import { useNavigate } from "react-router-dom";
import { useSound } from "../hooks/sound";

const Lore = () => {
  const navigate = useNavigate();
  const playSelectSound = useSound("/sounds/select.wav");
  
  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Fixed Background Image */}
      <img
        src="/game_ui/homescreen.jpg"
        alt="Game Background"
        className="fixed inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60 z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 max-w-4xl mx-auto p-6 text-white space-y-6">


        {/* ✨ Outer Wrapper to Align Corners Correctly */}
        <div className="relative">
          {/* ✨ Glowing Corners (inside the box) */}
        <div className="absolute w-2 h-2 bg-white top-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white top-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white bottom-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
        <div className="absolute w-2 h-2 bg-white bottom-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />


          {/* Actual Content Box with padding */}
          <div className="bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] p-6 space-y-6 font-medievalsharp max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Close Button */}
            <button
              onClick={()=> {
                playSelectSound();
                navigate("/")
              }}
              className="absolute top-3 right-4 text-white text-4xl hover:text-yellow-300"
              aria-label="Close Kick Player Settings"
            >
              &times;
            </button>
            <h1 className="text-4xl font-bold text-center text-yellow-400">Lore</h1>

            <p className="italic text-gray-300">
              It is believed that the King was once a just ruler — wise, beloved, and resolute. But something changed.
            </p>

            <p className="text-gray-300">
              They say it began with a war he never wished to fight. The crown was dragged into bloodshed by betrayal
              from within — his council poisoned, his generals bribed, his heirs slaughtered before his eyes. The King
              won the war, but lost everything that made him human.
            </p>

            <p className="text-gray-300">
              In the ashes of his grief, he found a goblet — no one knows where it came from. Crafted of obsidian and
              bone, it was said to whisper promises only he could hear. It showed him visions: of justice through pain,
              of loyalty through fear.
            </p>

            <p className="text-gray-300">
              He drank.
              <br />
              And with that, the King was no longer a man. He became a judge, a god, a warden of fate. The throne room
              turned into a chamber of trials. And those who defied him — traitors, prisoners, rebels, and even the
              innocent — were offered one chance:
            </p>

            <div className="text-yellow-200 text-center font-semibold text-lg my-4">
              Sit. Choose a chalice. Drink. Survive, and walk free.
            </div>

            <p className="text-gray-300">
              Each goblet was different. Some blessed. Some cursed. The players were given relics — ancient artifacts —
              to manipulate their fate or curse another’s. But only one could emerge alive.
            </p>

            <p className="text-gray-300">
              And the King would watch. Silent. Smiling. Sipping from his own cup, which never ran dry.
            </p>

            <p className="text-gray-300">
              Now, long after his kingdom has faded into myth, the game lives on — passed from ruins to ritual,
              whispered in shadows as a cruel tradition.
            </p>

            <div className="text-center italic text-gray-400 text-lg mt-6">
              “Drink, and be judged.<br />
              Or die, forgotten like the rest.”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lore;
