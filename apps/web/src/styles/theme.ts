// src/styles/theme.ts
export const theme = {
    colors: {
      primary: '#FFEB3B',      // Bright yellow accent
      secondary: '#26355D',    // Deep navy - background
      text: '#FFFFFF',         // White text for dark mode
      mutedText: '#BFC6DC',    // Softer gray-blue for subtext
    },
    fonts: {
      main: "'Poppins', sans-serif",
    },
    spacing: (factor: number) => `${0.25 * factor}rem`,
  };
  
  export type ThemeType = typeof theme;
  