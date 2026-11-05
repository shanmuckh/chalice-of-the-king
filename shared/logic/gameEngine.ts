import type { RoundConfig, GameState, Contestant, ItemType, ActionMessage, Score, StatusEffect } from '../types/types';
import { Item } from './itemSystem';
import { clearGobletMemory, gobletCountMemory } from './aiLogic';

// Initialize a new game
export function initializeGame(players: Contestant[]): GameState {
  const scoreChart = players.map(p => ({
    playerId: p.id,
    name: p.name,
    score: 0,
  }));
  return {
    players,
    currentRound: generateRoundConfig(1),
    activePlayerIndex: Math.floor(Math.random() * players.length),
    goblets: [],
    currentGobletIndex: 0,
    gobletsRemaining: 0,
    turnOrderDirection: 'clockwise',
    gameState: 'loading',
    scoreChart: scoreChart
  };
}

// Start a new round
export function startRound(game: GameState, roundNumber: number): GameState {
  const roundConfig = generateRoundConfig(roundNumber);
  if (!roundConfig) throw new Error(`Invalid round number: ${roundNumber}`);

  const { poisnousGoblets, holyGoblets } = roundConfig;

  gobletCountMemory.poisonousGoblets = poisnousGoblets;
  gobletCountMemory.holyGoblets = holyGoblets;

  const goblets: boolean[] = [];
  for (let i = 0; i < poisnousGoblets; i++) goblets.push(true);
  for (let i = 0; i < holyGoblets; i++) goblets.push(false);
  shuffleArray(goblets);

  const itemsPerPlayer = roundConfig.itemCount;
  const updatedPlayers = game.players.map(player => ({
    ...player,
    lives: roundConfig.lives,
    items: getRandomItems(itemsPerPlayer),
    statusEffects: [],
  }));

  return {
    ...game,
    goblets,
    currentGobletIndex: 0,
    gobletsRemaining: goblets.length,
    players: updatedPlayers,
    gameState: 'playing',
    currentRound: roundConfig,
  };
}

// Play a turn
export function playTurn(game: GameState, action: { type: 'drink' | 'use_item' | string; targetPlayerId?: string; itemType?: ItemType }): { updatedGame: GameState, actionMessage: ActionMessage } {
  const gameCopy = JSON.parse(JSON.stringify(game));
  const { activePlayerIndex, players, goblets, currentGobletIndex, turnOrderDirection, scoreChart } = game;
  const activePlayer = players[activePlayerIndex];

  if (action.type === 'drink') {
    const targetPlayerId = action.targetPlayerId;
    const targetPlayerIndex = players.findIndex( (p: Contestant) => p.id === targetPlayerId);
    if (targetPlayerIndex === -1) {
      return { updatedGame: game, actionMessage: { type: 'drink', userId: activePlayer.id, result: 'Target player not found.' } };
    }

    const updatedPlayers = [...players];
    let updatedScoreChart = [...scoreChart];
    const hasAmplified = activePlayer.statusEffects.includes('amplified');

    if (hasAmplified) {
      updatedPlayers[activePlayerIndex] = {
        ...activePlayer,
        statusEffects: activePlayer.statusEffects.filter((e: StatusEffect) => e !== 'amplified'),
      };
    }

    const isPoisonous = goblets[currentGobletIndex];


    // update ai memory
    if (isPoisonous) {
      gobletCountMemory.poisonousGoblets--;
    } else {
      gobletCountMemory.holyGoblets--;
    }

    if (isPoisonous) { 
      const damage = hasAmplified ? 2 : 1;
      updatedPlayers[targetPlayerIndex] = {
        ...updatedPlayers[targetPlayerIndex],
        lives: updatedPlayers[targetPlayerIndex].lives - damage,
      };
      updatedPlayers[activePlayerIndex] = {
        ...updatedPlayers[activePlayerIndex],
      };

      const scoreEarned = targetPlayerIndex === activePlayerIndex ? 5 : 4 ; // +5 for risk or +4 for inflicting poison to opponent

      updatedScoreChart = scoreChart.map((scoreInfo: Score) =>
        scoreInfo.playerId === activePlayer.id
          ? { ...scoreInfo, score: scoreInfo.score + scoreEarned}
          : scoreInfo
      );


    } else {
      if (targetPlayerIndex === activePlayerIndex) {
        updatedPlayers[activePlayerIndex] = {
          ...updatedPlayers[activePlayerIndex],
        };

       updatedScoreChart = scoreChart.map((scoreInfo: Score) =>
        scoreInfo.playerId === activePlayer.id
          ? { ...scoreInfo, score: scoreInfo.score + 5 } // +5 for taking risk and surviving
          : scoreInfo
      );

        const nextGame = {
          ...game,
          scoreChart: updatedScoreChart,
          players: updatedPlayers,
          currentGobletIndex: (currentGobletIndex + 1) % goblets.length,
          gobletsRemaining: game.gobletsRemaining - 1,
        };
        return {
          updatedGame: nextGame,
          actionMessage: {
            type: 'drink',
            userId: activePlayer.id,
            targetId: targetPlayerId,
            result: 'HOLY',
          },
        };
      }
    }

      const updatedGame = {
    ...game,
    scoreChart: updatedScoreChart,
    players: updatedPlayers,
    currentGobletIndex: (currentGobletIndex + 1) % goblets.length,
    gobletsRemaining: game.gobletsRemaining - 1,
    activePlayerIndex: getNextPlayerIndex(activePlayerIndex, players.length, turnOrderDirection),
  };


    return {
      updatedGame,
      actionMessage: {
        type: 'drink',
        userId: activePlayer.id,
        targetId: targetPlayerId,
        result: isPoisonous ? 'POISON' : 'HOLY',
      }
    };


  } else if (action.type === 'use_item' && action.itemType) {
    const itemType = action.itemType;
    const activePlayer = gameCopy.players[activePlayerIndex];
    const targetPlayerIndex = gameCopy.players.findIndex((p: Contestant)=> p.id == action.targetPlayerId);
    const targetPlayer = gameCopy.players[targetPlayerIndex];

    // if status is thief
    const isThief = activePlayer.statusEffects.includes("thief");
    if(isThief) {
      if(targetPlayer) {
        const itemIndex = targetPlayer.items.indexOf(action.itemType);
    
        // simulating stealing by moving the item from target to active player inventory
        targetPlayer.items.splice(itemIndex, 1);
        activePlayer.items.push(action.itemType);
    
        // Remove "thief" status effect
        activePlayer.statusEffects = activePlayer.statusEffects.filter((effect : StatusEffect) => effect !== "thief");
      }
    }

    if (!activePlayer.items.includes(itemType))
      return { updatedGame: game, actionMessage: { type: 'artifact_used', userId: activePlayer.id, result: `Item ${itemType} not found.` } };

    const updatedPlayers = [...players];
    updatedPlayers[activePlayerIndex] = activePlayer;
    updatedPlayers[targetPlayerIndex] = targetPlayer;


    const updatedGame = Item({...game, players: updatedPlayers }, itemType, action.targetPlayerId);

    return updatedGame;
  }

  return { updatedGame: game, actionMessage: { type: 'drink', userId: activePlayer.id, result: 'Invalid action type.' } };
}

// End a round
export function nextRound(game: GameState, roundNumber: number): GameState {

  const { players,scoreChart } = game;


    const updatedScoreChart = scoreChart.map((scoreInfo: Score) =>{
      const player = players.find((p: Contestant)=> p.id === scoreInfo.playerId);
        const bonus = player
        ? player.lives > 0
          ? player.lives * 5 // +5 for each remaining life
          : -10              // -10 if eliminated first
        : 0;                 // Fallback in case player is not found
      return {
        ... scoreInfo,
        score: scoreInfo.score + bonus
      }
    });

  // if round 3 is over 
  if (roundNumber >= 4) {
    return {
      ...game,
      scoreChart: updatedScoreChart,
      gameState: 'game_over',
    };

  }

  const nextRoundConfig = generateRoundConfig(roundNumber);
  if (!nextRoundConfig) throw new Error(`Invalid round number: ${roundNumber}`);

  const { poisnousGoblets, holyGoblets } = nextRoundConfig;

  clearGobletMemory();
  gobletCountMemory.poisonousGoblets = poisnousGoblets;
  gobletCountMemory.holyGoblets = holyGoblets;

  const goblets: boolean[] = [];
  for (let i = 0; i < poisnousGoblets; i++) goblets.push(true);
  for (let i = 0; i < holyGoblets; i++) goblets.push(false);
  shuffleArray(goblets);

  const itemsPerPlayer = nextRoundConfig.itemCount;
  const updatedPlayers = game.players.map(player => ({
    ...player,
    lives: nextRoundConfig.lives,
    items: getRandomItems(itemsPerPlayer),
    statusEffects: [],
  }));

  return {
    ...game,
    goblets,
    scoreChart: updatedScoreChart,
    currentGobletIndex: 0,
    gobletsRemaining: goblets.length,
    players: updatedPlayers,
    gameState: 'playing',
    currentRound: nextRoundConfig,
  };

}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomItems(count: number): ItemType[] {
  const allItems: ItemType[] = [
    'royal_scrutiny_glass',
    'verdict_amplifier',
    'crown_disavowal',
    'royal_chain_order',
    'sovereign_potion',
    'chronicle_ledger',
    'paradox_dial',
    'thiefs_tooth',
  ];
  const shuffled = [...allItems];
  shuffleArray(shuffled);
  return shuffled.slice(0, count);
}

export function getNextPlayerIndex(currentIndex: number, totalPlayers: number, direction: string): number {
  return direction === 'clockwise'
    ? (currentIndex + 1) % totalPlayers
    : (currentIndex - 1 + totalPlayers) % totalPlayers;
}

export function generateRoundConfig(round: number): RoundConfig {
  let poisnousGoblets = 1;
  let holyGoblets = 1;
  let lives = 2;
  let itemCount = 0;
  let suddenDeath = false;

  if (round === 1) {
    poisnousGoblets = 1 + Math.floor(Math.random() * 2);
    holyGoblets = 1 + Math.floor(Math.random() * 2);
    lives = 3;
    itemCount = 1;
  } else if (round === 2) {
    poisnousGoblets = 2 + Math.floor(Math.random() * 2);
    holyGoblets = 2 + Math.floor(Math.random() * 2);
    lives = 4;
    itemCount = 2;
  } else if (round === 3) {
    poisnousGoblets = 3 + Math.floor(Math.random() * 2);
    holyGoblets = 3 + Math.floor(Math.random() * 2);
    lives = 5;
    itemCount = 4;
    suddenDeath = true;
  } else {
    poisnousGoblets = 2 + Math.floor(Math.random() * 3);
    holyGoblets = 2 + Math.floor(Math.random() * 3);
    lives = 6;
    itemCount = 2 + Math.floor(round / 2);
    suddenDeath = true;
  }

  return {
    round,
    poisnousGoblets,
    holyGoblets,
    lives,
    itemCount,
    suddenDeath,
  };
}

export function refillChambers(game: GameState): GameState {
    const sameRoundConfig = generateRoundConfig(game.currentRound.round);
    const newGoblets: boolean[] = [];

    gobletCountMemory.poisonousGoblets = sameRoundConfig.poisnousGoblets;
    gobletCountMemory.holyGoblets = sameRoundConfig.holyGoblets;

    for (let i = 0; i < sameRoundConfig.poisnousGoblets; i++) newGoblets.push(true);
    for (let i = 0; i < sameRoundConfig.holyGoblets; i++) newGoblets.push(false);
    shuffleArray(newGoblets);

    const itemsPerPlayer = sameRoundConfig.itemCount;
    const updatedPlayers = game.players.map(player => ({
      ...player,
      items: getRandomItems(itemsPerPlayer),
      statusEffects: [],
    }));

    return {
      ...game,
      currentRound: sameRoundConfig,
      players: updatedPlayers,
      goblets: newGoblets,
      currentGobletIndex: 0,
      gobletsRemaining: newGoblets.length,
    };
}

export const skipIfChained = (
  game: GameState,
  player: Contestant
): { updatedGame: GameState; actionMessage: ActionMessage } | null => {
  if (player.statusEffects.includes('chained')) {
    const updatedPlayers = game.players.map((p, idx) =>
      idx === game.activePlayerIndex
        ? { ...p, statusEffects: p.statusEffects.filter(effect => effect !== 'chained') }
        : p
    );

    const updatedGame: GameState = {
      ...game,
      players: updatedPlayers,
      activePlayerIndex: getNextPlayerIndex(
        game.activePlayerIndex,
        game.players.length,
        game.turnOrderDirection
      ),
    };

    return {
      updatedGame,
      actionMessage: {
        type: 'skip',
        userId: player.id,
        result: 'Player is chained and skips turn.',
      },
    };
  }

  return null;
};
