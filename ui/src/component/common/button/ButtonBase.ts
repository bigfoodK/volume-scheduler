import styled from "styled-components";

export const ButtonBase = styled.button`
  display: flex;
  padding: 0px;
  margin: 0px;
  border: 0px;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius};
  gap: 0.25rem;

  transition: filter 0.1s ease-in-out;
  filter: brightness(1);

  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.8);
  }
  &:disabled {
    cursor: default;
    filter: brightness(0.6) grayscale(0.5);
  }
`;
