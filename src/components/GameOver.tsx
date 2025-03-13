import React from 'react';
import { motion } from 'framer-motion';
import { 
  GameOverContainer, 
  WinnerText, 
  GameOverActions,
  Button
} from './styled/GameElements';
import { useGame } from '../context/GameContext';

const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  
  if (!state.winner) return null;
  
  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <GameOverContainer
      as={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 15,
          delay: 0.2
        }}
      >
        <WinnerText>
          {state.winner.name} Wins!
        </WinnerText>
      </motion.div>
      
      <div style={{ 
        width: window.innerWidth <= 480 ? '90px' : window.innerWidth <= 768 ? '100px' : '120px', 
        height: window.innerWidth <= 480 ? '90px' : window.innerWidth <= 768 ? '100px' : '120px', 
        borderRadius: '50%', 
        backgroundColor: state.winner.token.type === 'rock' 
          ? (state.winner.token.color === 'green' ? '#4CAF50' : '#FF9800')
          : state.winner.token.type === 'paper'
            ? (state.winner.token.color === 'red' ? '#F44336' : '#2196F3')
            : (state.winner.token.color === 'yellow' ? '#FFEB3B' : '#E0E0E0'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: window.innerWidth <= 480 ? '40px' : window.innerWidth <= 768 ? '50px' : '60px',
        margin: `0 auto ${window.innerWidth <= 480 ? '20px' : window.innerWidth <= 768 ? '30px' : '40px'}`,
        boxShadow: '0 0 30px rgba(187, 134, 252, 0.8)'
      }}>
        {state.winner.token.type === 'rock' ? '🪨' : state.winner.token.type === 'paper' ? '📄' : '✂️'}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p style={{ 
          fontSize: window.innerWidth <= 480 ? '0.9rem' : window.innerWidth <= 768 ? '1rem' : '1.2rem', 
          marginBottom: window.innerWidth <= 480 ? '20px' : '30px',
          padding: window.innerWidth <= 480 ? '0 15px' : '0'
        }}>
          Congratulations! {state.winner.name} has reached the end of the board and won the game!
        </p>
      </motion.div>
      
      <GameOverActions>
        <Button 
          onClick={handleRestart}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Again
        </Button>
      </GameOverActions>
    </GameOverContainer>
  );
};

export default GameOver;
