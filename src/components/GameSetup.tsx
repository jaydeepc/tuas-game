import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SetupContainer, 
  SetupStep, 
  SetupTitle, 
  TokenSelection, 
  TokenOption,
  Button
} from './styled/GameElements';
import { useGame } from '../context/GameContext';
import { TokenType, TokenColor, SetupPhase } from '../types/game';

const GameSetup: React.FC = () => {
  const { state, dispatch } = useGame();
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [selectedPosition, setSelectedPosition] = useState<number>(-1);
  const [selectedBoardToken, setSelectedBoardToken] = useState<string | null>(null);
  const [currentTokenType, setCurrentTokenType] = useState<TokenType | null>(null);
  // Use setupPlayerIndex from global state
  const isInitialMount = useRef(true);
  
  // Log for debugging
  console.log("Current setup player index:", state.setupPlayerIndex);
  console.log("Players:", state.players);
  console.log("Current setup step:", state.setupStep);
  
  // Save setupPlayerIndex to localStorage whenever it changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    console.log("Saving setup player index to localStorage:", state.setupPlayerIndex);
    localStorage.setItem('setupPlayerIndex', state.setupPlayerIndex.toString());
  }, [state.setupPlayerIndex]);
  
  // Update UI when board tokens change
  useEffect(() => {
    console.log("Board tokens updated:", state.boardTokens);
  }, [state.boardTokens]);
  
  // Initialize the game state when the component mounts
  useEffect(() => {
    // If we're in a token placement phase, make sure the setupPlayerIndex is valid
    if (state.setupStep === 'rockTokenPlacement' || 
        state.setupStep === 'paperTokenPlacement' || 
        state.setupStep === 'scissorsTokenPlacement' || 
        state.setupStep === 'remainingTokenPlacement') {
      
      // Make sure setupPlayerIndex is within bounds
      if (state.setupPlayerIndex >= state.players.length) {
        dispatch({ 
          type: 'SET_SETUP_PLAYER_INDEX', 
          index: 0 
        });
      }
    }
  }, [state.setupStep, state.players.length]);
  
  // Available token types and colors
  const availableTokens = [
    { type: 'rock' as TokenType, color: 'green' as TokenColor },
    { type: 'rock' as TokenType, color: 'orange' as TokenColor },
    { type: 'paper' as TokenType, color: 'red' as TokenColor },
    { type: 'paper' as TokenType, color: 'blue' as TokenColor },
    { type: 'scissors' as TokenType, color: 'yellow' as TokenColor },
    { type: 'scissors' as TokenType, color: 'white' as TokenColor }
  ];
  
  // Handle player count selection
  const handleSetPlayerCount = () => {
    dispatch({ type: 'SET_PLAYER_COUNT', count: playerCount });
  };
  
  // Handle token selection
  const handleSelectToken = (playerId: string, tokenType: TokenType, tokenColor: TokenColor) => {
    dispatch({ 
      type: 'SELECT_TOKEN', 
      playerId, 
      tokenType, 
      tokenColor 
    });
  };
  
  // Handle board token placement
  const handlePlaceBoardToken = (tokenId: string, position: number) => {
    console.log(`Placing token ${tokenId} at position ${position}`);
    
    // First, dispatch the action to place the token
    dispatch({ 
      type: 'PLACE_BOARD_TOKEN', 
      tokenId, 
      position 
    });
    
    // Clear selection state
    setSelectedBoardToken(null);
    setSelectedPosition(-1);
    
    // Get the current player and their token type
    const currentPlayer = state.players[state.setupPlayerIndex];
    const currentPlayerTokenType = currentPlayer.token.type;
    
    // Get the updated board tokens after placement
    const updatedBoardTokens = state.boardTokens.map(token => {
      if (token.id === tokenId) {
        return { ...token, position };
      }
      return token;
    });
    
    // Check if the current player has placed all their tokens
    const currentPlayerTokensLeft = updatedBoardTokens
      .filter(token => 
        token.position === -1 && // Not placed yet
        token.type === currentPlayerTokenType // Matches player's token type
      ).length;
    
    console.log(`Player ${currentPlayer.name} has ${currentPlayerTokensLeft} tokens left to place`);
    
    // Move to the next player
    let nextPlayerIndex = (state.setupPlayerIndex + 1) % state.players.length;
    
    // Check if all tokens have been placed
    const allTokensPlaced = updatedBoardTokens.every(token => token.position !== -1);
    
    if (allTokensPlaced) {
      // All tokens have been placed, move to the ready phase
      dispatch({ type: 'NEXT_TOKEN_PLACEMENT_PHASE' });
      dispatch({ type: 'SET_SETUP_PLAYER_INDEX', index: 0 }); // Reset to first player
    } else {
      // Find the next player who still has tokens to place
      let foundNextPlayer = false;
      let checkedAllPlayers = false;
      let startIndex = nextPlayerIndex;
      
      while (!foundNextPlayer && !checkedAllPlayers) {
        const nextPlayer = state.players[nextPlayerIndex];
        const nextPlayerTokenType = nextPlayer.token.type;
        
        const nextPlayerTokensLeft = updatedBoardTokens
          .filter(token => 
            token.position === -1 && // Not placed yet
            token.type === nextPlayerTokenType // Matches player's token type
          ).length;
        
        if (nextPlayerTokensLeft > 0) {
          // This player still has tokens to place
          foundNextPlayer = true;
        } else {
          // Try the next player
          nextPlayerIndex = (nextPlayerIndex + 1) % state.players.length;
          
          // Check if we've gone through all players
          if (nextPlayerIndex === startIndex) {
            checkedAllPlayers = true;
          }
        }
      }
      
      console.log(`Moving to next player: ${nextPlayerIndex}`);
      dispatch({ type: 'SET_SETUP_PLAYER_INDEX', index: nextPlayerIndex });
    }
  };
  
  // Handle game start
  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };
  
  // Check if a specific token (type and color) is already selected by any player
  const isTokenSelected = (tokenType: TokenType, tokenColor: TokenColor) => {
    return state.players.some(player => 
      player.token.type === tokenType && player.token.color === tokenColor
    );
  };
  
  // Check if a position already has a board token
  const isPositionOccupied = (position: number) => {
    return state.boardTokens.some(token => token.position === position);
  };
  
  // Render player count selection
  const renderPlayerCountSelection = () => (
    <SetupStep>
      <SetupTitle>Select Number of Players</SetupTitle>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {[2, 3, 4, 5, 6].map(count => (
          <Button
            key={count}
            variant={playerCount === count ? 'primary' : 'secondary'}
            onClick={() => setPlayerCount(count)}
          >
            {count}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Button onClick={handleSetPlayerCount}>
          Continue
        </Button>
      </div>
    </SetupStep>
  );
  
  // Render token selection
  const renderTokenSelection = () => (
    <SetupStep>
      <SetupTitle>Select Player Tokens</SetupTitle>
      
      <div style={{ marginBottom: '30px' }}>
        {state.players.map((player, index) => (
          <div 
            key={player.id} 
            style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#1E1E1E', 
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>{player.name}</h3>
            
            <TokenSelection>
              {availableTokens.map(token => {
                const isSelected = player.token.type === token.type && player.token.color === token.color;
                const isDisabled = isTokenSelected(token.type, token.color) && !isSelected;
                
                return (
                  <TokenOption
                    key={`${token.type}-${token.color}`}
                    tokenType={token.type}
                    tokenColor={token.color}
                    isSelected={isSelected}
                    style={{ 
                      opacity: isDisabled ? 0.3 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => !isDisabled && handleSelectToken(player.id, token.type, token.color)}
                  >
                    {token.type === 'rock' ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">R</text>
                        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    ) : token.type === 'paper' ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">P</text>
                        <path d="M13 9h5.5L13 3.5V9z" />
                        <path d="M8 16h8v2H8zm0-4h8v2H8z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">S</text>
                        <path d="M14.5 14.5L12 12l2.5-2.5m-5 5L12 12 9.5 9.5" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    )}
                  </TokenOption>
                );
              })}
            </TokenSelection>
          </div>
        ))}
      </div>
    </SetupStep>
  );
  
  // Get the title for the current token placement phase
  const getTokenPlacementTitle = (): string => {
    switch (state.setupStep) {
      case 'rockTokenPlacement':
        return 'Place Rock Tokens';
      case 'paperTokenPlacement':
        return 'Place Paper Tokens';
      case 'scissorsTokenPlacement':
        return 'Place Scissors Tokens';
      case 'remainingTokenPlacement':
        return 'Place Remaining Tokens';
      default:
        return 'Place Board Tokens';
    }
  };
  
  // Render board token placement
  const renderTokenPlacement = () => {
    // Create a simple board representation for token placement
    const boardSpaces = Array.from({ length: state.boardSize + 1 }, (_, i) => i);
    
    return (
      <SetupStep>
        <SetupTitle>{getTokenPlacementTitle()}</SetupTitle>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>
            {state.players && state.players.length > 0 && state.setupPlayerIndex < state.players.length
              ? `${state.players[state.setupPlayerIndex].name}'s Turn - Select a Board Token:`
              : 'Select a Board Token:'}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {/* Debug info */}
            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#888' }}>
              Current phase: {state.setupStep}, 
              Current player type: {state.players[state.setupPlayerIndex]?.token.type},
              Available tokens: {state.boardTokens.filter(t => t.position === -1).length}
            </div>
            
            {/* Show all available tokens for debugging */}
            <div style={{ marginBottom: '20px', fontSize: '12px', color: '#888' }}>
              <div>Available tokens:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                {state.boardTokens
                  .filter(token => token.position === -1)
                  .map((token, index) => (
                    <div key={index} style={{ padding: '2px 5px', backgroundColor: '#333', borderRadius: '3px' }}>
                      {token.type}-{token.color}
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Show tokens for the current player based on their token type */}
            {state.boardTokens
              .filter(token => {
                const currentPlayer = state.players[state.setupPlayerIndex];
                const playerTokenType = currentPlayer?.token?.type;
                
                // Make sure we have a valid player and token type
                if (!currentPlayer || !playerTokenType) {
                  return false;
                }
                
                // Only show tokens that match the current player's token type
                return token.position === -1 && token.type === playerTokenType;
              })
              .map(token => (
                <div
                  key={token.id}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '4px',
                    backgroundColor: '#000',
                    border: `2px solid ${
                      token.type === 'rock'
                        ? token.color === 'green' ? '#4CAF50' : '#FF9800'
                        : token.type === 'paper'
                          ? token.color === 'red' ? '#F44336' : '#2196F3'
                          : token.color === 'yellow' ? '#FFEB3B' : '#E0E0E0'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: selectedBoardToken === token.id ? '0 0 10px #BB86FC' : 'none'
                  }}
                  onClick={() => setSelectedBoardToken(token.id)}
                >
                  {token.type === 'rock' ? (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">R</text>
                      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : token.type === 'paper' ? (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
                      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">P</text>
                      <path d="M13 9h5.5L13 3.5V9z" />
                      <path d="M8 16h8v2H8zm0-4h8v2H8z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">S</text>
                      <path d="M14.5 14.5L12 12l2.5-2.5m-5 5L12 12 9.5 9.5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </div>
              ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Select a Position:</h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '5px', 
            justifyContent: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {boardSpaces.map(position => {
              const isOccupied = isPositionOccupied(position);
              const isSelected = selectedPosition === position;
              
              return (
                <div
                  key={`position-${position}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    backgroundColor: position === 0 ? '#3700B3' : position === state.boardSize ? '#018786' : '#1E1E1E',
                    border: `2px solid ${isSelected ? '#BB86FC' : isOccupied ? '#BB86FC80' : '#FFFFFF40'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                    opacity: isOccupied ? 0.5 : 1,
                    boxShadow: isSelected ? '0 0 10px #BB86FC' : 'none'
                  }}
                  onClick={() => !isOccupied && setSelectedPosition(position)}
                >
                  {position}
                </div>
              );
            })}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <Button
            disabled={!selectedBoardToken || selectedPosition === -1}
            onClick={() => selectedBoardToken && selectedPosition !== -1 && handlePlaceBoardToken(selectedBoardToken, selectedPosition)}
          >
            Place Token
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: 'PLACE_ALL_TOKENS_RANDOMLY' })}
          >
            Place All Tokens Randomly
          </Button>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>
            {state.boardTokens.filter(token => token.position === -1).length} tokens left to place
          </div>
        </div>
      </SetupStep>
    );
  };
  
  // Render ready to start
  const renderReady = () => (
    <SetupStep>
      <SetupTitle>Ready to Start!</SetupTitle>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <p>All players have selected their tokens and all board tokens have been placed.</p>
        <p>Click the button below to start the game!</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleStartGame}>
          Start Game
        </Button>
      </div>
    </SetupStep>
  );
  
  return (
    <SetupContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.setupStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%' }}
        >
          {state.setupStep === 'playerCount' && renderPlayerCountSelection()}
          {state.setupStep === 'tokenSelection' && renderTokenSelection()}
          {(state.setupStep === 'rockTokenPlacement' || 
            state.setupStep === 'paperTokenPlacement' || 
            state.setupStep === 'scissorsTokenPlacement' || 
            state.setupStep === 'remainingTokenPlacement') && renderTokenPlacement()}
          {state.setupStep === 'ready' && renderReady()}
        </motion.div>
      </AnimatePresence>
    </SetupContainer>
  );
};

export default GameSetup;
