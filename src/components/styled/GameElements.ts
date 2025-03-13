import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Theme } from '../../styles/theme';
import { TokenType, TokenColor } from '../../types/game';

// Helper function to get token color
export const getTokenColor = (type: TokenType, color: TokenColor, theme: Theme): string => {
  switch (type) {
    case 'rock':
      return color === 'green' ? theme.colors.rock.green : theme.colors.rock.orange;
    case 'paper':
      return color === 'red' ? theme.colors.paper.red : theme.colors.paper.blue;
    case 'scissors':
      return color === 'yellow' ? theme.colors.scissors.yellow : theme.colors.scissors.white;
    default:
      return theme.colors.primary;
  }
};

// Animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(187, 134, 252, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(187, 134, 252, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(187, 134, 252, 0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Container for the entire game
export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.onBackground};
`;

// Game title
export const GameTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}80;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Game board
export const BoardContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

// Board space
interface BoardSpaceProps {
  isStart?: boolean;
  isEnd?: boolean;
  hasToken?: boolean;
}

export const BoardSpace = styled.div<BoardSpaceProps>`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 5px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme, isStart, isEnd }) => 
    isStart 
      ? theme.colors.primaryVariant 
      : isEnd 
        ? theme.colors.secondary 
        : theme.colors.surface};
  border: 2px solid ${({ theme, hasToken }) => 
    hasToken 
      ? theme.colors.primary 
      : theme.colors.onSurface}40;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.medium};
  
  ${({ isStart, isEnd, theme }) => 
    (isStart || isEnd) && css`
      animation: ${pulse} 2s infinite;
      box-shadow: ${theme.shadows.glow(isStart ? theme.colors.primaryVariant : theme.colors.secondary)};
    `}
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin: 3px;
  }
`;

// Player token
interface TokenProps {
  tokenType: TokenType;
  tokenColor: TokenColor;
  isActive?: boolean;
}

export const PlayerToken = styled(motion.div)<TokenProps>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ tokenType, tokenColor, theme }) => 
    getTokenColor(tokenType, tokenColor, theme)};
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  ${({ isActive, theme }) => 
    isActive && css`
      animation: ${float} 2s infinite ease-in-out;
      box-shadow: ${theme.shadows.glow(theme.colors.primary)};
    `}
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

// Board token
export const BoardToken = styled.div<TokenProps>`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: #000;
  border: 2px solid ${({ tokenType, tokenColor, theme }) => 
    getTokenColor(tokenType, tokenColor, theme)};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

// Dice container
export const DiceContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

// Dice
interface DiceProps {
  isRolling?: boolean;
}

export const Dice = styled.div<DiceProps>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onSurface};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ isRolling }) => 
    isRolling && css`
      animation: ${spin} 0.5s infinite linear;
    `}
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.glow(theme.colors.primary)};
  }
`;

// Card
interface CardProps {
  cardType: 'advantage' | 'disadvantage';
  isFlipped?: boolean;
}

export const Card = styled.div<CardProps>`
  position: relative;
  width: 180px;
  height: 250px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme, cardType }) => 
    cardType === 'advantage' 
      ? theme.colors.secondary 
      : theme.colors.error};
  color: ${({ theme, cardType }) => 
    cardType === 'advantage' 
      ? theme.colors.onSecondary 
      : theme.colors.onError};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transform-style: preserve-3d;
  transition: transform 0.6s;
  cursor: pointer;
  
  ${({ isFlipped }) => 
    isFlipped && css`
      transform: rotateY(180deg);
    `}
  
  &:hover {
    box-shadow: ${({ theme, cardType }) => 
      theme.shadows.glow(cardType === 'advantage' 
        ? theme.colors.secondary 
        : theme.colors.error)};
  }
`;

export const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

export const CardDescription = styled.p`
  font-size: 1rem;
  text-align: center;
`;

// Button
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'error';
}

export const Button = styled.button<ButtonProps>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme, variant = 'primary' }) => 
    variant === 'primary' 
      ? theme.colors.primary 
      : variant === 'secondary' 
        ? theme.colors.secondary 
        : theme.colors.error};
  color: ${({ theme, variant = 'primary' }) => 
    variant === 'primary' 
      ? theme.colors.onPrimary 
      : variant === 'secondary' 
        ? theme.colors.onSecondary 
        : theme.colors.onError};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme, variant = 'primary' }) => 
      theme.shadows.glow(variant === 'primary' 
        ? theme.colors.primary 
        : variant === 'secondary' 
          ? theme.colors.secondary 
          : theme.colors.error)};
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Player info
export const PlayerInfo = styled.div<{ isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme, isActive }) => 
    isActive 
      ? theme.shadows.glow(theme.colors.primary) 
      : theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  ${({ isActive }) => 
    isActive && css`
      transform: scale(1.05);
    `}
`;

export const PlayerName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

export const PlayerCards = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// Game controls
export const GameControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// Modal
export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

export const ModalTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// Game setup
export const SetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const SetupStep = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SetupTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const TokenSelection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const TokenOption = styled.div<TokenProps & { isSelected?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ tokenType, tokenColor, theme }) => 
    getTokenColor(tokenType, tokenColor, theme)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme, isSelected }) => 
    isSelected 
      ? theme.shadows.glow(theme.colors.primary) 
      : theme.shadows.small};
  
  ${({ isSelected }) => 
    isSelected && css`
      transform: scale(1.1);
    `}
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

// Game over
export const GameOverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const WinnerText = styled.h2`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.glow(theme.colors.primary)};
`;

export const GameOverActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;
