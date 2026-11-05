import { useNavigate } from "react-router-dom";
import { useSound } from "../hooks/sound";
const items = [
  {
    name: "Royal Scrutiny Glass",
    key: "royal_scrutiny_glass",
    effect: "Reveal if the current goblet is poisoned or holy.",
    imgPath: "/items/royal_scrutiny_glass.png"
  },
  {
    name: "Verdict Amplifier",
    key: "verdict_amplifier",
    effect: "Double the effect of the goblet (twice as poisonous or holy).",
    imgPath: "/items/verdict_amplifier.png"
  },
  {
    name: "Crown Disavowal",
    key: "crown_disavowal",
    effect: "Vaporize the goblet's contents — safe or deadly.",
    imgPath: "/items/crown_disavowal.png"
  },
  {
    name: "Royal Chain Order",
    key: "royal_chain_order",
    effect: "Restrain a player, preventing them from acting next turn.",
    imgPath: "/items/royal_chain_order.png"
  },
  {
    name: "Sovereign Potion",
    key: "sovereign_potion",
    effect: "Restore 1 life to yourself.",
    imgPath: "/items/sovereign_potion.png"
  },
  {
    name: "Chronicle Ledger",
    key: "chronicle_ledger",
    effect: "Peek into the future — see the contents of a random upcoming goblet.",
    imgPath: "/items/chronicle_ledger.png"
  },
  {
    name: "Paradox Dial",
    key: "paradox_dial",
    effect: "Flip the goblet's nature — poison becomes holy, and vice versa.",
    imgPath: "/items/paradox_dial.png"
  },
  {
    name: "Thief's Tooth",
    key: "thiefs_tooth",
    effect: "Steal an item from another player.",
    imgPath: "/items/thiefs_tooth.png"
  },
];

const HowToPlay = () => {
  const playSelectSound = useSound("/sounds/select.wav");
  const navigate = useNavigate();
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
      <div className="relative z-20 max-w-4xl mx-auto p-6 text-white">
        {/* Outer wrapper for glowing corners */}
        <div className="relative">
          {/* ✨ Glowing Inner Corners */}
          <div className="absolute w-2 h-2 bg-white top-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
          <div className="absolute w-2 h-2 bg-white top-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />
          <div className="absolute w-2 h-2 bg-white bottom-[6px] left-[6px] shadow-[0_0_6px_#ffffff]" />
          <div className="absolute w-2 h-2 bg-white bottom-[6px] right-[6px] shadow-[0_0_6px_#ffffff]" />

          {/* Main Box */}
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

            <h1 className="text-4xl font-bold text-center text-yellow-400">How to Play</h1>

            <section className="space-y-2 text-lg">
              <p>
                Welcome to <span className="font-semibold text-yellow-300">Chalice of King</span> — a deadly court game of deception, fate, and cunning.
              </p>
              <p>
                You and your opponents sit at the royal table, where mysterious chalices await. Some
                contain holy blessings. Others… death.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-yellow-300">Game Modes</h2>
              <ul className="list-disc list-inside space-y-1 text-lg">
                <li><strong>Single Player:</strong> Face off against a cunning AI.</li>
                <li><strong>Multiplayer:</strong> Battle with up to 4 players in turn-based chaos.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-yellow-300">Turn Actions</h2>
              <ul className="list-disc list-inside space-y-1 text-lg">
                <li>
                  <strong className="text-yellow-400">Drink:</strong> Dare to face fate and drink from the goblet. Survive, and you'll seize another turn. But if death claims you — your turn ends, and the next player steps forward.
                </li>
                <li>
                  <strong className="text-yellow-400">Offer:</strong> Pass the goblet to another. No matter what's inside — your role is done, and the game moves to the next player.
                </li>
              </ul>
              <p className="text-sm italic text-gray-400">
                Use your instincts, items, and deceit to survive the king’s game.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-yellow-300 mb-2">Scoring System</h2>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-200">
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
              <p className="text-sm text-gray-400 italic mt-4 text-center">
                Outsmart your opponents, manipulate fate, and claim the highest score to win the King’s favor.
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-bold text-yellow-300 mb-2">Artifacts</h2>
              <p className="text-lg text-gray-200">
                Harness the power of artifacts wisely. In a single turn, you may unleash any number of them present in inventory — combine, stack, or sequence their effects to execute bold and strategic plays. The choice is yours.
                <br />
                  Once all goblets have been emptied and the round ends, you’ll be granted a fresh set of artifacts, ready to reshape the tides once again.

              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="bg-[#2a2a2a] border-[4px] border-[#363636] shadow-[inset_0_0_8px_#000] p-4 font-medievalsharp"
                  >
                    <img
                      src={item.imgPath}
                      alt={item.name}
                      className="w-16 h-16 mb-3 mx-auto"
                    />
                    <h3 className="text-xl font-semibold text-yellow-200 text-center">{item.name}</h3>
                    <p className="text-sm text-gray-300 text-center">{item.effect}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex justify-center mt-6">
              <button
                onClick={()=> navigate('/tutorial')} 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200"
              >
                Play Tutorial
              </button>
            </section>

            <section className="text-center text-md italic text-gray-400 mt-8">
              <p>Only one shall rise. The rest shall drink... their fate.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
