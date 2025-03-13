import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice as StyledDice, DiceContainer } from './styled/GameElements';
import { useGame } from '../context/GameContext';
import { DiceType, DiceValue } from '../types/game';

interface DiceProps {
  type: DiceType;
  onRoll?: (value: DiceValue) => void;
}

const Dice: React.FC<DiceProps> = ({ type, onRoll }) => {
  const { state, dispatch } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  
  const dice = type === 'regular' 
    ? state.dice.regular 
    : state.dice.rps[0]; // Just use the first RPS dice for now
  
  const handleRoll = () => {
    if (isRolling || state.phase !== 'playing') return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    setTimeout(() => {
      dispatch({ type: 'ROLL_DICE', diceType: type });
      
      // Get the updated dice value after dispatch
      const updatedDice = type === 'regular' 
        ? state.dice.regular 
        : state.dice.rps[0];
      
      setIsRolling(false);
      
      // Use the dice value from the state after dispatch
      if (onRoll && updatedDice.value) {
        console.log(`Rolling ${type} dice, value: ${updatedDice.value}`);
        onRoll(updatedDice.value);
      } else if (type === 'regular') {
        // Fallback for regular dice if the value is not updated in time
        const randomValue = Math.floor(Math.random() * 6) + 1;
        console.log(`Fallback rolling regular dice, value: ${randomValue}`);
        // Cast to RegularDiceValue to satisfy TypeScript
        if (onRoll) onRoll(randomValue as 1 | 2 | 3 | 4 | 5 | 6);
      }
    }, 1000);
  };
  
  // Get the display value for the dice
  const getDiceDisplay = () => {
    if (isRolling) {
      return '?';
    }
    
    if (!dice.value) {
      return type === 'regular' ? 'Roll' : 'Roll';
    }
    
    if (type === 'regular') {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{dice.value}</span>
        </div>
      );
    } else {
      let icon;
      switch (dice.value) {
        case 'rock':
          icon = (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold">R</text>
              <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          );
          break;
        case 'paper':
          icon = (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold">P</text>
              <path d="M13 9h5.5L13 3.5V9z" />
              <path d="M8 16h8v2H8zm0-4h8v2H8z" fill="currentColor" />
            </svg>
          );
          break;
        case 'scissors':
          icon = (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold">S</text>
              <path d="M14.5 14.5L12 12l2.5-2.5m-5 5L12 12 9.5 9.5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          );
          break;
        default:
          icon = '?';
      }
      
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
          <span style={{ fontSize: '12px', marginTop: '4px' }}>{dice.value}</span>
        </div>
      );
    }
  };
  
  return (
    <StyledDice
      as={motion.div}
      isRolling={isRolling}
      onClick={handleRoll}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {getDiceDisplay()}
    </StyledDice>
  );
};

interface DiceRollerProps {
  showRegular?: boolean;
  showRPS?: boolean;
  onRegularRoll?: (value: number) => void;
  onRPSRoll?: (value: string) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  showRegular = true,
  showRPS = false,
  onRegularRoll,
  onRPSRoll
}) => {
  return (
    <DiceContainer>
      {showRegular && (
        <Dice 
          type="regular" 
          onRoll={(value) => {
            if (onRegularRoll && typeof value === 'number') {
              onRegularRoll(value);
            }
          }} 
        />
      )}
      
      {showRPS && (
        <Dice 
          type="rps" 
          onRoll={(value) => {
            if (onRPSRoll && typeof value === 'string') {
              onRPSRoll(value);
            }
          }} 
        />
      )}
    </DiceContainer>
  );
};

export default Dice;
