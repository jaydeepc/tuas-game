import { v4 as uuidv4 } from 'uuid';
import { AdvantageCard, DisadvantageCard } from '../types/game';

export const generateAdvantageCards = (): AdvantageCard[] => {
  const moveAhead5: AdvantageCard[] = Array(2).fill(null).map(() => ({
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Swift Advance',
    description: 'Move ahead 5 spaces',
    effect: { type: 'move' as const, spaces: 5 }
  }));
  
  const moveAhead4: AdvantageCard[] = Array(3).fill(null).map(() => ({
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Quick Advance',
    description: 'Move ahead 4 spaces',
    effect: { type: 'move' as const, spaces: 4 }
  }));
  
  const skipTurn: AdvantageCard[] = Array(4).fill(null).map(() => ({
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Time Freeze',
    description: 'Make a player skip a turn',
    effect: { type: 'skipTurn' as const }
  }));
  
  const forcedDuel: AdvantageCard[] = Array(4).fill(null).map(() => ({
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Forced Duel',
    description: 'Make any 2 players play a Rock Paper Scissor Duel',
    effect: { type: 'duel' as const, players: 2 }
  }));
  
  const moveToken: AdvantageCard[] = Array(3).fill(null).map(() => ({
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Token Shift',
    description: 'Move any one Board token on the board',
    effect: { type: 'moveToken' as const }
  }));
  
  const drawCards: AdvantageCard = {
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Double Draw',
    description: 'Pick 2 advantage cards',
    effect: { type: 'drawCards' as const, count: 2 }
  };
  
  const giveCard: AdvantageCard[] = Array(3).fill(null).map(() => ({
    id: uuidv4(),
    type: 'advantage' as const,
    title: 'Bad Luck Charm',
    description: 'Give a disadvantage card to any player',
    effect: { type: 'giveCard' as const, cardType: 'disadvantage' as const }
  }));
  
  const cards: AdvantageCard[] = [
    ...moveAhead5,
    ...moveAhead4,
    ...skipTurn,
    ...forcedDuel,
    ...moveToken,
    drawCards,
    ...giveCard
  ];
  
  // Shuffle the cards
  return shuffleArray(cards);
};

export const generateDisadvantageCards = (): DisadvantageCard[] => {
  const moveBack5: DisadvantageCard[] = Array(2).fill(null).map(() => ({
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Major Setback',
    description: 'Move back 5 spaces',
    effect: { type: 'move' as const, spaces: -5 }
  }));
  
  const moveBack4: DisadvantageCard[] = Array(3).fill(null).map(() => ({
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Significant Setback',
    description: 'Move back 4 spaces',
    effect: { type: 'move' as const, spaces: -4 }
  }));
  
  const moveBack3: DisadvantageCard[] = Array(4).fill(null).map(() => ({
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Minor Setback',
    description: 'Move back 3 spaces',
    effect: { type: 'move' as const, spaces: -3 }
  }));
  
  const skipTurn: DisadvantageCard[] = Array(5).fill(null).map(() => ({
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Time Warp',
    description: 'Skip a turn',
    effect: { type: 'skipTurn' as const }
  }));
  
  const opponentBoost: DisadvantageCard[] = Array(2).fill(null).map(() => ({
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Opponent Boost',
    description: 'Make any player move 2 places ahead',
    effect: { type: 'move' as const, spaces: 2 }
  }));
  
  const drawCards: DisadvantageCard = {
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Double Trouble',
    description: 'Pick 2 disadvantage cards',
    effect: { type: 'drawCards' as const, count: 2 }
  };
  
  const giveCard: DisadvantageCard[] = Array(3).fill(null).map(() => ({
    id: uuidv4(),
    type: 'disadvantage' as const,
    title: 'Karma',
    description: 'Give an advantage card to the player because of whom you got a disadvantage card',
    effect: { type: 'giveCard' as const, cardType: 'advantage' as const }
  }));
  
  const cards: DisadvantageCard[] = [
    ...moveBack5,
    ...moveBack4,
    ...moveBack3,
    ...skipTurn,
    ...opponentBoost,
    drawCards,
    ...giveCard
  ];
  
  // Shuffle the cards
  return shuffleArray(cards);
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
