import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import { Dice as StyledDice, DiceContainer } from './styled/GameElements';
import { useGame } from '../context/GameContext';
import type { DiceType, DiceValue, RegularDiceValue, RPSDiceValue } from '../types/game';

// Enhanced styled components for dice
const EnhancedDiceContainer = styled(DiceContainer)`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  perspective: 1000px;
`;

const EnhancedDice = styled(StyledDice)<{ 
  isRolling?: boolean; 
  diceType: 'regular' | 'rps';
  value?: number | string | null;
}>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme, diceType }) => 
    diceType === 'regular' 
      ? theme.colors.gradients.primary
      : theme.colors.gradients.secondary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onPrimary};
  box-shadow: ${({ theme }) => theme.shadows.large};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium};
  transform-style: preserve-3d;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: inherit;
    transform: translateZ(1px);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: inherit;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
    transform: translateZ(2px);
  }
  
  &:hover {
    transform: translateY(-5px) rotateX(10deg) rotateY(10deg);
    box-shadow: ${({ theme, diceType }) => 
      diceType === 'regular' 
        ? theme.shadows.neon(theme.colors.primary)
        : theme.shadows.neon(theme.colors.secondary)};
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const DiceValue = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onPrimary};
  text-shadow: ${({ theme }) => theme.shadows.text(theme.colors.primaryDark)};
`;

const DiceIcon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  svg {
    width: 40px;
    height: 40px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  }
  
  span {
    margin-top: 5px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const RollButton = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onPrimary};
  text-shadow: ${({ theme }) => theme.shadows.text(theme.colors.primaryDark)};
  z-index: 10;
`;

// Dice dots for regular dice
const DiceDots = styled.div<{ value: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
`;

const DiceDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
`;

// Simple component to render the correct number of dots based on dice value
const DiceDotsDisplay: React.FC<{ value: number }> = ({ value }) => {
  // Create an array of dots based on the value
  const dots = Array.from({ length: value }, (_, i) => (
    <DiceDot key={i} />
  ));
  
  return (
    <DiceDots value={value}>
      {dots}
    </DiceDots>
  );
};

interface DiceProps {
  type: DiceType;
  onRoll?: (value: DiceValue) => void;
}

const Dice: React.FC<DiceProps> = ({ type, onRoll }) => {
  const { state, dispatch } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [randomValues, setRandomValues] = useState<number[]>([]);
  const controls = useAnimation();
  
  const dice = type === 'regular' 
    ? state.dice.regular 
    : state.dice.rps[0]; // Just use the first RPS dice for now
  
  // Generate random values for rolling animation
  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        if (type === 'regular') {
          setRandomValues([Math.floor(Math.random() * 6) + 1]);
        } else {
          const rpsValues = ['rock', 'paper', 'scissors'];
          const randomIndex = Math.floor(Math.random() * 3);
          setRandomValues([randomIndex]);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRolling, type]);
  
  const handleRoll = () => {
    if (isRolling || state.phase !== 'playing') return;
    
    setIsRolling(true);
    
    // Generate a random value first
    let diceValue: DiceValue;
    if (type === 'regular') {
      diceValue = (Math.floor(Math.random() * 6) + 1) as RegularDiceValue;
    } else {
      const rpsValues: RPSDiceValue[] = ['rock', 'paper', 'scissors'];
      diceValue = rpsValues[Math.floor(Math.random() * 3)];
    }
    
    // Animate the dice roll
    controls.start({
      rotateX: [0, 360, 720, 1080, 1440],
      rotateY: [0, 360, 720, 1080, 1440],
      transition: { duration: 1.5, ease: "easeOut" }
    });
    
    // Simulate rolling animation
    setTimeout(() => {
      // Dispatch with the pre-generated value to ensure consistency
      dispatch({ 
        type: 'ROLL_DICE', 
        diceType: type,
        value: diceValue // Pass the value to the reducer
      });
      
      setIsRolling(false);
      
      // Use our pre-generated value for the callback
      if (onRoll) {
        console.log(`Rolling ${type} dice, value: ${diceValue}`);
        onRoll(diceValue);
      }
    }, 1500);
  };
  
  // Get the display value for the dice
  const getDiceDisplay = () => {
    if (isRolling) {
      if (type === 'regular') {
        return <DiceDotsDisplay value={randomValues[0] || 1} />;
      } else {
        const rpsValues = ['rock', 'paper', 'scissors'];
        const randomValue = rpsValues[randomValues[0] || 0];
        return getRPSIcon(randomValue as 'rock' | 'paper' | 'scissors');
      }
    }
    
    if (!dice.value) {
      return (
        <RollButton
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Roll
        </RollButton>
      );
    }
    
    if (type === 'regular' && typeof dice.value === 'number') {
      return <DiceDotsDisplay value={dice.value} />;
    } else if (typeof dice.value === 'string') {
      return getRPSIcon(dice.value as 'rock' | 'paper' | 'scissors');
    }
    
    return null;
  };
  
  // Get RPS icon
  const getRPSIcon = (value: 'rock' | 'paper' | 'scissors') => {
    let icon;
    switch (value) {
      case 'rock':
        icon = (
          <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="2" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ROCK</text>
          </svg>
        );
        break;
      case 'paper':
        icon = (
          <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
            <path d="M13 9h5.5L13 3.5V9z" />
            <path d="M8 16h8v2H8zm0-4h8v2H8z" fill="white" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">PAPER</text>
          </svg>
        );
        break;
      case 'scissors':
        icon = (
          <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M14.5 14.5L12 12l2.5-2.5m-5 5L12 12 9.5 9.5" stroke="white" strokeWidth="2" fill="none" />
            <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="bold" fill="white">SCISSORS</text>
          </svg>
        );
        break;
      default:
        icon = '?';
    }
    
    return (
      <DiceIcon>
        {icon}
      </DiceIcon>
    );
  };
  
  return (
    <EnhancedDice
      as={motion.div}
      isRolling={isRolling}
      diceType={type}
      value={dice.value}
      onClick={handleRoll}
      animate={controls}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {getDiceDisplay()}
    </EnhancedDice>
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
    <EnhancedDiceContainer>
      <AnimatePresence>
        {showRegular && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Dice 
              type="regular" 
              onRoll={(value) => {
                if (onRegularRoll && typeof value === 'number') {
                  onRegularRoll(value);
                }
              }} 
            />
          </motion.div>
        )}
        
        {showRPS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Dice 
              type="rps" 
              onRoll={(value) => {
                if (onRPSRoll && typeof value === 'string') {
                  onRPSRoll(value);
                }
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </EnhancedDiceContainer>
  );
};

export default Dice;
