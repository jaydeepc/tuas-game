import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  GameState, 
  GameAction, 
  Player, 
  TokenType, 
  TokenColor, 
  BoardToken,
  AdvantageCard,
  DisadvantageCard,
  RPSDiceValue,
  RegularDiceValue,
  GamePhase,
  SetupPhase,
  Interaction,
  InteractionType
} from '../types/game';
import { generateAdvantageCards, generateDisadvantageCards } from '../utils/cardGenerator';
import { v4 as uuidv4 } from 'uuid';

// Get initial setup player index from localStorage or default to 0
const initialSetupPlayerIndex = parseInt(localStorage.getItem('setupPlayerIndex') || '0');

// Initial state
const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  setupPlayerIndex: initialSetupPlayerIndex, // Add setupPlayerIndex to track the current player during setup
  boardTokens: [],
  advantageCards: [],
  disadvantageCards: [],
  discardedAdvantageCards: [],
  discardedDisadvantageCards: [],
  dice: {
    regular: { type: 'regular', value: null, rolling: false },
    rps: [
      { type: 'rps', value: null, rolling: false },
      { type: 'rps', value: null, rolling: false }
    ]
  },
  phase: 'setup',
  winner: null,
  boardSize: 64, // Total spaces on the board
  setupStep: 'playerCount',
  duel: {
    player1: null,
    player2: null,
    result: null
  },
  cardInPlay: null,
  currentInteraction: null,
  currentTokenPlacementType: null
};

// Helper functions
const createPlayer = (id: string, name: string): Player => ({
  id,
  name,
  token: {
    id: uuidv4(),
    type: 'rock', // Default, will be changed during setup
    color: 'green', // Default, will be changed during setup
    position: 0,
    owner: id
  },
  hasSkippedTurn: false,
  advantageCards: [],
  disadvantageCards: []
});

const createBoardToken = (type: TokenType, color: TokenColor): BoardToken => ({
  id: uuidv4(),
  type,
  color,
  position: -1 // Will be set during placement
});

const rollDice = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

// Roll RPS dice with 2 sides each for Rock, Paper, and Scissors
const rollRPSDice = (): RPSDiceValue => {
  const roll = rollDice(6);
  if (roll <= 2) return 'rock';
  if (roll <= 4) return 'paper';
  return 'scissors';
};

const determineRPSWinner = (value1: RPSDiceValue, value2: RPSDiceValue): 'player1' | 'player2' | 'draw' => {
  if (value1 === value2) return 'draw';
  
  if (
    (value1 === 'rock' && value2 === 'scissors') ||
    (value1 === 'paper' && value2 === 'rock') ||
    (value1 === 'scissors' && value2 === 'paper')
  ) {
    return 'player1';
  }
  
  return 'player2';
};

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_PLAYER_COUNT': {
      const players = Array.from({ length: action.count }, (_, i) => 
        createPlayer(uuidv4(), `Player ${i + 1}`)
      );
      
      // Create board tokens (6 of each type)
      const boardTokens = [
        ...Array.from({ length: 3 }, () => createBoardToken('rock', 'green')),
        ...Array.from({ length: 3 }, () => createBoardToken('rock', 'orange')),
        ...Array.from({ length: 3 }, () => createBoardToken('paper', 'red')),
        ...Array.from({ length: 3 }, () => createBoardToken('paper', 'blue')),
        ...Array.from({ length: 3 }, () => createBoardToken('scissors', 'yellow')),
        ...Array.from({ length: 3 }, () => createBoardToken('scissors', 'white'))
      ];
      
      return {
        ...state,
        players,
        boardTokens,
        advantageCards: generateAdvantageCards(),
        disadvantageCards: generateDisadvantageCards(),
        setupStep: 'tokenSelection'
      };
    }
    
    case 'SELECT_TOKEN': {
      // Check if this specific token (type and color) is already selected by another player
      const tokenAlreadySelected = state.players.some(player => 
        player.id !== action.playerId && 
        player.token.type === action.tokenType &&
        player.token.color === action.tokenColor
      );
      
      if (tokenAlreadySelected) {
        // Don't allow selection of already selected tokens
        return state;
      }
      
      // For fewer than 4 players, each player should choose a different token type
      if (state.players.length < 4) {
        const tokenTypeAlreadySelected = state.players.some(player => 
          player.id !== action.playerId && 
          player.token.type === action.tokenType
        );
        
        if (tokenTypeAlreadySelected) {
          // Don't allow selection of already selected token types
          return state;
        }
      }
      
      const updatedPlayers = state.players.map(player => {
        if (player.id === action.playerId) {
          return {
            ...player,
            token: {
              ...player.token,
              type: action.tokenType,
              color: action.tokenColor
            }
          };
        }
        return player;
      });
      
      // Check if all players have selected tokens
      const allSelected = updatedPlayers.every(player => 
        player.token.type !== 'rock' || player.token.color !== 'green'
      );
      
      // If all players have selected tokens, move to the token placement phase
      return {
        ...state,
        players: updatedPlayers,
        setupStep: allSelected ? 'rockTokenPlacement' : 'tokenSelection',
        currentTokenPlacementType: allSelected ? 'rock' : null
      };
    }
    
    case 'PLACE_BOARD_TOKEN': {
      // Allow placing tokens of the current type in the current phase
      const token = state.boardTokens.find(t => t.id === action.tokenId);
      
      if (!token) {
        console.error(`Token with ID ${action.tokenId} not found`);
        return state;
      }
      
      console.log(`Placing token ${token.type}-${token.color} at position ${action.position}`);
      
      // Get the current player's token type
      const currentPlayer = state.players[state.setupPlayerIndex];
      const currentPlayerTokenType = currentPlayer?.token?.type;
      
      // Make sure the token type matches the current player's token type
      if (currentPlayerTokenType && token.type !== currentPlayerTokenType) {
        console.error(`Token type ${token.type} doesn't match player's token type ${currentPlayerTokenType}`);
        return state;
      }
      
      // Update the token's position
      const updatedBoardTokens = state.boardTokens.map(t => {
        if (t.id === action.tokenId) {
          return {
            ...t,
            position: action.position
          };
        }
        return t;
      });
      
      // Log the updated board tokens for debugging
      console.log("Updated board tokens:", updatedBoardTokens);
      
      return {
        ...state,
        boardTokens: updatedBoardTokens
      };
    }
    
    case 'PLACE_ALL_TOKENS_RANDOMLY': {
      // Get all unplaced tokens
      const unplacedTokens = state.boardTokens.filter(token => token.position === -1);
      
      // Get all available positions (1 to boardSize-1, excluding 0 which is the start position)
      const availablePositions = Array.from(
        { length: state.boardSize - 1 }, 
        (_, i) => i + 1
      );
      
      // Shuffle the available positions
      const shuffledPositions = [...availablePositions].sort(() => Math.random() - 0.5);
      
      // Assign random positions to unplaced tokens
      const updatedBoardTokens = state.boardTokens.map(token => {
        if (token.position === -1) {
          // Get a random position from the shuffled positions
          const randomPosition = shuffledPositions.pop() || 1;
          return {
            ...token,
            position: randomPosition
          };
        }
        return token;
      });
      
      console.log("Randomly placed all tokens:", updatedBoardTokens);
      
      // Move to the ready phase
      return {
        ...state,
        boardTokens: updatedBoardTokens,
        setupStep: 'ready',
        currentTokenPlacementType: null
      };
    }
    
    case 'NEXT_TOKEN_PLACEMENT_PHASE': {
      // Check if all tokens have been placed
      const allTokensPlaced = state.boardTokens.every(token => token.position !== -1);
      
      if (allTokensPlaced) {
        // All tokens have been placed, move to the ready phase
        return {
          ...state,
          setupStep: 'ready',
          currentTokenPlacementType: null
        };
      }
      
      // If not all tokens are placed, we need to determine which phase to go to next
      // based on which players still have tokens to place
      
      // Check if any player has rock tokens left to place
      const hasRockTokensLeft = state.boardTokens.some(token => 
        token.position === -1 && token.type === 'rock'
      );
      
      // Check if any player has paper tokens left to place
      const hasPaperTokensLeft = state.boardTokens.some(token => 
        token.position === -1 && token.type === 'paper'
      );
      
      // Check if any player has scissors tokens left to place
      const hasScissorsTokensLeft = state.boardTokens.some(token => 
        token.position === -1 && token.type === 'scissors'
      );
      
      // Determine the next phase based on which tokens are left
      let nextSetupStep: SetupPhase;
      let nextTokenType: TokenType | null;
      
      if (hasRockTokensLeft) {
        nextSetupStep = 'rockTokenPlacement';
        nextTokenType = 'rock';
      } else if (hasPaperTokensLeft) {
        nextSetupStep = 'paperTokenPlacement';
        nextTokenType = 'paper';
      } else if (hasScissorsTokensLeft) {
        nextSetupStep = 'scissorsTokenPlacement';
        nextTokenType = 'scissors';
      } else {
        // This shouldn't happen, but just in case
        nextSetupStep = 'remainingTokenPlacement';
        nextTokenType = null;
      }
      
      return {
        ...state,
        setupStep: nextSetupStep,
        currentTokenPlacementType: nextTokenType
      };
    }
    
    case 'START_GAME': {
      // Sort players by token type (rock, paper, scissors)
      const sortedPlayers = [...state.players].sort((a, b) => {
        const order: Record<TokenType, number> = { 'rock': 0, 'paper': 1, 'scissors': 2 };
        return order[a.token.type] - order[b.token.type];
      });
      
      return {
        ...state,
        players: sortedPlayers,
        phase: 'playing'
      };
    }
    
    case 'ROLL_DICE': {
      if (action.diceType === 'regular') {
        const diceValue = rollDice(6) as RegularDiceValue;
        
        return {
          ...state,
          dice: {
            ...state.dice,
            regular: {
              ...state.dice.regular,
              value: diceValue,
              rolling: false
            }
          }
        };
      } else {
        // RPS dice
        const rps1Value = rollRPSDice();
        const rps2Value = rollRPSDice();
        
        const updatedRPSDice = [
          { ...state.dice.rps[0], value: rps1Value, rolling: false },
          { ...state.dice.rps[1], value: rps2Value, rolling: false }
        ];
        
        return {
          ...state,
          dice: {
            ...state.dice,
            rps: updatedRPSDice
          }
        };
      }
    }
    
    case 'MOVE_PLAYER': {
      console.log(`Moving player ${action.playerId} by ${action.spaces} spaces`);
      
      const currentPlayer = state.players.find(player => player.id === action.playerId);
      if (!currentPlayer) {
        console.error(`Player with ID ${action.playerId} not found`);
        return state;
      }
      
      console.log(`Current player position: ${currentPlayer.token.position}`);
      
      const updatedPlayers = state.players.map(player => {
        if (player.id === action.playerId) {
          const newPosition = Math.min(player.token.position + action.spaces, state.boardSize);
          console.log(`New position for player ${player.id}: ${newPosition}`);
          
          return {
            ...player,
            token: {
              ...player.token,
              position: newPosition
            }
          };
        }
        return player;
      });
      
      // Check for winner
      const winner = updatedPlayers.find(player => player.token.position >= state.boardSize) || null;
      if (winner) {
        return {
          ...state,
          players: updatedPlayers,
          phase: 'gameOver',
          winner
        };
      }
      
      // Check for interactions after movement
      const movedPlayer = updatedPlayers.find(player => player.id === action.playerId)!;
      const playerPosition = movedPlayer.token.position;
      
      // Check for board token interactions
      const boardTokensAtPosition = state.boardTokens.filter(token => token.position === playerPosition);
      
      if (boardTokensAtPosition.length > 0) {
        const boardToken = boardTokensAtPosition[0]; // Just use the first one for simplicity
        
        // Create interaction based on player token type and board token type
        let interaction: Interaction | null = null;
        
        if (movedPlayer.token.type === 'rock') {
          if (boardToken.type === 'paper') {
            // Rock player meets Paper board token: move back 2 spaces or draw disadvantage card
            interaction = {
              type: 'moveBackOrDrawCard',
              sourcePlayer: movedPlayer,
              targetPlayer: null,
              boardToken,
              options: ['Move back 2 spaces', 'Draw disadvantage card']
            };
          } else if (boardToken.type === 'scissors') {
            // Rock player meets Scissors board token: move forward 2 spaces or draw advantage card
            interaction = {
              type: 'moveForwardOrDrawCard',
              sourcePlayer: movedPlayer,
              targetPlayer: null,
              boardToken,
              options: ['Move forward 2 spaces', 'Draw advantage card']
            };
          } else if (boardToken.type === 'rock') {
            // Rock player meets Rock board token: call for duel or skip
            const eligiblePlayers = updatedPlayers.filter(p => 
              p.id !== movedPlayer.id && p.token.position > 0
            );
            
            if (eligiblePlayers.length > 0) {
              interaction = {
                type: 'callDuelOrSkip',
                sourcePlayer: movedPlayer,
                targetPlayer: null,
                boardToken,
                options: ['Call for duel', 'Skip']
              };
            }
          }
        } else if (movedPlayer.token.type === 'paper') {
          if (boardToken.type === 'scissors') {
            // Paper player meets Scissors board token: move back 2 spaces or draw disadvantage card
            interaction = {
              type: 'moveBackOrDrawCard',
              sourcePlayer: movedPlayer,
              targetPlayer: null,
              boardToken,
              options: ['Move back 2 spaces', 'Draw disadvantage card']
            };
          } else if (boardToken.type === 'rock') {
            // Paper player meets Rock board token: move forward 2 spaces or draw advantage card
            interaction = {
              type: 'moveForwardOrDrawCard',
              sourcePlayer: movedPlayer,
              targetPlayer: null,
              boardToken,
              options: ['Move forward 2 spaces', 'Draw advantage card']
            };
          } else if (boardToken.type === 'paper') {
            // Paper player meets Paper board token: call for duel or skip
            const eligiblePlayers = updatedPlayers.filter(p => 
              p.id !== movedPlayer.id && p.token.position > 0
            );
            
            if (eligiblePlayers.length > 0) {
              interaction = {
                type: 'callDuelOrSkip',
                sourcePlayer: movedPlayer,
                targetPlayer: null,
                boardToken,
                options: ['Call for duel', 'Skip']
              };
            }
          }
        } else if (movedPlayer.token.type === 'scissors') {
          if (boardToken.type === 'rock') {
            // Scissors player meets Rock board token: move back 2 spaces or draw disadvantage card
            interaction = {
              type: 'moveBackOrDrawCard',
              sourcePlayer: movedPlayer,
              targetPlayer: null,
              boardToken,
              options: ['Move back 2 spaces', 'Draw disadvantage card']
            };
          } else if (boardToken.type === 'paper') {
            // Scissors player meets Paper board token: move forward 2 spaces or draw advantage card
            interaction = {
              type: 'moveForwardOrDrawCard',
              sourcePlayer: movedPlayer,
              targetPlayer: null,
              boardToken,
              options: ['Move forward 2 spaces', 'Draw advantage card']
            };
          } else if (boardToken.type === 'scissors') {
            // Scissors player meets Scissors board token: call for duel or skip
            const eligiblePlayers = updatedPlayers.filter(p => 
              p.id !== movedPlayer.id && p.token.position > 0
            );
            
            if (eligiblePlayers.length > 0) {
              interaction = {
                type: 'callDuelOrSkip',
                sourcePlayer: movedPlayer,
                targetPlayer: null,
                boardToken,
                options: ['Call for duel', 'Skip']
              };
            }
          }
        }
        
        if (interaction) {
          return {
            ...state,
            players: updatedPlayers,
            phase: 'interaction',
            currentInteraction: interaction
          };
        }
      }
      
      // Check for player token interactions
      const playersAtPosition = updatedPlayers.filter(
        player => player.id !== movedPlayer.id && player.token.position === playerPosition
      );
      
      if (playersAtPosition.length > 0) {
        const otherPlayer = playersAtPosition[0]; // Just use the first one for simplicity
        
        // Create interaction based on player token types
        let interaction: Interaction | null = null;
        
        if (movedPlayer.token.type === 'rock') {
          if (otherPlayer.token.type === 'scissors') {
            // Rock player meets Scissors player: draw advantage card or give disadvantage card
            interaction = {
              type: 'drawAdvantageOrGiveDisadvantage',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Draw advantage card', 'Give disadvantage card']
            };
          } else if (otherPlayer.token.type === 'paper') {
            // Rock player meets Paper player: draw disadvantage card or give advantage card
            interaction = {
              type: 'drawDisadvantageOrGiveAdvantage',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Draw disadvantage card', 'Give advantage card']
            };
          } else if (otherPlayer.token.type === 'rock') {
            // Rock player meets Rock player: call for duel
            interaction = {
              type: 'callDuel',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Call for duel']
            };
          }
        } else if (movedPlayer.token.type === 'paper') {
          if (otherPlayer.token.type === 'rock') {
            // Paper player meets Rock player: draw advantage card or give disadvantage card
            interaction = {
              type: 'drawAdvantageOrGiveDisadvantage',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Draw advantage card', 'Give disadvantage card']
            };
          } else if (otherPlayer.token.type === 'scissors') {
            // Paper player meets Scissors player: draw disadvantage card or give advantage card
            interaction = {
              type: 'drawDisadvantageOrGiveAdvantage',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Draw disadvantage card', 'Give advantage card']
            };
          } else if (otherPlayer.token.type === 'paper') {
            // Paper player meets Paper player: call for duel
            interaction = {
              type: 'callDuel',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Call for duel']
            };
          }
        } else if (movedPlayer.token.type === 'scissors') {
          if (otherPlayer.token.type === 'paper') {
            // Scissors player meets Paper player: draw advantage card or give disadvantage card
            interaction = {
              type: 'drawAdvantageOrGiveDisadvantage',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Draw advantage card', 'Give disadvantage card']
            };
          } else if (otherPlayer.token.type === 'rock') {
            // Scissors player meets Rock player: draw disadvantage card or give advantage card
            interaction = {
              type: 'drawDisadvantageOrGiveAdvantage',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Draw disadvantage card', 'Give advantage card']
            };
          } else if (otherPlayer.token.type === 'scissors') {
            // Scissors player meets Scissors player: call for duel
            interaction = {
              type: 'callDuel',
              sourcePlayer: movedPlayer,
              targetPlayer: otherPlayer,
              boardToken: null,
              options: ['Call for duel']
            };
          }
        }
        
        if (interaction) {
          return {
            ...state,
            players: updatedPlayers,
            phase: 'interaction',
            currentInteraction: interaction
          };
        }
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    }
    
    case 'DRAW_CARD': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (action.cardType === 'advantage') {
        // If advantage deck is empty, shuffle discard pile
        let advantageCards = [...state.advantageCards];
        let discardedAdvantageCards = [...state.discardedAdvantageCards];
        
        if (advantageCards.length === 0) {
          advantageCards = discardedAdvantageCards;
          discardedAdvantageCards = [];
        }
        
        if (advantageCards.length === 0) return state; // No cards to draw
        
        const drawnCard = advantageCards[0];
        const updatedPlayers = state.players.map(player => {
          if (player.id === currentPlayer.id) {
            return {
              ...player,
              advantageCards: [...player.advantageCards, drawnCard]
            };
          }
          return player;
        });
        
        // Automatically play the card to show its effect
        return {
          ...state,
          players: updatedPlayers,
          advantageCards: advantageCards.slice(1),
          cardInPlay: drawnCard,
          phase: 'cardEffect'
        };
      } else {
        // If disadvantage deck is empty, shuffle discard pile
        let disadvantageCards = [...state.disadvantageCards];
        let discardedDisadvantageCards = [...state.discardedDisadvantageCards];
        
        if (disadvantageCards.length === 0) {
          disadvantageCards = discardedDisadvantageCards;
          discardedDisadvantageCards = [];
        }
        
        if (disadvantageCards.length === 0) return state; // No cards to draw
        
        const drawnCard = disadvantageCards[0];
        const updatedPlayers = state.players.map(player => {
          if (player.id === currentPlayer.id) {
            return {
              ...player,
              disadvantageCards: [...player.disadvantageCards, drawnCard]
            };
          }
          return player;
        });
        
        // Automatically play the card to show its effect
        return {
          ...state,
          players: updatedPlayers,
          disadvantageCards: disadvantageCards.slice(1),
          cardInPlay: drawnCard,
          phase: 'cardEffect'
        };
      }
    }
    
    case 'PLAY_CARD': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      let cardToPlay: AdvantageCard | DisadvantageCard | undefined;
      let updatedPlayers = [...state.players];
      let updatedDiscardedAdvantageCards = [...state.discardedAdvantageCards];
      let updatedDiscardedDisadvantageCards = [...state.discardedDisadvantageCards];
      
      // Find the card in player's hand
      const advantageCardIndex = currentPlayer.advantageCards.findIndex(card => card.id === action.cardId);
      if (advantageCardIndex !== -1) {
        cardToPlay = currentPlayer.advantageCards[advantageCardIndex];
        
        // Remove card from player's hand
        updatedPlayers = state.players.map(player => {
          if (player.id === currentPlayer.id) {
            return {
              ...player,
              advantageCards: [
                ...player.advantageCards.slice(0, advantageCardIndex),
                ...player.advantageCards.slice(advantageCardIndex + 1)
              ]
            };
          }
          return player;
        });
        
        // Add to discard pile
        updatedDiscardedAdvantageCards = [...updatedDiscardedAdvantageCards, cardToPlay];
      } else {
        const disadvantageCardIndex = currentPlayer.disadvantageCards.findIndex(card => card.id === action.cardId);
        if (disadvantageCardIndex !== -1) {
          cardToPlay = currentPlayer.disadvantageCards[disadvantageCardIndex];
          
          // Remove card from player's hand
          updatedPlayers = state.players.map(player => {
            if (player.id === currentPlayer.id) {
              return {
                ...player,
                disadvantageCards: [
                  ...player.disadvantageCards.slice(0, disadvantageCardIndex),
                  ...player.disadvantageCards.slice(disadvantageCardIndex + 1)
                ]
              };
            }
            return player;
          });
          
          // Add to discard pile
          updatedDiscardedDisadvantageCards = [...updatedDiscardedDisadvantageCards, cardToPlay];
        }
      }
      
      if (!cardToPlay) return state;
      
      // Apply card effect
      let updatedState: GameState = {
        ...state,
        players: updatedPlayers,
        discardedAdvantageCards: updatedDiscardedAdvantageCards,
        discardedDisadvantageCards: updatedDiscardedDisadvantageCards,
        cardInPlay: cardToPlay,
        phase: 'cardEffect'
      };
      
      // Apply the effect based on the card type
      if (cardToPlay.effect.type === 'move') {
        const moveEffect = cardToPlay.effect;
        // Move the current player by the specified number of spaces
        updatedState = {
          ...updatedState,
          players: updatedState.players.map(player => {
            if (player.id === currentPlayer.id) {
              const newPosition = Math.max(0, Math.min(state.boardSize, player.token.position + moveEffect.spaces));
              return {
                ...player,
                token: {
                  ...player.token,
                  position: newPosition
                }
              };
            }
            return player;
          })
        };
        
        // Check for winner
        const winner = updatedState.players.find(player => player.token.position >= state.boardSize);
        if (winner) {
          updatedState = {
            ...updatedState,
            phase: 'gameOver' as GamePhase,
            winner
          };
        }
      } else if (cardToPlay.effect.type === 'skipTurn') {
        // Mark the next player to skip their turn
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        updatedState = {
          ...updatedState,
          players: updatedState.players.map((player, index) => {
            if (index === nextPlayerIndex) {
              return {
                ...player,
                hasSkippedTurn: true
              };
            }
            return player;
          })
        };
      } else if (cardToPlay.effect.type === 'drawCards') {
        const drawCardsEffect = cardToPlay.effect;
        // This will be handled in the UI - player will draw additional cards
        console.log(`Player should draw ${drawCardsEffect.count} more cards`);
      }
      
      return updatedState;
    }
    
    case 'INITIATE_DUEL': {
      const player1 = state.players.find(player => player.id === action.player1Id);
      const player2 = state.players.find(player => player.id === action.player2Id);
      
      if (!player1 || !player2) return state;
      
      return {
        ...state,
        phase: 'duel',
        duel: {
          player1,
          player2,
          result: null
        }
      };
    }
    
    case 'DUEL_RESULT': {
      if (!state.duel.player1 || !state.duel.player2) return state;
      
      const result = determineRPSWinner(action.player1Value, action.player2Value);
      
      if (result === 'draw') {
        return {
          ...state,
          duel: {
            ...state.duel,
            result
          }
        };
      }
      
      const loser = result === 'player1' ? state.duel.player2 : state.duel.player1;
      
      // Move loser back 4 spaces
      const updatedPlayers = state.players.map(player => {
        if (player.id === loser.id) {
          return {
            ...player,
            token: {
              ...player.token,
              position: Math.max(0, player.token.position - 4)
            }
          };
        }
        return player;
      });
      
      return {
        ...state,
        players: updatedPlayers,
        duel: {
          ...state.duel,
          result
        },
        phase: 'playing'
      };
    }
    
    case 'SET_INTERACTION': {
      return {
        ...state,
        phase: 'interaction',
        currentInteraction: action.interaction
      };
    }
    
    case 'RESOLVE_INTERACTION': {
      if (!state.currentInteraction) return state;
      
      const { type, sourcePlayer, targetPlayer, boardToken, options } = state.currentInteraction;
      
      if (!sourcePlayer) return state;
      
      const choiceIndex = options.indexOf(action.choice);
      if (choiceIndex === -1) return state;
      
      let updatedPlayers = [...state.players];
      let updatedPhase: GamePhase = 'playing';
      let updatedDuel = { ...state.duel };
      
      switch (type) {
        case 'moveBackOrDrawCard': {
          if (choiceIndex === 0) {
            // Move back 2 spaces
            updatedPlayers = updatedPlayers.map(player => {
              if (player.id === sourcePlayer.id) {
                return {
                  ...player,
                  token: {
                    ...player.token,
                    position: Math.max(0, player.token.position - 2)
                  }
                };
              }
              return player;
            });
          } else {
            // Draw disadvantage card - handled by the UI
          }
          break;
        }
        case 'moveForwardOrDrawCard': {
          if (choiceIndex === 0) {
            // Move forward 2 spaces
            updatedPlayers = updatedPlayers.map(player => {
              if (player.id === sourcePlayer.id) {
                return {
                  ...player,
                  token: {
                    ...player.token,
                    position: Math.min(state.boardSize, player.token.position + 2)
                  }
                };
              }
              return player;
            });
            
            // Check for winner
            const winner = updatedPlayers.find(player => player.token.position >= state.boardSize);
            if (winner) {
              updatedPhase = 'gameOver';
            }
          } else {
            // Draw advantage card - handled by the UI
          }
          break;
        }
        case 'callDuelOrSkip': {
          if (choiceIndex === 0) {
            // Call for duel - handled by the UI
            updatedPhase = 'playing'; // Will be set to 'duel' when INITIATE_DUEL is called
          } else {
            // Skip - do nothing
          }
          break;
        }
        case 'drawAdvantageOrGiveDisadvantage': {
          // Both options handled by the UI
          break;
        }
        case 'drawDisadvantageOrGiveAdvantage': {
          // Both options handled by the UI
          break;
        }
        case 'callDuel': {
          // Handled by the UI
          updatedPhase = 'playing'; // Will be set to 'duel' when INITIATE_DUEL is called
          break;
        }
      }
      
      return {
        ...state,
        players: updatedPlayers,
        phase: updatedPhase,
        currentInteraction: null,
        duel: updatedDuel
      };
    }
    
    case 'GIVE_CARD': {
      const fromPlayer = state.players.find(player => player.id === action.fromPlayerId);
      const toPlayer = state.players.find(player => player.id === action.toPlayerId);
      
      if (!fromPlayer || !toPlayer) return state;
      
      if (action.cardType === 'advantage') {
        // If advantage deck is empty, shuffle discard pile
        let advantageCards = [...state.advantageCards];
        let discardedAdvantageCards = [...state.discardedAdvantageCards];
        
        if (advantageCards.length === 0) {
          advantageCards = discardedAdvantageCards;
          discardedAdvantageCards = [];
        }
        
        if (advantageCards.length === 0) return state; // No cards to give
        
        const drawnCard = advantageCards[0];
        const updatedPlayers = state.players.map(player => {
          if (player.id === toPlayer.id) {
            return {
              ...player,
              advantageCards: [...player.advantageCards, drawnCard]
            };
          }
          return player;
        });
        
        return {
          ...state,
          players: updatedPlayers,
          advantageCards: advantageCards.slice(1)
        };
      } else {
        // If disadvantage deck is empty, shuffle discard pile
        let disadvantageCards = [...state.disadvantageCards];
        let discardedDisadvantageCards = [...state.discardedDisadvantageCards];
        
        if (disadvantageCards.length === 0) {
          disadvantageCards = discardedDisadvantageCards;
          discardedDisadvantageCards = [];
        }
        
        if (disadvantageCards.length === 0) return state; // No cards to give
        
        const drawnCard = disadvantageCards[0];
        const updatedPlayers = state.players.map(player => {
          if (player.id === toPlayer.id) {
            return {
              ...player,
              disadvantageCards: [...player.disadvantageCards, drawnCard]
            };
          }
          return player;
        });
        
        return {
          ...state,
          players: updatedPlayers,
          disadvantageCards: disadvantageCards.slice(1)
        };
      }
    }
    
    case 'END_TURN': {
      // Reset only RPS dice values, keep regular dice value for reference
      const updatedDice = {
        regular: { ...state.dice.regular }, // Keep the regular dice value
        rps: state.dice.rps.map(die => ({ ...die, value: null }))
      };
      
      // Reset duel state
      const updatedDuel = {
        player1: null,
        player2: null,
        result: null
      };
      
      // Move to next player
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      
      // Check if next player should skip turn
      const nextPlayer = state.players[nextPlayerIndex];
      if (nextPlayer.hasSkippedTurn) {
        // Reset skip turn flag and move to the next player
        const updatedPlayers = state.players.map((player, index) => {
          if (index === nextPlayerIndex) {
            return {
              ...player,
              hasSkippedTurn: false
            };
          }
          return player;
        });
        
        return {
          ...state,
          players: updatedPlayers,
          currentPlayerIndex: (nextPlayerIndex + 1) % state.players.length,
          dice: updatedDice,
          duel: updatedDuel,
          cardInPlay: null,
          phase: 'playing' // Always reset to playing phase for the next player
        };
      }
      
      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        dice: updatedDice,
        duel: updatedDuel,
        cardInPlay: null,
        phase: 'playing' // Always reset to playing phase for the next player
      };
    }
    
    case 'SET_SETUP_PLAYER_INDEX': {
      // Update the setupPlayerIndex in the state
      // Also save to localStorage for persistence
      localStorage.setItem('setupPlayerIndex', action.index.toString());
      
      return {
        ...state,
        setupPlayerIndex: action.index
      };
    }
    
    case 'RESET_GAME':
      return initialState;
      
    default:
      return state;
  }
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
