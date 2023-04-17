import { DefaultTheme, createGlobalStyle } from "styled-components";

export const theme: DefaultTheme = {
  color: {
    primary: {
      main: "#2d55ff",
      contrastText: "#efeff0",
    },
    secondary: {
      main: "#f22613",
      contrastText: "#efeff0",
    },
    background: {
      light: "#34495e",
      main: "#22313f",
      dark: "#24252a",
      contrastText: "#efeff0",
    },
  },
  radius: "4px",
};

export const GlobalStyle = createGlobalStyle`
    html {
        background: ${({ theme }) => theme.color.background.dark};
    }

    button {
        font-size: 1rem;
    }
`;
