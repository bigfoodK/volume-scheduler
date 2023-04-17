import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      primary: {
        main: string;
        contrastText: string;
      };
      secondary: {
        main: string;
        contrastText: string;
      };
      background: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
    };
    radius: string;
  }
}
