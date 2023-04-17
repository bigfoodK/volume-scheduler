import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ScheduleState } from "~src/state/ScheduleState";
import { SecondaryButton } from "../common/button/SecondaryButton";
import { PrimaryButton } from "../common/button/PrimaryButton";
import Graph from "./Graph";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

type Props = {
  id: string;
};

export default function ScheduleEditor(props: Props) {
  const [schedule, setSchedule] = useRecoilState(
    ScheduleState.schedule(props.id)
  );
  return (
    <Container>
      <StartButton>
        <FaPlay />
      </StartButton>
      <DeleteButton>
        <FaTrashAlt />
      </DeleteButton>
      <Graph />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  height: 16rem;
  background-color: ${({ theme }) => theme.color.background.main};
  gap: 0.5rem;
  grid-template:
    "startButton graph" 1fr
    "deleteButton graph" 1fr
    / 4rem 1fr;
`;

const StartButton = styled(PrimaryButton)`
  grid-area: startButton;
  font-size: 1.5rem;
`;

const DeleteButton = styled(SecondaryButton)`
  grid-area: deleteButton;
  font-size: 1.5rem;
`;
