import { useCallback, useEffect, useState } from "react";
import type { ActionMessage, Contestant } from "../../../../shared/types/types";
import TypeWriter from "typewriter-effect";

function EventArea({
  myPlayerId,
  actionMessage,
  players,
}: {
  myPlayerId: string;
  actionMessage: ActionMessage;
  players: Contestant[];
}) {

  const [imagePath, setImagePath] = useState("/game_scenes/courtroom.png");
  const [message, setMessage] = useState("");

  const renderGameLogMessage = useCallback((msg: ActionMessage, players: Contestant[]): void => {
    const user = players.find((p) => p.id === msg.userId);
    const target = msg.targetId ? players.find((p) => p.id === msg.targetId) : null;

    if (!user) {
      setMessage("⚠️ Unknown player.");
      
      return;
    }

    if ((msg.type === "turn") && msg.result) {
      if ( msg.userId === myPlayerId) setMessage("It is your turn.");
      else setMessage(msg.result);
      return;
    }

    if ((msg.type === "message" || msg.type === "announce" || msg.type === "refill") && msg.result) {
      setMessage(msg.result);
      return;
    }


    if (msg.type === "skip") {
      setMessage(`${user.id === myPlayerId ? 'You were': `${user.name} was`} bound by royal chains...`);
      setTimeout(() => {
        setMessage(`${user.id === myPlayerId ? 'Your':`${user.name}'s`} turn is skipped.`);
      }, 2500);
      return;
    }

    if (msg.type === "drink") {
      if (msg.userId === msg.targetId) {
        setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} chose to drink the goblet...`);

        setTimeout(() => {
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} sipped — it was ${msg.result?.toLowerCase()}.`);
        }, 2000);

        setTimeout(() => {
          setMessage(msg.result === "HOLY"
            ? `${user.id === myPlayerId ? 'You' : `${user.name}`} get another chance.`
            : `${user.id === myPlayerId ? 'You' : `${user.name}`} lost souls.`);
        }, 4000);
      } else {
        setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} forced ${target?.id === myPlayerId ? 'you' : `${target?.name}`} to drink...`);

        setTimeout(() => {
          setMessage(`It was ${msg.result?.toLowerCase()}.`);
        }, 2000);

        if(msg.result != 'HOLY'){
        setTimeout(() => {
          setMessage(`${target?.id === myPlayerId ? 'You' : `${target?.name}`} lost souls.`); 
        }, 4000);
      }
      }
      return;
    }

    if (msg.type === "artifact_used" && msg.item) {
      switch (msg.item) {
        case "royal_scrutiny_glass":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} examined a goblet using the Royal Scrutiny Glass...`);
          setTimeout(() => {
            if (msg.userId === myPlayerId) {
              setMessage(`It is ${msg.result?.toLowerCase()}.`);
            }
          }, 2500);
          return;

        case "verdict_amplifier":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} invoked the Verdict Amplifier — the effect intensifies.`);

          return;

        case "crown_disavowal":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} vaporized the goblet’s contents with the Crown Disavowal.`);
          setTimeout(() => {
            setMessage(`It was ${msg.result?.toLowerCase()}.`);
          }, 2500);
          return;

        case "royal_chain_order":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} bound ${target?.id === myPlayerId ? 'you' : `${target?.name}`} with a Royal Chain Order.`);
          setTimeout(() => {
            setMessage(`${target?.id === myPlayerId ? 'You are':`${target?.name} is`} now chained.`);
          }, 2500);
          return;

        case "sovereign_potion":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} consumed a Sovereign Potion.`);
          setTimeout(() => {
            setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} regained strength.`);
          }, 2500);
          return;

        case "chronicle_ledger":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} consulted the Chronicle Ledger...`);
          if (msg.userId === myPlayerId) {
            setTimeout(() => {
              const [result, goblet] = msg.result?.split(":") || [];
              let message = "";
              switch(goblet) {
                case '1': 
                  message = `Current goblet is ${result}`;
                  break;
                case '2':
                  message = `Next goblet is ${result}`;
                  break;
                case '3':
                  message = `3rd goblet from now is ${result}`;
                  break;
                default:
                  message = `${goblet}th goblet from now is ${result}`;
                  break;
              }
              setMessage(message);
            }, 2500);
          }
          return;

        case "paradox_dial":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} twisted the Paradox Dial...`);
          setTimeout(() => {
            setMessage(`Goblet state is now reversed.`);
          }, 2500);
          return;

        case "thiefs_tooth":
          setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} used the Thief’s Tooth...`);
          setTimeout(() => {
            setMessage(`${user.id === myPlayerId ? 'You' : `${user.name}`} now have power to steal from your foe!`);
          }, 2500);
          if(msg.result == 'FAILED_NO_TARGET') {
            setTimeout(() => {
            setMessage(`NO PLAYER HAS ANY ARTIFACTS TO STEAL.`);
            }, 3000);
          }
          return;

        default:
          setMessage(msg.result || "⚠️ Unknown artifact effect.");
          return;
      }
    }

    setMessage("⚠️ Unknown royal action.");
  }, [myPlayerId]);

  const setEventImagePath = useCallback((msg: ActionMessage) => {
    
    if (msg.type === "announce") {
      setImagePath("/game_scenes/king_announces.webp");
      return;
    }
    
    if(msg.type === 'message' || msg.type === 'turn') {
      const playerPrefix = msg.userId === myPlayerId ? "player1_scenes" : "player2_scenes";
      setImagePath(`/game_scenes/${playerPrefix}/lives.webp`);
      return;
    }

    if (msg.type === "refill") {
      setImagePath("/game_scenes/guard_refills.webp");
      return;
    }

    let playerPrefix = msg.targetId === myPlayerId ? "player1_scenes" : "player2_scenes";

    if (msg.type === "artifact_used" && msg.item) {
      playerPrefix = msg.userId === myPlayerId ? "player1_scenes" : "player2_scenes";
      if (msg.item == 'royal_chain_order') playerPrefix = msg.targetId === myPlayerId ? "player1_scenes" : "player2_scenes";
      const imgMap: Record<string, string> = {
        royal_scrutiny_glass: `/game_scenes/${playerPrefix}/royal_scrutiny_glass.webp`,
        verdict_amplifier: `/game_scenes/${playerPrefix}/verdict_amplifier.webp`,
        crown_disavowal: `/game_scenes/${playerPrefix}/crown_disavowal.webp`,
        royal_chain_order: `/game_scenes/${playerPrefix}/royal_chain_order.webp`,
        sovereign_potion: `/game_scenes/${playerPrefix}/sovereign_potion.webp`,
        chronicle_ledger: `/game_scenes/${playerPrefix}/chronicle_ledger.webp`,
        paradox_dial: `/game_scenes/${playerPrefix}/paradox_dial.webp`,
        thiefs_tooth: `/game_scenes/${playerPrefix}/thiefs_tooth.webp`,
      };
      setImagePath(imgMap[msg.item] || "/game_scenes/default_artifact.webp");
      return;
    }

    if (msg.type === "drink") {
      const isHoly = msg.result === "HOLY";
      setTimeout(() => setImagePath(`/game_scenes/${playerPrefix}/lives.webp`), 0);
      setTimeout(() => setImagePath(`/game_scenes/${playerPrefix}/drinks.webp`), 2000);
      setTimeout(() =>
        setImagePath(`/game_scenes/${playerPrefix}/${isHoly ? "lives" : "died"}.webp`)
      , 4000);
      return;
    }

    if (msg.type === "skip") {
      playerPrefix = msg.userId === myPlayerId ? "player1_scenes" : "player2_scenes";
      setImagePath(`/game_scenes/${playerPrefix}/royal_chain_order.webp`);
      return;
    }

    setImagePath("/game_scenes/courtroom.png");
  }, [myPlayerId]);

  useEffect(() => {
    setEventImagePath(actionMessage);
    renderGameLogMessage(actionMessage, players);
  }, [actionMessage, players, renderGameLogMessage, setEventImagePath]);

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

          <TypeWriter
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

export default EventArea;
