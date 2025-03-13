import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardContainer, BoardSpace } from './styled/GameElements';
import { useGame } from '../context/GameContext';
import PlayerTokenComponent from './PlayerToken';
import BoardTokenComponent from './BoardToken';

const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { boardSize, players, boardTokens } = state;
  
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
  
  return (
    <BoardContainer>
      {zigzagBoard.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} style={{ display: 'flex', flexDirection: 'row' }}>
          {row.map(position => {
            const boardTokensAtPosition = getBoardTokensAtPosition(position);
            const playersAtPosition = getPlayersAtPosition(position);
            const hasToken = boardTokensAtPosition.length > 0 || playersAtPosition.length > 0;
            
            return (
              <BoardSpace 
                key={`space-${position}`}
                isStart={position === 0}
                isEnd={position === boardSize}
                hasToken={hasToken}
                style={{
                  backgroundColor: position === 0 ? '#3700B3' : position === boardSize ? '#018786' : undefined
                }}
              >
                <div style={{ position: 'absolute', top: '-20px', fontSize: '12px' }}>
                  {position}
                </div>
                
                {/* Board tokens */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                  {boardTokensAtPosition.map(token => (
                    <BoardTokenComponent 
                      key={token.id}
                      token={token}
                    />
                  ))}
                </div>
                
                {/* Player tokens */}
                <AnimatePresence>
                  {playersAtPosition.map(player => (
                    <PlayerTokenComponent 
                      key={player.id}
                      player={player}
                      isActive={state.currentPlayerIndex === players.indexOf(player)}
                    />
                  ))}
                </AnimatePresence>
              </BoardSpace>
            );
          })}
        </div>
      ))}
    </BoardContainer>
  );
};

export default GameBoard;
