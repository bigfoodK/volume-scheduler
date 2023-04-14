import { invoke } from "@tauri-apps/api";
import React from "react";

export default function App() {
  return (
    <>
      <button
        onClick={() => {
          invoke("start_schedule", {
            schedule: {
              volumePoints: [
                {
                  offsetSecond: 0,
                  volume: 0,
                },
                {
                  offsetSecond: 1,
                  volume: 0.8,
                },
                {
                  offsetSecond: 6,
                  volume: 0.2,
                },
              ],
            },
          });
        }}
      >
        test
      </button>
    </>
  );
}
