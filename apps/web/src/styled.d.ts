import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      mutedText: string;
    };
    fonts: any
    spacing: (factor: number) => string;
  }
}
