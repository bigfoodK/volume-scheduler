import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ScheduleState } from "~src/state/ScheduleState";

type Props = {
  id: string;
};

export default function ScheduleEditor(props: Props) {
  const [schedule, setSchedule] = useRecoilState(
    ScheduleState.schedule(props.id)
  );
  return <Container>{schedule.id}</Container>;
}

const Container = styled.div`
  width: 100%;
  height: 16rem;
  background-color: ${({ theme }) => theme.color.background.main};
`;
