import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GameControls,
  Button,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalActions
} from './styled/GameElements';
import { useGame } from '../context/GameContext';
import { Interaction, Player } from '../types/game';
import GameBoard from './GameBoard';
import PlayerInfo from './PlayerInfo';
import { DiceRoller } from './Dice';
import Card from './Card';

const GamePlay: React.FC = () => {
  const { state, dispatch } = useGame();
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  const [diceRolled, setDiceRolled] = useState<boolean>(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  
  // Reset dice state when the current player changes
  useEffect(() => {
    setDiceRolled(false);
    setDiceValue(null);
  }, [state.currentPlayerIndex]);
  
  // Handle dice roll
  const handleDiceRoll = (value: number) => {
    console.log(`Handling dice roll: ${value} for player ${currentPlayer.id}`);
    setDiceRolled(true);
    setDiceValue(value);
  };
  
  // Handle player movement
  const handleMovePlayer = () => {
    if (diceValue === null) return;
    
    // Move player based on dice roll
    dispatch({ 
      type: 'MOVE_PLAYER', 
      playerId: currentPlayer.id, 
      spaces: diceValue 
    });
    
    // Reset dice rolled state
    setDiceRolled(false);
    setDiceValue(null);
  };
  
  // Handle drawing a card
  const handleDrawCard = (cardType: 'advantage' | 'disadvantage') => {
    dispatch({ type: 'DRAW_CARD', cardType });
  };
  
  // Handle duel result
  const handleDuelResult = (player1Value: 'rock' | 'paper' | 'scissors', player2Value: 'rock' | 'paper' | 'scissors') => {
    dispatch({ 
      type: 'DUEL_RESULT', 
      player1Value, 
      player2Value 
    });
  };
  
  // Handle interaction choices
  const handleInteractionChoice = (choice: string) => {
    if (!state.currentInteraction) return;
    
    // Handle the choice based on the interaction type
    if (choice === 'Draw advantage card') {
      dispatch({ type: 'DRAW_CARD', cardType: 'advantage' });
    } else if (choice === 'Draw disadvantage card') {
      dispatch({ type: 'DRAW_CARD', cardType: 'disadvantage' });
    } else if (choice === 'Give advantage card' && state.currentInteraction.targetPlayer) {
      dispatch({ 
        type: 'GIVE_CARD', 
        fromPlayerId: currentPlayer.id, 
        toPlayerId: state.currentInteraction.targetPlayer.id, 
        cardType: 'advantage' 
      });
    } else if (choice === 'Give disadvantage card' && state.currentInteraction.targetPlayer) {
      dispatch({ 
        type: 'GIVE_CARD', 
        fromPlayerId: currentPlayer.id, 
        toPlayerId: state.currentInteraction.targetPlayer.id, 
        cardType: 'disadvantage' 
      });
    } else if (choice === 'Call for duel' && state.currentInteraction.targetPlayer) {
      dispatch({ 
        type: 'INITIATE_DUEL', 
        player1Id: currentPlayer.id, 
        player2Id: state.currentInteraction.targetPlayer.id 
      });
    }
    
    // Resolve the interaction
    dispatch({ type: 'RESOLVE_INTERACTION', choice });
  };
  
  // Render interaction modal
  const renderInteractionModal = () => {
    if (state.phase !== 'interaction' || !state.currentInteraction) return null;
    
    const { type, sourcePlayer, targetPlayer, boardToken, options } = state.currentInteraction;
    
    let title = '';
    let description = '';
    
    switch (type) {
      case 'moveBackOrDrawCard':
        title = 'Board Token Interaction';
        description = `You landed on a ${boardToken?.type} board token. Choose an option:`;
        break;
      case 'moveForwardOrDrawCard':
        title = 'Board Token Interaction';
        description = `You landed on a ${boardToken?.type} board token. Choose an option:`;
        break;
      case 'callDuelOrSkip':
        title = 'Board Token Interaction';
        description = `You landed on a ${boardToken?.type} board token. Choose an option:`;
        break;
      case 'drawAdvantageOrGiveDisadvantage':
        title = 'Player Interaction';
        description = `You landed on ${targetPlayer?.name}'s space. Choose an option:`;
        break;
      case 'drawDisadvantageOrGiveAdvantage':
        title = 'Player Interaction';
        description = `You landed on ${targetPlayer?.name}'s space. Choose an option:`;
        break;
      case 'callDuel':
        title = 'Player Interaction';
        description = `You landed on ${targetPlayer?.name}'s space. You must call for a duel.`;
        break;
    }
    
    return (
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <ModalTitle>{title}</ModalTitle>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p>{description}</p>
          </div>
          
          <ModalActions>
            {options.map(option => (
              <Button 
                key={option}
                onClick={() => handleInteractionChoice(option)}
              >
                {option}
              </Button>
            ))}
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  // Render duel modal
  const renderDuelModal = () => {
    if (state.phase !== 'duel' || !state.duel.player1 || !state.duel.player2) return null;
    
    return (
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <ModalTitle>Rock Paper Scissors Duel!</ModalTitle>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3>{state.duel.player1.name}</h3>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: state.duel.player1.token.type === 'rock' 
                  ? (state.duel.player1.token.color === 'green' ? '#4CAF50' : '#FF9800')
                  : state.duel.player1.token.type === 'paper'
                    ? (state.duel.player1.token.color === 'red' ? '#F44336' : '#2196F3')
                    : (state.duel.player1.token.color === 'yellow' ? '#FFEB3B' : '#E0E0E0'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                margin: '0 auto 20px'
              }}>
                {state.duel.player1.token.type === 'rock' ? (
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" />
                  </svg>
                ) : state.duel.player1.token.type === 'paper' ? (
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M8 12l4-4 1.41 1.41L11.83 11H16v2h-4.17l1.59 1.59L12 16l-4-4z" />
                  </svg>
                )}
              </div>
              
              {state.duel.result && (
                <div style={{ 
                  fontSize: '24px', 
                  marginTop: '10px',
                  color: state.duel.result === 'player1' ? '#4CAF50' : state.duel.result === 'player2' ? '#F44336' : '#FFFFFF'
                }}>
                  {state.duel.result === 'player1' ? 'Winner!' : state.duel.result === 'player2' ? 'Loser' : 'Draw'}
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3>{state.duel.player2.name}</h3>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: state.duel.player2.token.type === 'rock' 
                  ? (state.duel.player2.token.color === 'green' ? '#4CAF50' : '#FF9800')
                  : state.duel.player2.token.type === 'paper'
                    ? (state.duel.player2.token.color === 'red' ? '#F44336' : '#2196F3')
                    : (state.duel.player2.token.color === 'yellow' ? '#FFEB3B' : '#E0E0E0'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                margin: '0 auto 20px'
              }}>
                {state.duel.player2.token.type === 'rock' ? (
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" />
                  </svg>
                ) : state.duel.player2.token.type === 'paper' ? (
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M8 12l4-4 1.41 1.41L11.83 11H16v2h-4.17l1.59 1.59L12 16l-4-4z" />
                  </svg>
                )}
              </div>
              
              {state.duel.result && (
                <div style={{ 
                  fontSize: '24px', 
                  marginTop: '10px',
                  color: state.duel.result === 'player2' ? '#4CAF50' : state.duel.result === 'player1' ? '#F44336' : '#FFFFFF'
                }}>
                  {state.duel.result === 'player2' ? 'Winner!' : state.duel.result === 'player1' ? 'Loser' : 'Draw'}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <DiceRoller showRegular={false} showRPS={true} onRPSRoll={(value) => {
              // For simplicity, just use the same value for both players
              // In a real implementation, each player would roll their own dice
              handleDuelResult(value as 'rock' | 'paper' | 'scissors', value as 'rock' | 'paper' | 'scissors');
            }} />
          </div>
          
          <ModalActions>
            {state.duel.result && (
              <Button onClick={() => dispatch({ type: 'END_TURN' })}>
                Continue
              </Button>
            )}
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  // Render card effect modal
  const renderCardEffectModal = () => {
    if (state.phase !== 'cardEffect' || !state.cardInPlay) return null;
    
    return (
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <ModalTitle>Card Effect</ModalTitle>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <Card card={state.cardInPlay} />
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p>The card effect has been applied!</p>
          </div>
          
          <ModalActions>
            <Button onClick={() => dispatch({ type: 'END_TURN' })}>
              Continue
            </Button>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        {state.players.map((player, index) => (
          <PlayerInfo 
            key={player.id} 
            player={player} 
            isActive={index === state.currentPlayerIndex} 
          />
        ))}
      </div>
      
      <GameBoard />
      
      <GameControls>
        {state.phase === 'playing' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <DiceRoller onRegularRoll={handleDiceRoll} />
              
              {diceRolled && diceValue !== null && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <p>You rolled a {diceValue}!</p>
                  <Button 
                    onClick={handleMovePlayer}
                    variant="primary"
                    style={{ marginTop: '10px' }}
                  >
                    Move {diceValue} Spaces
                  </Button>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '20px' }}>
              <Button 
                variant="secondary"
                onClick={() => handleDrawCard('advantage')}
              >
                Draw Advantage Card
              </Button>
              
              <Button 
                variant="error"
                onClick={() => handleDrawCard('disadvantage')}
              >
                Draw Disadvantage Card
              </Button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <Button 
                onClick={() => dispatch({ type: 'END_TURN' })}
                variant="primary"
              >
                End Turn
              </Button>
            </div>
          </>
        )}
      </GameControls>
      
      <AnimatePresence>
        {renderInteractionModal()}
        {renderDuelModal()}
        {renderCardEffectModal()}
      </AnimatePresence>
    </div>
  );
};

export default GamePlay;
