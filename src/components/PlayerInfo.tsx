import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  PlayerInfo as StyledPlayerInfo, 
  PlayerName, 
  PlayerCards,
  Button
} from './styled/GameElements';
import { Player } from '../types/game';
import { useGame } from '../context/GameContext';
import Card from './Card';

// Enhanced mobile-friendly styled components
const MobilePlayerInfo = styled(StyledPlayerInfo)`
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
    min-width: 140px;
    max-width: 45%;
  }
  
  @media (max-width: 480px) {
    min-width: 120px;
    max-width: 100%;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: 0.9rem;
    
    /* Optimize for very small screens */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const MobilePlayerName = styled(PlayerName)`
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const MobilePlayerCards = styled(PlayerCards)`
  @media (max-width: 768px) {
    gap: 3px;
  }
  
  @media (max-width: 480px) {
    gap: 2px;
    justify-content: center;
    width: 100%;
  }
`;

const MobileButton = styled(Button)`
  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: 0.75rem;
    min-height: 32px;
  }
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`};
    font-size: 0.7rem;
    min-height: 28px;
    width: 90%;
    margin: 5px auto 0;
  }
`;

const StatusIndicator = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #000;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    top: -8px;
    right: -8px;
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    top: -6px;
    right: -6px;
    font-size: 9px;
  }
`;

const TokenIcon = styled.div<{ tokenType: string; tokenColor: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ tokenType, tokenColor, theme }) => 
    tokenType === 'rock' 
      ? (tokenColor === 'green' ? theme.colors.rock.green : theme.colors.rock.orange)
      : tokenType === 'paper'
        ? (tokenColor === 'red' ? theme.colors.paper.red : theme.colors.paper.blue)
        : (tokenColor === 'yellow' ? theme.colors.scissors.yellow : theme.colors.scissors.white)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
    min-width: 20px; /* Ensure it doesn't shrink too much */
  }
`;

const CardContainer = styled.div`
  margin-top: 10px;
  
  @media (max-width: 768px) {
    margin-top: 5px;
  }
  
  @media (max-width: 480px) {
    margin-top: 3px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CardHeader = styled.h4`
  font-size: 0.9rem;
  margin: 5px 0;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin: 3px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin: 2px 0;
    text-align: center;
  }
`;

const CardSubheader = styled.h5<{ cardType: 'advantage' | 'disadvantage' }>`
  font-size: 0.8rem;
  margin: 5px 0;
  color: ${({ cardType, theme }) => 
    cardType === 'advantage' ? theme.colors.secondary : theme.colors.error};
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin: 2px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    margin: 2px 0;
    text-align: center;
    width: 100%;
  }
`;

const CardItem = styled.div<{ cardType: 'advantage' | 'disadvantage'; isActive: boolean }>`
  width: 30px;
  height: 40px;
  background-color: ${({ cardType, theme }) => 
    cardType === 'advantage' ? theme.colors.secondary : theme.colors.error};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: ${({ isActive }) => isActive ? 'pointer' : 'default'};
  opacity: ${({ isActive }) => isActive ? 1 : 0.7};
  
  @media (max-width: 768px) {
    width: 24px;
    height: 32px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    width: 22px;
    height: 28px;
    font-size: 10px;
    border-radius: 3px;
  }
`;

const PositionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 5px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    gap: 3px;
    font-size: 0.75rem;
    width: 100%;
    justify-content: center;
    margin-top: 3px;
  }
`;

const SkipTurnIndicator = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 5px;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-top: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    margin-top: 2px;
    text-align: center;
    width: 100%;
  }
`;

interface PlayerInfoProps {
  player: Player;
  isActive: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isActive }) => {
  const { state, dispatch } = useGame();
  
  const handlePlayCard = (cardId: string) => {
    if (isActive && state.phase === 'playing') {
      dispatch({ type: 'PLAY_CARD', cardId });
    }
  };
  
  // Get token icon based on type
  const getTokenIcon = () => {
    switch (player.token.type) {
      case 'rock':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" />
          </svg>
        );
      case 'paper':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        );
      case 'scissors':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M8 12l4-4 1.41 1.41L11.83 11H16v2h-4.17l1.59 1.59L12 16l-4-4z" />
          </svg>
        );
      default:
        return '';
    }
  };
  
  return (
    <MobilePlayerInfo
      as={motion.div}
      isActive={isActive}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive ? '0 0 15px rgba(187, 134, 252, 0.8)' : 'none'
      }}
      transition={{ duration: 0.3 }}
      style={{
        border: isActive ? '2px solid #BB86FC' : 'none',
        position: 'relative'
      }}
    >
      {isActive && <StatusIndicator isActive={isActive}>▶</StatusIndicator>}
      
      <MobilePlayerName>
        {player.name} {getTokenIcon()}
      </MobilePlayerName>
      
      <PositionInfo>
        <TokenIcon 
          tokenType={player.token.type} 
          tokenColor={player.token.color}
        >
          {getTokenIcon()}
        </TokenIcon>
        <div>Position: {player.token.position}</div>
      </PositionInfo>
      
      {player.hasSkippedTurn && (
        <SkipTurnIndicator>
          Skipping next turn
        </SkipTurnIndicator>
      )}
      
      <CardContainer>
        <CardHeader>Cards:</CardHeader>
        
        {player.advantageCards.length === 0 && player.disadvantageCards.length === 0 && (
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>No cards</div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {player.advantageCards.length > 0 && (
            <div>
              <CardSubheader cardType="advantage">
                Advantage ({player.advantageCards.length})
              </CardSubheader>
              <MobilePlayerCards>
                {player.advantageCards.map(card => (
                  <CardItem 
                    key={card.id} 
                    cardType="advantage"
                    isActive={isActive}
                    onClick={() => isActive && handlePlayCard(card.id)}
                    title={`${card.title}: ${card.description}`}
                  >
                    ✨
                  </CardItem>
                ))}
              </MobilePlayerCards>
            </div>
          )}
          
          {player.disadvantageCards.length > 0 && (
            <div>
              <CardSubheader cardType="disadvantage">
                Disadvantage ({player.disadvantageCards.length})
              </CardSubheader>
              <MobilePlayerCards>
                {player.disadvantageCards.map(card => (
                  <CardItem 
                    key={card.id} 
                    cardType="disadvantage"
                    isActive={isActive}
                    onClick={() => isActive && handlePlayCard(card.id)}
                    title={`${card.title}: ${card.description}`}
                  >
                    ⚠️
                  </CardItem>
                ))}
              </MobilePlayerCards>
            </div>
          )}
        </div>
      </CardContainer>
      
      {isActive && state.phase === 'playing' && (
        <MobileButton 
          onClick={() => dispatch({ type: 'END_TURN' })}
          style={{ marginTop: '10px' }}
        >
          End Turn
        </MobileButton>
      )}
    </MobilePlayerInfo>
  );
};

export default PlayerInfo;
