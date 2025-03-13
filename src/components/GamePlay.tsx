import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
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

// Enhanced styled components
const GamePlayContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PlayersContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  width: 100%;
`;

const EnhancedGameControls = styled(GameControls)`
  background: ${({ theme }) => theme.effects.glass};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ControlsSection = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonsRow = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const EnhancedButton = styled(Button)<{ variant?: 'primary' | 'secondary' | 'error' }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme, variant = 'primary' }) => 
    variant === 'primary' 
      ? theme.colors.gradients.primary
      : variant === 'secondary'
        ? theme.colors.gradients.secondary
        : theme.colors.gradients.accent};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  overflow: hidden;
`;

const StatusMessage = styled(motion.div)<{ type?: 'info' | 'warning' | 'success' }>`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme, type = 'info' }) => 
    type === 'info' 
      ? `${theme.colors.info}20`
      : type === 'warning'
        ? `${theme.colors.warning}20`
        : `${theme.colors.success}20`};
  color: ${({ theme, type = 'info' }) => 
    type === 'info' 
      ? theme.colors.info
      : type === 'warning'
        ? theme.colors.warning
        : theme.colors.success};
  font-weight: 500;
  width: 100%;
  max-width: 600px;
  border-left: 4px solid ${({ theme, type = 'info' }) => 
    type === 'info' 
      ? theme.colors.info
      : type === 'warning'
        ? theme.colors.warning
        : theme.colors.success};
`;

const EnhancedModalOverlay = styled(ModalOverlay)`
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.7);
`;

const EnhancedModalContent = styled(ModalContent)`
  ${({ theme }) => theme.effects.glass}
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 90%;
  max-height: 90%;
  width: auto;
  min-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const EnhancedModalTitle = styled(ModalTitle)`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.text(theme.colors.primaryDark)};
  text-align: center;
  position: relative;
`;

const ModalDescription = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const CardContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

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
      <EnhancedModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <EnhancedModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <EnhancedModalTitle>{title}</EnhancedModalTitle>
          
          <ModalDescription>
            <p>{description}</p>
          </ModalDescription>
          
          <ButtonsRow>
            {options.map(option => (
              <EnhancedButton 
                key={option}
                onClick={() => handleInteractionChoice(option)}
                variant={
                  option.includes('advantage') 
                    ? 'secondary' 
                    : option.includes('disadvantage') 
                      ? 'error' 
                      : 'primary'
                }
              >
                {option}
              </EnhancedButton>
            ))}
          </ButtonsRow>
        </EnhancedModalContent>
      </EnhancedModalOverlay>
    );
  };
  
  // Render card effect modal
  const renderCardEffectModal = () => {
    if (state.phase !== 'cardEffect' || !state.cardInPlay) return null;
    
    return (
      <EnhancedModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <EnhancedModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <EnhancedModalTitle>Card Effect</EnhancedModalTitle>
          
          <CardContainer>
            <Card card={state.cardInPlay} autoFlip={true} />
          </CardContainer>
          
          <ModalDescription>
            <p>The card effect has been applied!</p>
          </ModalDescription>
          
          <ButtonsRow>
            <EnhancedButton 
              onClick={() => dispatch({ type: 'END_TURN' })}
              variant="primary"
            >
              Continue
            </EnhancedButton>
          </ButtonsRow>
        </EnhancedModalContent>
      </EnhancedModalOverlay>
    );
  };
  
  return (
    <GamePlayContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PlayersContainer>
        {state.players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <PlayerInfo 
              player={player} 
              isActive={index === state.currentPlayerIndex} 
            />
          </motion.div>
        ))}
      </PlayersContainer>
      
      <GameBoard />
      
      <EnhancedGameControls>
        {/* Always show the End Turn button regardless of phase */}
        <ButtonsRow>
          <EnhancedButton 
            onClick={() => dispatch({ type: 'END_TURN' })}
            variant="primary"
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            End Turn
          </EnhancedButton>
        </ButtonsRow>
        
        {/* Show dice and card buttons in playing phase */}
        {state.phase === 'playing' && (
          <>
            <ControlsSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DiceRoller onRegularRoll={handleDiceRoll} />
              
              {diceRolled && diceValue !== null && (
                <StatusMessage
                  type="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p>You rolled a {diceValue}!</p>
                  <EnhancedButton 
                    onClick={handleMovePlayer}
                    variant="primary"
                    style={{ marginTop: '10px' }}
                  >
                    Move {diceValue} Spaces
                  </EnhancedButton>
                </StatusMessage>
              )}
            </ControlsSection>
            
            <ButtonsRow
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EnhancedButton 
                variant="secondary"
                onClick={() => handleDrawCard('advantage')}
              >
                Draw Advantage Card
              </EnhancedButton>
              
              <EnhancedButton 
                variant="error"
                onClick={() => handleDrawCard('disadvantage')}
              >
                Draw Disadvantage Card
              </EnhancedButton>
            </ButtonsRow>
          </>
        )}
        
        {/* Show a message if the player needs to end their turn */}
        {state.phase === 'cardEffect' && (
          <StatusMessage 
            type="warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p>Card effect has been applied! Click "End Turn" to continue to the next player's turn</p>
          </StatusMessage>
        )}
      </EnhancedGameControls>
      
      <AnimatePresence>
        {renderInteractionModal()}
        {renderCardEffectModal()}
      </AnimatePresence>
    </GamePlayContainer>
  );
};

export default GamePlay;
