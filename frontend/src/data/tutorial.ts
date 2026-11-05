import type { GameState } from "../../../shared/types/types";

type Position = 'top' | 'bottom' | 'left' | 'right';

type Step = {
  id: string;
  message: string;
  target?: string;
  position?: Position;
};

export const tutorialGameState: GameState = {
  players: [
    {
      id: 'player1',
      name: 'You',
      lives: 3,
      items: ['royal_scrutiny_glass', 'sovereign_potion'],
      isAI: false,
      isOnline: true,
      statusEffects: [],
    },
    {
      id: 'ai1',
      name: 'Duke AI',
      lives: 3,
      items: ['royal_chain_order', 'verdict_amplifier'],
      isAI: true,
      isOnline: true,
      statusEffects: ['chained'],
    },
  ],
  currentRound: {
    round: 1,
    poisnousGoblets: 2,
    holyGoblets: 2,
    lives: 3,
    itemCount: 2,
    suddenDeath: false,
  },
  activePlayerIndex: 0,
  goblets: [true, false, true, false], // true = poisonous, false = holy
  currentGobletIndex: 1,
  gobletsRemaining: 4,
  turnOrderDirection: 'clockwise',
  gameState: 'playing',
  scoreChart: [
    { playerId: 'player1', name: 'You', score: 0 },
    { playerId: 'ai1', name: 'Duke AI', score: 0 },
  ],
};

export const steps: Step[] = [
    {
      id: 'welcome',
      message: `So, you're ready for CHALICE OF THE KING? Good. Let's see if you can outsmart fate, or at least survive long enough to annoy your friends. Try to pay attention, this isn't rocket science... mostly.`,

    },
    {
      id: 'introduce',
      message: `Welcome to the King's court. I cooked up this delightful mess to test your judgment.`,

    },
    {
      id: 'start',
      message: `Now that you've met the architect of your potential downfall, let's get to the main stage: your PLAYING AREA. Every single choice you make here matters.`,

    },
    {
        id:'desktop-layout',
        message: `Take a look. If you're on a DESKTOP, you'll see two main screens at once. The left is your main playing area—where you'll make all your crucial decisions.`,
    },
    {
        id:'mobile-layout',
        message: `On MOBILE, you'll see the playing area for now. The other screen, where events unfold, will pop up when something happens. Don't worry, you won't miss a thing.`
    },
    {
        id:'mobile-event-area-intro',
        message: `Speaking of events, here's a quick peek at what that 'event area' looks like. (And yes, I actually bothered to make this responsive, so even you mobile users can eventually see it. The sacrifices I make.) It's where all the dramatic reveals, the poisonings, and the occasional miracles play out.`
    },
    {
        id: 'player-info',
        message:`See these players? When it's your turn, you can click on yourself to drink, or click on another player to offer them the goblet. Simple, right? Or deadly.`,
        target: '#player1', // id of target element
        position: 'bottom'
    },
    {
        id: 'inventory-info',
        message: `Now, look to your inventory. That's where your artifacts are hiding. These aren't just for show; they're your secret weapons to twist fate and outsmart everyone. Pretty handy, if you ask me.`,
        target: '#player-inventory',
        position: 'top'
    },
    {
        id: 'opponent-inventory',
        message: `Now, for the fun part: your opponents. You can also peek at their inventory... just to get a sense of what nasty tricks they might be plotting against you. Knowledge is power, after all, especially when it comes to who to trust.`,
        target: '#opponent-inventory',
        position: 'bottom'
    },
    {
    id: 'artifact-combo-example',
    message: `Oh, and one more thing about those artifacts: you can use multiple of them in a single turn to create some truly wicked combos.`,
    target: '#player-inventory',
    position: 'top'
},
{
  id: 'personal-favorite',
  message: `My personal favorite combo? Using a **Royal Scrutiny Glass** to peek at the goblet, then flipping it from holy to poisonous with a **Paradox Dial**, amplifying its effect with a **Verdict Amplifier**, and finally... offering it to an "unlucky" opponent. After all, I'm the one who made this.`,
},
    {
        id: 'item-help',
        message: `And just in case your memory isn't quite royal-grade, there's a little cheat sheet for what all those artifacts do. Just look right over here. (?)`,
        target: '#item-help',
        position: 'left'
    },
    {
        id: 'music-player',
        message: `Oh, and beneath that inventory help, you'll find the music player button (🎶). Because even deadly games of deception need a killer soundtrack. Feel free to set the mood... or distract your opponents.`,
        target: '#music-player',
        position: 'left',
    },
    {
        id: 'scoreboard',
        message: `"And just below the music player? That's your scoreboard. Keep an eye on it – it's how you know if you're winning, or if you're about to become the King's least favorite player.`,
        target: '#scoreboard',
        position: 'left',
    },
    {
        id: 'turn-logic',
        message: `Now, about whose turn it is. The player with the yellow indicator? That's who's currently facing their fate. Your turn continues if you Drink and survive (go you!). But your turn definitely ends if you Offer the goblet, or if you Drink... and, well, don't make it. Keep an eye on that indicator to see who's next in the hot seat.`,
    },
    {
        id: 'souls-logic',
        message: `Now, about your **Souls**. See those blue fires next to your player icon? That's your very essence, your life force. (Yes, I called them 'Souls.' Pretty fancy, right? You're welcome.) Every time you drink a poisoned goblet, you lose one. If you offer your opponent poisonous goblet... They lose a Soul! Lose all your Souls, and round is over... and trust me, being the first one eliminated isn't exactly a high score move. Try to keep those Souls, if you can.`
    },
    {
    id: 'round-end-artifacts',
    message: `So, how does a round end? Well, once every goblet has been bravely (or foolishly) consumed. When a new round begins, you'll get a fresh set of artifacts.`
},
{
    id: 'round-start-goblet-info',
    message: `IMPORTANT – At the start of each new round, I'll tell you exactly how many goblets are poisoned and how many are holy in that batch. Keep track of what's been used – it's vital for your survival and for winning the King's favor!`
},
{
    id: 'round-count-score',
    message: `There are three rounds in total. Don't worry, you won't be eliminated in any of them. But remember, your score will accumulate across all rounds. So every risk (or clever pass) still counts!`
},
{
    id: 'scoring-system-info',
    message: `Now, if you're keen to master the art of scoring (which, let's be honest, you should be), you can always find the full breakdown in the 'How to Play' section. Or, you know, just click on the scoreboard itself. I'm not going to sit here and read you my own rulebook, you can check that out yourself.`
},
{
    id: 'how-to-play-plea',
    message: `(Only if you'd read the 'How to Play' section at the very beginning, I wouldn't have to write all these instructions out manually for you. But hey, it's fine. I'm fine. This is fine. Moving on...)`
},
{
    id: 'final-roast',
    message: `That's it. Your CHALICE OF THE KING tutorial, complete. You're now dangerous... mainly to yourself. Go play. And for the love of all that is holy, **don't be the first one eliminated**. My reputation is on the line here, not yours. Good luck. Seriously.`
}

  ];