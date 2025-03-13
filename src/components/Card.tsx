import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  Card as StyledCard, 
  CardFront, 
  CardBack, 
  CardTitle, 
  CardDescription 
} from './styled/GameElements';
import { Card as CardType } from '../types/game';

// Enhanced styled components for cards
const EnhancedCard = styled(StyledCard)<{ 
  cardType: 'advantage' | 'disadvantage';
  isFlipped: boolean;
  isGlowing?: boolean;
}>`
  position: relative;
  width: 220px;
  height: 300px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${({ theme, cardType }) => 
    cardType === 'advantage' 
      ? theme.colors.gradients.secondary
      : theme.colors.gradients.accent};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${({ theme, isGlowing, cardType }) => 
    isGlowing 
      ? theme.shadows.neon(cardType === 'advantage' ? theme.colors.secondary : theme.colors.error)
      : theme.shadows.large};
  transform-style: preserve-3d;
  transition: transform 0.8s ${({ theme }) => theme.transitions.spring};
  cursor: pointer;
  transform: ${({ isFlipped }) => isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    border-radius: inherit;
    pointer-events: none;
  }
  
  &:hover {
    box-shadow: ${({ theme, cardType }) => 
      cardType === 'advantage' 
        ? theme.shadows.neon(theme.colors.secondary)
        : theme.shadows.neon(theme.colors.error)};
  }
`;

const EnhancedCardFront = styled(CardFront)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const EnhancedCardBack = styled(CardBack)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background: ${({ theme }) => theme.colors.surfaceDark};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    pointer-events: none;
  }
`;

const EnhancedCardTitle = styled(CardTitle)`
  font-size: 1.4rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  color: ${({ theme }) => theme.colors.onPrimary};
  text-shadow: ${({ theme }) => theme.shadows.text(theme.colors.primaryDark)};
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const EnhancedCardDescription = styled(CardDescription)`
  font-size: 1rem;
  text-align: center;
  line-height: 1.4;
  margin-top: auto;
`;

const CardIcon = styled(motion.div)<{ cardType: 'advantage' | 'disadvantage' }>`
  font-size: 3.5rem;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  text-shadow: ${({ theme, cardType }) => 
    cardType === 'advantage' 
      ? theme.shadows.neon(theme.colors.secondaryLight)
      : theme.shadows.neon(theme.colors.accentLight)};
  
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const CardBadge = styled.div<{ cardType: 'advantage' | 'disadvantage' }>`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${({ theme, cardType }) => 
    cardType === 'advantage' ? theme.colors.success : theme.colors.error};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: 10;
`;

const CardBackContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  .card-type {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: ${({ theme }) => theme.spacing.md};
    text-transform: uppercase;
    letter-spacing: 2px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  .card-icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const CardPattern = styled.div<{ cardType: 'advantage' | 'disadvantage' }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  pointer-events: none;
  background-image: ${({ cardType }) => 
    cardType === 'advantage' 
      ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`};
`;

interface CardProps {
  card: CardType;
  onClick?: () => void;
  autoFlip?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, autoFlip = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  
  // Auto-flip animation if autoFlip is true
  useEffect(() => {
    if (autoFlip) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [autoFlip]);
  
  // Glow animation
  useEffect(() => {
    if (!autoFlip) return;
    
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [autoFlip]);
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onClick) {
      onClick();
    }
  };
  
  // Get card icon based on effect type
  const getCardIcon = () => {
    switch (card.effect.type) {
      case 'move':
        return card.effect.spaces > 0 ? '🚀' : '⏪';
      case 'skipTurn':
        return '⏸️';
      case 'duel':
        return '⚔️';
      case 'moveToken':
        return '🔄';
      case 'drawCards':
        return '🎴';
      case 'giveCard':
        return '🎁';
      default:
        return '❓';
    }
  };
  
  return (
    <EnhancedCard
      as={motion.div}
      cardType={card.type}
      isFlipped={isFlipped}
      isGlowing={isGlowing}
      onClick={handleClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -5, 0],
      }}
      transition={{ 
        duration: 0.5,
        y: { 
          repeat: autoFlip ? Infinity : 0,
          duration: 2,
          ease: "easeInOut"
        }
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: card.type === 'advantage' 
          ? '0 0 20px rgba(3, 218, 198, 0.8)' 
          : '0 0 20px rgba(207, 102, 121, 0.8)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      <CardBadge cardType={card.type}>
        {card.type === 'advantage' ? '✨' : '⚠️'}
      </CardBadge>
      
      <CardPattern cardType={card.type} />
      
      <EnhancedCardFront>
        <EnhancedCardTitle>{card.title}</EnhancedCardTitle>
        
        <CardIcon 
          cardType={card.type}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: card.effect.type === 'moveToken' ? [0, 360] : 0
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {getCardIcon()}
        </CardIcon>
        
        <EnhancedCardDescription>{card.description}</EnhancedCardDescription>
      </EnhancedCardFront>
      
      <EnhancedCardBack>
        <CardBackContent
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-icon">
            {card.type === 'advantage' ? '✨' : '⚠️'}
          </div>
          <div className="card-type">
            {card.type === 'advantage' ? 'Advantage' : 'Disadvantage'}
          </div>
        </CardBackContent>
      </EnhancedCardBack>
    </EnhancedCard>
  );
};

export default Card;
