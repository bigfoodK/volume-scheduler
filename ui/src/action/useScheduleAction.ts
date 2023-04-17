import { invoke } from "@tauri-apps/api";
import { useCallback } from "react";
import { Schedule } from "~../app/bindings/Schedule";

export default function useScheduleAction() {
  const startSchedule = useCallback((schedule: Schedule) => {
    invoke("start_schedule", {
      schedule,
    });
  }, []);

  return { startSchedule };
}
