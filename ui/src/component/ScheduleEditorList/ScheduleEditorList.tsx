import React, { useMemo } from "react";
import styled from "styled-components";
import ScheduleEditor from "./ScheduleEditor";
import useScheduleAction from "~src/action/useScheduleAction";
import { FaPlus } from "react-icons/fa";
import { PrimaryButton } from "../common/button/PrimaryButton";
import { useRecoilValue } from "recoil";
import { ScheduleState } from "~src/state/ScheduleState";

export default function ScheduleEditorList() {
  const scheduleIds = useRecoilValue(ScheduleState.scheduleIds);
  const { createNewSchedule } = useScheduleAction();

  const Items = useMemo(
    () =>
      scheduleIds.map((id) => (
        <ScheduleEditor key={`ScheduleEditor-${id}`} id={id} />
      )),
    [scheduleIds]
  );

  return (
    <Container>
      {Items}
      <PrimaryButton onClick={createNewSchedule}>
        <FaPlus />
        Create Schedule
      </PrimaryButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;
