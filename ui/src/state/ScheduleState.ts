import { atom, atomFamily } from "recoil";
import { Schedule } from "~../app/bindings/Schedule";

export namespace ScheduleState {
  export const scheduleIds = atom<string[]>({
    key: "ScheduleState.scheduleIds",
    default: [],
  });

  export const schedule = atomFamily<Schedule, string>({
    key: "ScheduleState.schedule",
    default: (id) => {
      return {
        id,
        volumePoints: [],
      } as Schedule;
    },
  });
}
