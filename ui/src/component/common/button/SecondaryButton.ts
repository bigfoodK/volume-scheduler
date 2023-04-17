import styled from "styled-components";
import { ButtonBase } from "./ButtonBase";

export const SecondaryButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.color.secondary.main};
  color: ${({ theme }) => theme.color.secondary.contrastText};
`;
