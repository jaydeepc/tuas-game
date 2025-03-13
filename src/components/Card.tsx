import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card as StyledCard, 
  CardFront, 
  CardBack, 
  CardTitle, 
  CardDescription 
} from './styled/GameElements';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
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
        return card.effect.spaces > 0 ? '⏩' : '⏪';
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
    <StyledCard
      as={motion.div}
      cardType={card.type}
      isFlipped={isFlipped}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <CardFront>
        <CardTitle>{card.title}</CardTitle>
        <div style={{ fontSize: '2rem', textAlign: 'center' }}>
          {getCardIcon()}
        </div>
        <CardDescription>{card.description}</CardDescription>
      </CardFront>
      
      <CardBack>
        <div style={{ 
          fontSize: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {card.type === 'advantage' ? '✨' : '⚠️'}
          <div style={{ fontSize: '1rem', marginTop: '10px' }}>
            {card.type === 'advantage' ? 'Advantage' : 'Disadvantage'}
          </div>
        </div>
      </CardBack>
    </StyledCard>
  );
};

export default Card;
