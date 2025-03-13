export const theme = {
  colors: {
    // Base colors
    background: '#0F0F1A', // Darker blue-black
    surface: '#1A1A2E', // Dark blue
    surfaceLight: '#262640', // Lighter surface for contrast
    surfaceDark: '#10101C', // Darker surface for depth
    
    // Primary colors
    primary: '#BB86FC', // Purple
    primaryLight: '#D4BBFC', // Light purple
    primaryDark: '#9D4EDD', // Dark purple
    primaryVariant: '#3700B3', // Deep purple
    
    // Secondary colors
    secondary: '#03DAC6', // Teal
    secondaryLight: '#84FFFF', // Light teal
    secondaryDark: '#00B0A1', // Dark teal
    secondaryVariant: '#018786', // Deep teal
    
    // Accent colors
    accent: '#FF7597', // Pink
    accentLight: '#FF9EB7', // Light pink
    accentDark: '#D63964', // Dark pink
    
    // Status colors
    error: '#CF6679', // Red
    warning: '#FFCC00', // Yellow
    success: '#00E676', // Green
    info: '#2196F3', // Blue
    
    // Text colors
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
    
    // Token colors with enhanced palette
    rock: {
      green: '#4CAF50',
      greenLight: '#81C784',
      greenDark: '#2E7D32',
      orange: '#FF9800',
      orangeLight: '#FFB74D',
      orangeDark: '#EF6C00'
    },
    paper: {
      red: '#F44336',
      redLight: '#E57373',
      redDark: '#C62828',
      blue: '#2196F3',
      blueLight: '#64B5F6',
      blueDark: '#1565C0'
    },
    scissors: {
      yellow: '#FFEB3B',
      yellowLight: '#FFF176',
      yellowDark: '#F9A825',
      white: '#E0E0E0',
      whiteLight: '#F5F5F5',
      whiteDark: '#9E9E9E'
    },
    
    // Gradient presets
    gradients: {
      primary: 'linear-gradient(135deg, #BB86FC 0%, #3700B3 100%)',
      secondary: 'linear-gradient(135deg, #03DAC6 0%, #018786 100%)',
      accent: 'linear-gradient(135deg, #FF7597 0%, #D63964 100%)',
      dark: 'linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 100%)',
      rainbow: 'linear-gradient(to right, #FF7597, #BB86FC, #03DAC6, #FFEB3B)',
      board: 'radial-gradient(circle at center, #262640 0%, #1A1A2E 50%, #10101C 100%)'
    }
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.3)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    glow: (color: string) => `0 0 10px ${color}, 0 0 20px ${color}80`,
    neon: (color: string) => `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}80`,
    text: (color: string) => `0 0 2px ${color}, 0 0 4px ${color}80`,
    threeD: (color: string) => `0 1px 0 ${color}40, 0 2px 0 ${color}30, 0 3px 0 ${color}20, 0 4px 0 ${color}10, 0 5px 10px rgba(0, 0, 0, 0.6)`
  },
  
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    spring: '0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    elastic: '0.8s cubic-bezier(0.5, 0, 0.1, 1.4)'
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    xl: '24px',
    round: '50%',
    pill: '9999px'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px'
  },
  
  typography: {
    fontFamily: "'Poppins', sans-serif",
    heading: {
      fontWeight: 700,
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem'
    },
    body: {
      fontWeight: 400,
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
      xl: '1.25rem'
    }
  },
  
  // 3D effects
  effects: {
    bevel: (color: string) => `
      background-color: ${color};
      box-shadow: 
        inset -2px -2px 4px rgba(0, 0, 0, 0.3),
        inset 2px 2px 4px rgba(255, 255, 255, 0.1);
    `,
    glass: `
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    `,
    neumorph: (color: string) => `
      background-color: ${color};
      box-shadow: 
        5px 5px 10px rgba(0, 0, 0, 0.3),
        -5px -5px 10px rgba(255, 255, 255, 0.05);
    `,
    pressed: (color: string) => `
      background-color: ${color};
      box-shadow: 
        inset 2px 2px 5px rgba(0, 0, 0, 0.3),
        inset -2px -2px 5px rgba(255, 255, 255, 0.05);
    `
  },
  
  // Animation keyframes
  animations: {
    float: `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `,
    spin: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
    bounce: `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
    `,
    shake: `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `,
    glow: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(187, 134, 252, 0.5), 0 0 10px rgba(187, 134, 252, 0.3); }
        50% { box-shadow: 0 0 20px rgba(187, 134, 252, 0.8), 0 0 30px rgba(187, 134, 252, 0.5); }
      }
    `
  }
};

export type Theme = typeof theme;
