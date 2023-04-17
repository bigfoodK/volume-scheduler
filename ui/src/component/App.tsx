import React from "react";
import useScheduleAction from "~src/action/useScheduleAction";

export default function App() {
  const { startSchedule } = useScheduleAction();
  return (
    <>
      <button
        onClick={() => {
          startSchedule({
            volumePoints: [
              {
                offsetSecond: 0,
                volume: 0.5,
              },
            ],
          });
        }}
      >
        test
      </button>
    </>
  );
}
