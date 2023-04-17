import React from "react";
import styled from "styled-components";
import { SecondaryButton } from "../common/button/SecondaryButton";
import { PrimaryButton } from "../common/button/PrimaryButton";
import Graph from "./Graph";
import { FaPlay, FaTrashAlt } from "react-icons/fa";
import useScheduleAction from "~src/action/useScheduleAction";
import { useRecoilValue } from "recoil";
import { ScheduleState } from "~src/state/ScheduleState";

type Props = {
  id: string;
};

export default function ScheduleEditor(props: Props) {
  const { id } = props;
  const schedule = useRecoilValue(ScheduleState.schedule(id));
  const { startSchedule, deleteSchedule } = useScheduleAction();

  return (
    <Container>
      <StartButton onClick={() => startSchedule(schedule)}>
        <FaPlay />
      </StartButton>
      <DeleteButton onClick={() => deleteSchedule(id)}>
        <FaTrashAlt />
      </DeleteButton>
      <Graph scheduleId={id} />
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
