import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { GameProvider, useGame } from './context/GameContext';
import { GameContainer, GameTitle } from './components/styled/GameElements';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameOver from './components/GameOver';

const Game: React.FC = () => {
  const { state } = useGame();
  
  return (
    <GameContainer>
      <GameTitle>Rock Paper Scissors Board Game</GameTitle>
      
      {state.phase === 'setup' && <GameSetup />}
      {(state.phase === 'playing' || state.phase === 'duel' || state.phase === 'cardEffect' || state.phase === 'interaction') && <GamePlay />}
      {state.phase === 'gameOver' && <GameOver />}
    </GameContainer>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GameProvider>
        <Game />
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
