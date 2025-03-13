import React from 'react';
import { motion } from 'framer-motion';
import { PlayerToken as StyledPlayerToken } from './styled/GameElements';
import { Player } from '../types/game';
import { CSSProperties } from 'styled-components';

export interface PlayerTokenProps {
  player: Player;
  isActive: boolean;
  style?: CSSProperties;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, isActive, style }) => {
  const { token } = player;
  
  // Token icon based on type
  const getTokenIcon = () => {
    switch (token.type) {
      case 'rock':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">R</text>
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'paper':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">P</text>
            <path d="M13 9h5.5L13 3.5V9z" />
            <path d="M8 16h8v2H8zm0-4h8v2H8z" fill="currentColor" />
          </svg>
        );
      case 'scissors':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold">S</text>
            <path d="M14.5 14.5L12 12l2.5-2.5m-5 5L12 12 9.5 9.5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        );
      default:
        return '';
    }
  };
  
  return (
    <StyledPlayerToken
      tokenType={token.type}
      tokenColor={token.color}
      isActive={isActive}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
      style={style}
    >
      {getTokenIcon()}
    </StyledPlayerToken>
  );
};

export default PlayerToken;
