import styled from "styled-components";
import { ButtonBase } from "./ButtonBase";

export const PrimaryButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.color.primary.main};
  color: ${({ theme }) => theme.color.primary.contrastText};
`;
