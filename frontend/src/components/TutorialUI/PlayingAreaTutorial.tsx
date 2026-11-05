
import type { Contestant } from "../../../../shared/types/types";
import { IoMdArrowDropdown, IoMdHelp } from "react-icons/io";
import { GiMusicalNotes, GiScrollUnfurled } from "react-icons/gi";
import Typewriter from 'typewriter-effect';
import ItemSelectorTutorial from "./ItemSelectorTutorial";

const PlayingAreaTutorial = ({canDrink,myPlayerId, players, currentPlayerId }: { canDrink:boolean, myPlayerId:string, players: Contestant[],  currentPlayerId : string;}) => {
  const playerCount = players.length;

  return (
    <div className="relative w-full h-screen overflow-hidden">

      <div className="absolute top-4 right-4 z-40 flex flex-col gap-4 items-end">
        {/* Help Button */}
        <button
          id="item-help"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
          title="Item Help"
        >
          <IoMdHelp />
        </button>

        {/* Music Button */}
        <button
          id="music-player"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
          title="Music Player"
        >
          <GiMusicalNotes />

        </button>

        {/* Scoreboard Button */}
        <button
          id="scoreboard"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
          title="View Scoreboard"
        >
          <GiScrollUnfurled />
        </button>
      </div>


      {/* Background */}
      <img
        src="/game_scenes/courtroom.png"
        alt="courtroom"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* choice text */}
      {
        canDrink && 
        <div className="font-cinzel w-full text-2xl text-center absolute  top-[10%] transform  ">
          <Typewriter
            options={{
              strings: ['Offer or Drink yourself...'],
              autoStart: true,
              loop: false,
              deleteSpeed: 99999999,        // Disable deletion
              delay: 50,              // Typing speed (optional)
              cursor:''
            }}/>
        </div>
      }

      {/* Player Grid */}
      <div
        className={`absolute w-full    top-1/2 transform  ${
          playerCount === 2 ? "-translate-y-[10%]" : "-translate-y-[20%]"
        } flex flex-col items-center space-y-4  `}
      >
        <div className="flex w-[500px] lg:w-[575px] justify-between   ">
          <PlayerImageTutorial  currentPlayerId={currentPlayerId} canDrink={canDrink}  myPlayerId={myPlayerId}  index={1} player={players[0]}  />
          {playerCount >= 2 && <PlayerImageTutorial currentPlayerId={currentPlayerId} canDrink={canDrink}   myPlayerId={myPlayerId}  index={2} player={players[1]}  />}
        </div>
      </div>

      {/* Item Selector */}
      <div className="absolute w-full bottom-0 p-4">
        <ItemSelectorTutorial canUseItem={canDrink} 
        items={players.find(p => p.id === myPlayerId)?.items || []}
        />
      </div>


    </div>
  );
};

export default PlayingAreaTutorial;

const PlayerImageTutorial = ({
  index,
  player,
  myPlayerId,
  canDrink,
  currentPlayerId
}: {
  index: number;
  player: Contestant;
  myPlayerId: string;
  canDrink: boolean;
  currentPlayerId: string;
}) => (
  <div
    id={`player${index}`}
    className={`relative flex-shrink-0 items-center gap-0 ${
      index % 2 === 1 ? 'flex ' : 'flex flex-row-reverse '
    }`}
  >
    {/* Player Image with interactivity */}
    <div
      className={`relative ${
       player.id !== myPlayerId
          ? 'drop-shadow-md drop-shadow-yellow-300'
          : canDrink
          ? 'hover:drop-shadow-md hover:drop-shadow-yellow-500'
          : ''
      } ${canDrink ? 'cursor-pointer' : 'cursor-not-allowed'} text-center`}
    >
        {player.id === currentPlayerId && (
          <div className="absolute  -top-8 left-1/2 -translate-x-1/2 z-30 text-5xl  text-yellow-300 drop-shadow-[0_0_12px_#d4af37]">
            <IoMdArrowDropdown />
          </div>
        )}

      <img
        src={`/game_scenes/player.png`}
        alt={`Player ${player.id}`}
        className={`w-32 transition duration-300 ${
          index === 1 || index === 3 ? 'scale-x-[-1]' : ''
        } ${!canDrink ? 'grayscale opacity-60' : ''}`}
      />
    </div>

    {/* Player UI panel */}
    <div className="flex flex-col items-center gap-2 px-2 py-3 bg-[#1e1e1e]/90 shadow-[inset_0_0_10px_#000] text-white font-cinzel w-[120px]">
      {/* Name */}
      <span className="text-sm tracking-wider text-white">
        {player.name}
      </span>

      {/* Health - Souls */}
      <div className="flex flex-wrap gap-[2px]">
        {Array.from({ length: player.lives }).map((_, i) => (
          <img
            key={i}
            src="/game_ui/souls.png"
            alt="soul"
            className="w-5 h-5 drop-shadow-[0_0_6px_#000]"
          />
        ))}
      </div>

      {/* Inventory (only show for others) */}
      {player.id !== myPlayerId && (
      <div id="opponent-inventory" className="grid grid-cols-2 place-items-center bg-[#121212] p-1 rounded border border-[#444] w-[90px] h-[90px]">
        {Array.from({ length: 4 }).map((_, i) => {
          const item = player.items[i];
          return item ? (
            <img
              key={i}
              src={`/items/${item}.png`}
              alt={item}
              className={`w-8 h-8 object-contain border border-yellow-600 bg-zinc-800`}
            />
          ) : (
            <div
              key={i}
              className="w-8 h-8 border border-zinc-700 bg-zinc-900 opacity-40 rounded"
            />
          );
        })}
      </div>
      )}

    </div>
  </div>
);