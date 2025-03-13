import React from 'react';
import { BoardToken as StyledBoardToken } from './styled/GameElements';
import { BoardToken as BoardTokenType } from '../types/game';

interface BoardTokenProps {
  token: BoardTokenType;
}

const BoardToken: React.FC<BoardTokenProps> = ({ token }) => {
  // Token icon based on type
  const getTokenIcon = () => {
    switch (token.type) {
      case 'rock':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold">R</text>
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'paper':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold">P</text>
            <path d="M13 9h5.5L13 3.5V9z" />
            <path d="M8 16h8v2H8zm0-4h8v2H8z" fill="currentColor" />
          </svg>
        );
      case 'scissors':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold">S</text>
            <path d="M14.5 14.5L12 12l2.5-2.5m-5 5L12 12 9.5 9.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        );
      default:
        return '';
    }
  };
  
  return (
    <StyledBoardToken
      tokenType={token.type}
      tokenColor={token.color}
    >
      {getTokenIcon()}
    </StyledBoardToken>
  );
};

export default BoardToken;
