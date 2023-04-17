import { invoke } from "@tauri-apps/api";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useRecoilCallback } from "recoil";
import { Schedule } from "~../app/bindings/Schedule";
import { ScheduleState } from "~src/state/ScheduleState";

export default function useScheduleAction() {
  const startSchedule = useCallback((schedule: Schedule) => {
    invoke("start_schedule", {
      schedule,
    });
  }, []);

  const createNewSchedule = useRecoilCallback(
    ({ set }) =>
      () => {
        set(ScheduleState.scheduleIds, (previous) => [...previous, nanoid()]);
      },
    []
  );

  return { startSchedule, createNewSchedule };
}
