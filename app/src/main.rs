#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use schedule::Schedule;
use std::{
    thread::{sleep, spawn},
    time::Duration,
};

mod schedule;
mod volume;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_schedule])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn start_schedule(schedule: Schedule) -> Result<(), String> {
    spawn(|| {
        let mut running_schedule = schedule.run();
        loop {
            if running_schedule.update_system_volume().is_err() {
                break;
            }
            sleep(Duration::from_millis(100));
        }
    });

    Ok(())
}
