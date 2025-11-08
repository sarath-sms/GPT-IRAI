// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.mutedText};
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
    font-weight: 600;
    font-size: 1rem;
    transition: 0.25s ease;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 4px 12px rgba(255, 235, 59, 0.2);

    &:hover {
      opacity: 0.95;
      transform: translateY(-2px);
    }
  }

  input, textarea {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 6px;
    padding: ${({ theme }) => theme.spacing(3)};
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(255, 235, 59, 0.3);
    }
  }
`;
