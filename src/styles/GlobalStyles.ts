import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme?: DefaultTheme }>`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
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
    color: ${({ theme }) => theme.colors.onBackground};
    overflow-x: hidden;
    line-height: 1.5;
  }
  
  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    border: none;
    outline: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.typography.heading.h1};
  }
  
  h2 {
    font-size: ${({ theme }) => theme.typography.heading.h2};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.heading.h3};
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
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryVariant};
    }
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primaryVariant};
  }
`;
