export type TokenType = 'rock' | 'paper' | 'scissors';
export type TokenColor = 'green' | 'orange' | 'red' | 'blue' | 'yellow' | 'white';

export interface PlayerToken {
  id: string;
  type: TokenType;
  color: TokenColor;
  position: number;
  owner: string | null;
}

export interface BoardToken {
  id: string;
  type: TokenType;
  color: TokenColor;
  position: number;
}

export interface Player {
  id: string;
  name: string;
  token: PlayerToken;
  hasSkippedTurn: boolean;
  advantageCards: AdvantageCard[];
  disadvantageCards: DisadvantageCard[];
}

export type CardType = 'advantage' | 'disadvantage';

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  effect: CardEffect;
}

export type CardEffect = 
  | { type: 'move', spaces: number }
  | { type: 'skipTurn' }
  | { type: 'duel', players: number }
  | { type: 'moveToken' }
  | { type: 'drawCards', count: number }
  | { type: 'giveCard', cardType: CardType };

export interface AdvantageCard extends Card {
  type: 'advantage';
}

export interface DisadvantageCard extends Card {
  type: 'disadvantage';
}

export type DiceType = 'regular' | 'rps';
export type RPSDiceValue = TokenType;
export type RegularDiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceValue = RPSDiceValue | RegularDiceValue;

export interface Dice {
  type: DiceType;
  value: DiceValue | null;
  rolling: boolean;
}

export interface RegularDice extends Dice {
  type: 'regular';
  value: RegularDiceValue | null;
}

export interface RPSDice extends Dice {
  type: 'rps';
  value: RPSDiceValue | null;
}

export type GamePhase = 'setup' | 'playing' | 'duel' | 'cardEffect' | 'interaction' | 'gameOver';

export type InteractionType = 
  | 'moveBackOrDrawCard' 
  | 'moveForwardOrDrawCard' 
  | 'callDuelOrSkip'
  | 'drawAdvantageOrGiveDisadvantage'
  | 'drawDisadvantageOrGiveAdvantage'
  | 'callDuel';

export interface Interaction {
  type: InteractionType;
  sourcePlayer: Player | null;
  targetPlayer: Player | null;
  boardToken: BoardToken | null;
  options: string[];
}

export type SetupPhase = 
  | 'playerCount' 
  | 'tokenSelection' 
  | 'rockTokenPlacement' 
  | 'paperTokenPlacement' 
  | 'scissorsTokenPlacement' 
  | 'remainingTokenPlacement'
  | 'ready';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  setupPlayerIndex: number; // Track the current player during setup
  boardTokens: BoardToken[];
  advantageCards: AdvantageCard[];
  disadvantageCards: DisadvantageCard[];
  discardedAdvantageCards: AdvantageCard[];
  discardedDisadvantageCards: DisadvantageCard[];
  dice: {
    regular: RegularDice;
    rps: RPSDice[];
  };
  phase: GamePhase;
  winner: Player | null;
  boardSize: number;
  setupStep: SetupPhase;
  duel: {
    player1: Player | null;
    player2: Player | null;
    result: 'player1' | 'player2' | 'draw' | null;
  };
  cardInPlay: AdvantageCard | DisadvantageCard | null;
  currentInteraction: Interaction | null;
  currentTokenPlacementType: TokenType | null;
}

export type GameAction = 
  | { type: 'SET_PLAYER_COUNT', count: number }
  | { type: 'SELECT_TOKEN', playerId: string, tokenType: TokenType, tokenColor: TokenColor }
  | { type: 'PLACE_BOARD_TOKEN', tokenId: string, position: number }
  | { type: 'PLACE_ALL_TOKENS_RANDOMLY' }
  | { type: 'NEXT_TOKEN_PLACEMENT_PHASE' }
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE', diceType: DiceType, value?: DiceValue }
  | { type: 'MOVE_PLAYER', playerId: string, spaces: number }
  | { type: 'DRAW_CARD', cardType: CardType }
  | { type: 'GIVE_CARD', fromPlayerId: string, toPlayerId: string, cardType: CardType }
  | { type: 'PLAY_CARD', cardId: string }
  | { type: 'INITIATE_DUEL', player1Id: string, player2Id: string }
  | { type: 'DUEL_RESULT', player1Value: RPSDiceValue, player2Value: RPSDiceValue }
  | { type: 'SET_INTERACTION', interaction: Interaction }
  | { type: 'RESOLVE_INTERACTION', choice: string }
  | { type: 'END_TURN' }
  | { type: 'SET_SETUP_PLAYER_INDEX', index: number }
  | { type: 'RESET_GAME' };
