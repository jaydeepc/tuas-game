export const theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    secondaryVariant: '#018786',
    error: '#CF6679',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
    // Token colors
    rock: {
      green: '#4CAF50',
      orange: '#FF9800'
    },
    paper: {
      red: '#F44336',
      blue: '#2196F3'
    },
    scissors: {
      yellow: '#FFEB3B',
      white: '#E0E0E0'
    }
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.3)',
    glow: (color: string) => `0 0 10px ${color}, 0 0 20px ${color}80`
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    heading: {
      fontWeight: 700,
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem'
    },
    body: {
      fontWeight: 400,
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem'
    }
  }
};

export type Theme = typeof theme;
