import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlayerInfo as StyledPlayerInfo, 
  PlayerName, 
  PlayerCards,
  Button
} from './styled/GameElements';
import { Player } from '../types/game';
import { useGame } from '../context/GameContext';
import Card from './Card';

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
    <StyledPlayerInfo
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
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          backgroundColor: '#BB86FC',
          color: '#000',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          ▶
        </div>
      )}
      <PlayerName>
        {player.name} {getTokenIcon()}
      </PlayerName>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '30px', 
          height: '30px', 
          borderRadius: '50%', 
          backgroundColor: player.token.type === 'rock' 
            ? (player.token.color === 'green' ? '#4CAF50' : '#FF9800')
            : player.token.type === 'paper'
              ? (player.token.color === 'red' ? '#F44336' : '#2196F3')
              : (player.token.color === 'yellow' ? '#FFEB3B' : '#E0E0E0'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          {getTokenIcon()}
        </div>
        <div>Position: {player.token.position}</div>
      </div>
      
      {player.hasSkippedTurn && (
        <div style={{ color: '#CF6679', marginTop: '5px' }}>
          Skipping next turn
        </div>
      )}
      
      <div style={{ marginTop: '10px' }}>
        <h4 style={{ fontSize: '0.9rem', margin: '5px 0' }}>Cards:</h4>
        
        {player.advantageCards.length === 0 && player.disadvantageCards.length === 0 && (
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>No cards</div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {player.advantageCards.length > 0 && (
            <div>
              <h5 style={{ fontSize: '0.8rem', margin: '5px 0', color: '#03DAC6' }}>
                Advantage ({player.advantageCards.length})
              </h5>
              <PlayerCards>
                {player.advantageCards.map(card => (
                  <div 
                    key={card.id} 
                    style={{ 
                      width: '30px', 
                      height: '40px', 
                      backgroundColor: '#03DAC6', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      cursor: isActive ? 'pointer' : 'default',
                      opacity: isActive ? 1 : 0.7
                    }}
                    onClick={() => isActive && handlePlayCard(card.id)}
                    title={`${card.title}: ${card.description}`}
                  >
                    ✨
                  </div>
                ))}
              </PlayerCards>
            </div>
          )}
          
          {player.disadvantageCards.length > 0 && (
            <div>
              <h5 style={{ fontSize: '0.8rem', margin: '5px 0', color: '#CF6679' }}>
                Disadvantage ({player.disadvantageCards.length})
              </h5>
              <PlayerCards>
                {player.disadvantageCards.map(card => (
                  <div 
                    key={card.id} 
                    style={{ 
                      width: '30px', 
                      height: '40px', 
                      backgroundColor: '#CF6679', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      cursor: isActive ? 'pointer' : 'default',
                      opacity: isActive ? 1 : 0.7
                    }}
                    onClick={() => isActive && handlePlayCard(card.id)}
                    title={`${card.title}: ${card.description}`}
                  >
                    ⚠️
                  </div>
                ))}
              </PlayerCards>
            </div>
          )}
        </div>
      </div>
      
      {isActive && state.phase === 'playing' && (
        <Button 
          onClick={() => dispatch({ type: 'END_TURN' })}
          style={{ marginTop: '10px', fontSize: '0.8rem' }}
        >
          End Turn
        </Button>
      )}
    </StyledPlayerInfo>
  );
};

export default PlayerInfo;
