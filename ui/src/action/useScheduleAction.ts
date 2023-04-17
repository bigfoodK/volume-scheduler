import { invoke } from "@tauri-apps/api";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useRecoilCallback } from "recoil";
import { Schedule } from "~../app/bindings/Schedule";
import { ScheduleState } from "~src/state/ScheduleState";

export default function useScheduleAction() {
  const startSchedule = useCallback((schedule: Schedule) => {
    const firstPoint = schedule.volumePoints[0];
    if (!firstPoint) {
      return;
    }
    invoke("start_schedule", {
      schedule: {
        id: schedule.id,
        volumePoints:
          firstPoint.offsetSecond > 0
            ? [
                {
                  id: firstPoint.id,
                  offsetSecond: 0,
                  volume: firstPoint.volume,
                },
                ...schedule.volumePoints,
              ]
            : schedule.volumePoints,
      } as Schedule,
    });
  }, []);

  const createNewSchedule = useRecoilCallback(
    ({ set }) =>
      () => {
        set(ScheduleState.scheduleIds, (previous) => [...previous, nanoid()]);
      },
    []
  );

  const deleteSchedule = useRecoilCallback(
    ({ set, reset }) =>
      (targetId: string) => {
        set(ScheduleState.scheduleIds, (previous) =>
          previous.filter((id) => id !== targetId)
        );
        reset(ScheduleState.schedule(targetId));
      },
    []
  );

  return { startSchedule, createNewSchedule, deleteSchedule };
}
