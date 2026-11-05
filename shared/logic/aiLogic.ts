import type { GameState, ItemType, ActionMessage, Contestant } from '../types/types';
import { playTurn } from './gameEngine';

export const gobletMemory: Record<number, 'poisonous' | 'holy'> = {};
export const gobletCountMemory = {
  poisonousGoblets: 0,
  holyGoblets: 0
};

type Action =
  | { type: 'use_item'; itemType: ItemType; targetPlayerId?: string }
  | { type: 'drink'; targetPlayerId?: string };

function calculateActionScore(
  game: GameState,
  action: Action,
  aiPlayer: Contestant,
  opponent: Contestant | undefined,
  pPoisonous: number
): number {


  let score = 0;
  score += 1;

  switch (action.type) {
    case 'use_item':
      switch (action.itemType) {
        case 'sovereign_potion':
          if (aiPlayer.lives <= 1) score += 1000;
          else if (aiPlayer.lives === 2) score += 500;
          else score += 50;
          break;

        case 'crown_disavowal':
          if (pPoisonous >= 0.4 && pPoisonous <= 0.6 && aiPlayer.lives <= 1) score += 900;
          else if (pPoisonous >= 0.4 && pPoisonous <= 0.6) score += 400;
          else score += 50;
          break;

        case 'verdict_amplifier':
          if (pPoisonous > 0.7 && opponent && opponent.lives >= 2) score += 1000;
          else if (opponent) score += 300;
          break;

        case 'royal_chain_order':
          const alreadyChained = opponent?.statusEffects.includes('thief');
          if (pPoisonous > 0.5 && opponent && opponent.lives > 0 && !alreadyChained) {
            score += 1000;
          }
          break;

        case 'royal_scrutiny_glass':
          if (pPoisonous >= 0.4 && pPoisonous <= 0.6 ) score += 600;
          else score += 10;
          break;

        case 'chronicle_ledger':
          if (pPoisonous >= 0.4 && pPoisonous <= 0.6 ) score += 600
          else score += 50;
          break;

        case 'paradox_dial':
          if (pPoisonous > 0.6 && aiPlayer.lives <= 2) score += 700;
          else if (pPoisonous < 0.4 && opponent && opponent.lives <= 2) score += 650;
          else score += 100;
          break;

        case 'thiefs_tooth':
          score = 50;
          if (opponent && opponent.items.length > 0) {
            let maxStolenScore = 0;
            for (const stolenItem of opponent.items) {
              if (stolenItem === 'thiefs_tooth') continue;
              const hypotheticalAction: Action = { type: 'use_item', itemType: stolenItem, targetPlayerId: opponent.id };
              const itemScore = calculateActionScore(game, hypotheticalAction, aiPlayer, opponent, pPoisonous);
              maxStolenScore = Math.max(maxStolenScore, itemScore);
            }
            score += maxStolenScore;
          } else {
            score -= 200;
          }
          break;

        default:
          score += 10;
          break;
      }
      break;

    case 'drink':
      if (action.targetPlayerId === opponent?.id && opponent) {
        if (pPoisonous === 1 && opponent.lives === 1) score += 2000;
        else if (pPoisonous >= 0.7 && opponent.lives === 1) score += 1800;
        else if (pPoisonous >= 0.5) score += 500 * pPoisonous;
        else score += 100 * pPoisonous;
      } else if (action.targetPlayerId === aiPlayer.id) {
        if (pPoisonous === 0) score += 700;
        else if (pPoisonous < 0.3 && aiPlayer.lives > 1) score += 300 * (1 - pPoisonous);
        else if (pPoisonous >= 0.5 && aiPlayer.lives <= 1) score -= 1500;
        else score -= 100;
      }
      break;
  }
  return score;
}

export function automatonTakeTurn(game: GameState): { updatedGame: GameState, actionMessage: ActionMessage } {

  const { players, activePlayerIndex } = game;
  const aiPlayer = players[activePlayerIndex];

  if (!aiPlayer.isAI) {
    throw new Error('Automaton Enforcer is not the active player');
  }

  const poisonousGoblets = gobletCountMemory.poisonousGoblets;
  const totalGoblets = gobletCountMemory.poisonousGoblets + gobletCountMemory.holyGoblets;
  const pPoisonous = totalGoblets > 0 ? poisonousGoblets / totalGoblets : 0;
  const opponent = players.find(p => !p.isAI);

  let bestAction: Action | null = null;
  let highestScore = -Infinity;

  if (aiPlayer.statusEffects.includes('thief') && opponent && opponent.items.length > 0) {

    for (const item of opponent.items) {
      if (item === 'thiefs_tooth') continue;
      const action: Action = { type: 'use_item', itemType: item, targetPlayerId: opponent.id };
      const score = calculateActionScore(game, action, aiPlayer, opponent, pPoisonous);
      if (score > highestScore) {
        highestScore = score;
        bestAction = action;
      }
    }
    if (bestAction && bestAction.type === 'use_item') {
      const useItemAction = bestAction;
      const updatedPlayers = game.players.map((p, i) => {
        if (i === activePlayerIndex) {
          return {
            ...p,
            statusEffects: p.statusEffects.filter(s => s !== 'thief')
          };
        }
        return p;
      });


      const finalPlayers = updatedPlayers.map((p) => {
        if (p.id === opponent.id) {
          const newItems = [...p.items];
          const index = newItems.indexOf(useItemAction.itemType);
          if (index > -1) newItems.splice(index, 1);
          return { ...p, items: newItems };
        }
        if (p.id === aiPlayer.id) {
          return { ...p, items: [...p.items, useItemAction.itemType] };
        }
        return p;
      });

      const finalGame = { ...game, players: finalPlayers };
      return playTurn(finalGame, bestAction);
    }
  }

  // if ai knows about goblet from memory 

    if (opponent && game.currentGobletIndex in gobletMemory) {
      if (gobletMemory[game.currentGobletIndex] === 'poisonous') {
        const drinkOpponent: Action = { type: 'drink', targetPlayerId: opponent.id };
        return playTurn(game, drinkOpponent);
      } else {
          const drinkSelf: Action = { type: 'drink', targetPlayerId: aiPlayer.id };
          return playTurn(game, drinkSelf);
      }
  }


  for (const item of aiPlayer.items) {
    let targetPlayerId: string | undefined = undefined;
    if ((item === 'royal_chain_order' || item === 'thiefs_tooth') && opponent) {
      targetPlayerId = opponent.id;
    }
    const action: Action = { type: 'use_item', itemType: item, targetPlayerId };
    const score = calculateActionScore(game, action, aiPlayer, opponent, pPoisonous);
    if (score > highestScore) {
      highestScore = score;
      bestAction = action;
    }
  }

  if (opponent) {
    const drinkOpponent: Action = { type: 'drink', targetPlayerId: opponent.id };
    const score = calculateActionScore(game, drinkOpponent, aiPlayer, opponent, pPoisonous);
    if (score > highestScore) {
      highestScore = score;
      bestAction = drinkOpponent;
    }
  }

  const drinkSelf: Action = { type: 'drink', targetPlayerId: aiPlayer.id };
  const scoreSelf = calculateActionScore(game, drinkSelf, aiPlayer, opponent, pPoisonous);
  if (scoreSelf > highestScore) {
    highestScore = scoreSelf;
    bestAction = drinkSelf;
  }

  if (!bestAction) {
    bestAction = { type: 'drink', targetPlayerId: opponent ? opponent.id : aiPlayer.id };
  }
  
  return playTurn(game, bestAction);
}


export function clearGobletMemory() {
  for (const key in gobletMemory) {
    delete gobletMemory[+key];
  }
}