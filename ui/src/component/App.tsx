import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "~src/constance/theme";
import ScheduleEditorList from "./ScheduleEditorList/ScheduleEditorList";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <ScheduleEditorList />
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
