import { atom, atomFamily } from "recoil";
import { Schedule } from "~../app/bindings/Schedule";

export namespace ScheduleState {
  export const scheduleIds = atom<string[]>({
    key: "ScheduleState.scheduleIds",
    default: JSON.parse(
      localStorage.getItem("ScheduleState.scheduleIds") || "[]"
    ),
    effects: [
      ({ onSet }) => {
        onSet((newValue) => {
          localStorage.setItem(
            "ScheduleState.scheduleIds",
            JSON.stringify(newValue)
          );
        });
      },
    ],
  });

  export const schedule = atomFamily<Schedule, string>({
    key: "ScheduleState.schedule",
    default: (id) => {
      const key = `ScheduleState.schedule-${id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return {
        id,
        volumePoints: [],
      } as Schedule;
    },
    effects: [
      ({ onSet }) => {
        onSet((newValue, _, isReset) => {
          const key = `ScheduleState.schedule-${newValue.id}`;
          if (isReset) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(newValue));
          }
        });
      },
    ],
  });
}
