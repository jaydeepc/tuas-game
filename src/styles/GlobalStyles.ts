import { createGlobalStyle, DefaultTheme, css } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme?: DefaultTheme }>`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  /* Define all animation keyframes */
  ${({ theme }) => theme.animations.float}
  ${({ theme }) => theme.animations.pulse}
  ${({ theme }) => theme.animations.spin}
  ${({ theme }) => theme.animations.bounce}
  ${({ theme }) => theme.animations.shake}
  ${({ theme }) => theme.animations.glow}
  
  /* Additional animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideInLeft {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes rotate3d {
    0% { transform: perspective(1000px) rotateY(0deg); }
    100% { transform: perspective(1000px) rotateY(360deg); }
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body, #root {
    height: 100%;
    width: 100%;
  }
  
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background};
    background-image: radial-gradient(circle at 10% 20%, ${({ theme }) => theme.colors.surfaceLight}20 0%, transparent 20%),
                      radial-gradient(circle at 80% 40%, ${({ theme }) => theme.colors.primaryLight}10 0%, transparent 20%),
                      radial-gradient(circle at 40% 70%, ${({ theme }) => theme.colors.secondaryLight}15 0%, transparent 25%);
    background-size: 100% 100%;
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.onBackground};
    overflow-x: hidden;
    line-height: 1.5;
    transition: background-color ${({ theme }) => theme.transitions.slow};
  }
  
  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    border: none;
    outline: none;
    background: none;
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: ${({ theme }) => theme.shadows.text(theme.colors.primaryDark)};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.typography.heading.h1};
    letter-spacing: -0.5px;
    animation: fadeIn 0.8s ease-out, slideInUp 0.8s ease-out;
  }
  
  h2 {
    font-size: ${({ theme }) => theme.typography.heading.h2};
    letter-spacing: -0.3px;
    animation: fadeIn 0.7s ease-out, slideInUp 0.7s ease-out;
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.heading.h3};
    animation: fadeIn 0.6s ease-out, slideInUp 0.6s ease-out;
  }
  
  h4 {
    font-size: ${({ theme }) => theme.typography.heading.h4};
  }
  
  h5 {
    font-size: ${({ theme }) => theme.typography.heading.h5};
  }
  
  h6 {
    font-size: ${({ theme }) => theme.typography.heading.h6};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.6;
  }
  
  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    transition: all ${({ theme }) => theme.transitions.fast};
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 0;
      background-color: ${({ theme }) => theme.colors.secondary};
      transition: width ${({ theme }) => theme.transitions.medium};
    }
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondaryLight};
      
      &:after {
        width: 100%;
      }
    }
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceDark};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
    transition: background ${({ theme }) => theme.transitions.fast};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
  
  /* Utility classes */
  .text-gradient {
    background: ${({ theme }) => theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  .glass-panel {
    ${({ theme }) => theme.effects.glass}
    border-radius: ${({ theme }) => theme.borderRadius.large};
  }
  
  .neon-text {
    text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .animate-spin {
    animation: spin 10s linear infinite;
  }
  
  .animate-bounce {
    animation: bounce 2s ease-in-out infinite;
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    h1 {
      font-size: calc(${({ theme }) => theme.typography.heading.h1} * 0.8);
    }
    
    h2 {
      font-size: calc(${({ theme }) => theme.typography.heading.h2} * 0.8);
    }
    
    h3 {
      font-size: calc(${({ theme }) => theme.typography.heading.h3} * 0.8);
    }
  }
`;
