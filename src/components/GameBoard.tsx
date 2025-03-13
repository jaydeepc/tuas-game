import React, { useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import { BoardContainer, BoardSpace } from './styled/GameElements';
import { useGame } from '../context/GameContext';
import PlayerTokenComponent from './PlayerToken';
import BoardTokenComponent from './BoardToken';

// Enhanced styled components for the board
const EnhancedBoardContainer = styled(BoardContainer)`
  background: ${({ theme }) => theme.colors.gradients.board};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, ${({ theme }) => theme.colors.primaryLight}10 0%, transparent 30%),
      radial-gradient(circle at 90% 80%, ${({ theme }) => theme.colors.secondaryLight}10 0%, transparent 30%);
    pointer-events: none;
    z-index: 0;
  }
`;

const BoardRow = styled(motion.div)<{ isEven: boolean }>`
  display: flex;
  flex-direction: ${props => props.isEven ? 'row' : 'row-reverse'};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  position: relative;
  z-index: 1;
`;

const EnhancedBoardSpace = styled(BoardSpace)<{ 
  isStart?: boolean; 
  isEnd?: boolean; 
  hasToken?: boolean;
  position: number;
}>`
  position: relative;
  width: 70px;
  height: 70px;
  margin: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${({ theme, isStart, isEnd, position }) => 
    isStart 
      ? theme.colors.gradients.primary
      : isEnd 
        ? theme.colors.gradients.secondary
        : position % 5 === 0 
          ? `linear-gradient(135deg, ${theme.colors.surfaceLight} 0%, ${theme.colors.surface} 100%)`
          : theme.colors.surface};
  border: 2px solid ${({ theme, hasToken, isStart, isEnd }) => 
    isStart 
      ? theme.colors.primaryLight
      : isEnd 
        ? theme.colors.secondaryLight
        : hasToken 
          ? `${theme.colors.primary}80`
          : `${theme.colors.onSurface}20`};
  box-shadow: ${({ theme, isStart, isEnd, hasToken }) => 
    isStart || isEnd
      ? theme.shadows.glow(isStart ? theme.colors.primary : theme.colors.secondary)
      : hasToken
        ? theme.shadows.small
        : 'none'};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  /* Special milestone spaces */
  ${({ position, theme }) => position % 10 === 0 && position !== 0 && `
    background: linear-gradient(135deg, ${theme.colors.surfaceLight} 0%, ${theme.colors.surface} 100%);
    border: 2px solid ${theme.colors.accent}40;
    
    &::after {
      content: '✨';
      position: absolute;
      top: -15px;
      right: -5px;
      font-size: 16px;
    }
  `}
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    margin: 4px;
  }
`;

const PositionNumber = styled.div<{ isSpecial: boolean }>`
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: ${props => props.isSpecial ? 700 : 400};
  color: ${({ theme, isSpecial }) => isSpecial ? theme.colors.accent : theme.colors.onSurface};
  background-color: ${({ theme, isSpecial }) => isSpecial ? theme.colors.surfaceDark : 'transparent'};
  padding: ${props => props.isSpecial ? '2px 6px' : '0'};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  opacity: 0.8;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${EnhancedBoardSpace}:hover & {
    opacity: 1;
    transform: translateX(-50%) scale(1.1);
  }
`;

const BoardTokensContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  position: relative;
  z-index: 2;
`;

// Path animation effect
const PathIndicator = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.gradients.rainbow};
  opacity: 0.5;
  z-index: 0;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
`;

const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { boardSize, players, boardTokens } = state;
  const controls = useAnimation();
  
  // Create an array of board spaces
  const boardSpaces = Array.from({ length: boardSize + 1 }, (_, i) => i);
  
  // Calculate the number of rows and columns for the board layout
  const columns = Math.ceil(Math.sqrt(boardSize + 1));
  const rows = Math.ceil((boardSize + 1) / columns);
  
  // Create a zigzag pattern for the board
  const createZigzagBoard = () => {
    const board: number[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      const startIdx = i * columns;
      const endIdx = Math.min(startIdx + columns, boardSize + 1);
      
      // If even row, go left to right
      if (i % 2 === 0) {
        for (let j = startIdx; j < endIdx; j++) {
          row.push(j);
        }
      } 
      // If odd row, go right to left
      else {
        for (let j = endIdx - 1; j >= startIdx; j--) {
          row.push(j);
        }
      }
      
      board.push(row);
    }
    
    return board;
  };
  
  const zigzagBoard = createZigzagBoard();
  
  // Check if a space has a board token
  const getBoardTokensAtPosition = (position: number) => {
    return boardTokens.filter(token => token.position === position);
  };
  
  // Check if a space has a player token
  const getPlayersAtPosition = (position: number) => {
    return players.filter(player => player.token.position === position);
  };
  
  // Animate the board on mount
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);
  
  // Row animation variants
  const rowVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      x: i % 2 === 0 ? -20 : 20,
    }),
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  // Space animation variants
  const spaceVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.02,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <EnhancedBoardContainer
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
    >
      {zigzagBoard.map((row, rowIndex) => (
        <BoardRow 
          key={`row-${rowIndex}`}
          isEven={rowIndex % 2 === 0}
          custom={rowIndex}
          initial="hidden"
          animate="visible"
          variants={rowVariants}
        >
          {row.map((position, colIndex) => {
            const boardTokensAtPosition = getBoardTokensAtPosition(position);
            const playersAtPosition = getPlayersAtPosition(position);
            const hasToken = boardTokensAtPosition.length > 0 || playersAtPosition.length > 0;
            const isSpecial = position % 10 === 0 || position === boardSize || position === 0;
            
            return (
              <EnhancedBoardSpace 
                key={`space-${position}`}
                isStart={position === 0}
                isEnd={position === boardSize}
                hasToken={hasToken}
                position={position}
                as={motion.div}
                custom={colIndex}
                variants={spaceVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: hasToken ? '0 0 15px rgba(187, 134, 252, 0.5)' : undefined 
                }}
              >
                <PositionNumber isSpecial={isSpecial}>
                  {position}
                </PositionNumber>
                
                {/* Board tokens */}
                <BoardTokensContainer>
                  <AnimatePresence>
                    {boardTokensAtPosition.map(token => (
                      <motion.div
                        key={token.id}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <BoardTokenComponent token={token} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </BoardTokensContainer>
                
                {/* Player tokens */}
                <AnimatePresence>
                  {playersAtPosition.map((player, index) => (
                    <PlayerTokenComponent 
                      key={player.id}
                      player={player}
                      isActive={state.currentPlayerIndex === players.indexOf(player)}
                      style={{ 
                        zIndex: state.currentPlayerIndex === players.indexOf(player) ? 10 : 5,
                        position: 'absolute',
                        top: index % 2 === 0 ? '-15px' : '15px',
                        left: index > 1 ? '-15px' : '15px'
                      }}
                    />
                  ))}
                </AnimatePresence>
              </EnhancedBoardSpace>
            );
          })}
        </BoardRow>
      ))}
    </EnhancedBoardContainer>
  );
};

export default GameBoard;
