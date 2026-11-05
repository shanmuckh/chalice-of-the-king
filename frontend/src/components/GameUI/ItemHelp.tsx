import { useEffect, useRef } from "react";

const items = [
  {
    name: "Royal Scrutiny Glass",
    key: "royal_scrutiny_glass",
    effect: "Reveal if the current goblet is poisoned or holy.",
    imgPath: "/items/royal_scrutiny_glass.png",
  },
  {
    name: "Verdict Amplifier",
    key: "verdict_amplifier",
    effect: "Double the effect of the goblet (twice as poisonous or holy).",
    imgPath: "/items/verdict_amplifier.png",
  },
  {
    name: "Crown Disavowal",
    key: "crown_disavowal",
    effect: "Vaporize the goblet's contents — safe or deadly.",
    imgPath: "/items/crown_disavowal.png",
  },
  {
    name: "Royal Chain Order",
    key: "royal_chain_order",
    effect: "Restrain a player, preventing them from acting next turn.",
    imgPath: "/items/royal_chain_order.png",
  },
  {
    name: "Sovereign Potion",
    key: "sovereign_potion",
    effect: "Restore 1 life to yourself.",
    imgPath: "/items/sovereign_potion.png",
  },
  {
    name: "Chronicle Ledger",
    key: "chronicle_ledger",
    effect: "Peek into the future — see the contents of a random upcoming goblet.",
    imgPath: "/items/chronicle_ledger.png",
  },
  {
    name: "Paradox Dial",
    key: "paradox_dial",
    effect: "Flip the goblet's nature — poison becomes holy, and vice versa.",
    imgPath: "/items/paradox_dial.png",
  },
  {
    name: "Thief's Tooth",
    key: "thiefs_tooth",
    effect: "Steal an item from another player.",
    imgPath: "/items/thiefs_tooth.png",
  },
];


const ItemHelp = ({ onClose }: { onClose: () => void }) => {
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
        className="relative max-h-[90vh] max-w-4xl w-full mx-4 bg-[#2a2a2a] border-[6px] border-[#363636] shadow-[inset_0_0_8px_#000] p-6 font-medievalsharp overflow-y-auto custom-scrollbar"
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-2xl hover:text-yellow-300"
        >
          &times;
        </button>

        {/* Content */}
        <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Artifacts Help</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.key}
              className="bg-[#2a2a2a] border-[4px] border-[#363636] shadow-[inset_0_0_8px_#000] p-4"
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
      </div>
    </div>
  );
};

export default ItemHelp;
