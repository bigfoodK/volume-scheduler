use crate::volume::set_volume;
use serde::{Deserialize, Serialize};
use std::time::SystemTime;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Schedule {
    id: String,
    volume_points: Vec<VolumePoint>,
}

impl Schedule {
    pub fn run(self) -> RunningSchedule {
        RunningSchedule {
            started_at: SystemTime::now(),
            volume_points: self.volume_points,
            volume_point_cursor: 0,
        }
    }
}

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct VolumePoint {
    offset_second: f32,
    volume: f32,
}

impl VolumePoint {
    fn interpolated_volume(&self, next: &Self, elapsed_second: f32) -> Option<f32> {
        let second_diff = next.offset_second - self.offset_second;
        if second_diff.is_sign_negative() {
            return None;
        }
        let progress = (elapsed_second - self.offset_second) / second_diff;
        let volume_diff = next.volume - self.volume;
        Some((self.volume + (volume_diff * progress)).min(1.0).max(0.0))
    }
}

pub struct RunningSchedule {
    started_at: SystemTime,
    volume_points: Vec<VolumePoint>,
    volume_point_cursor: usize,
}

impl RunningSchedule {
    pub fn update_system_volume(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let new_volume = self.get_volume();
        if let Some(new_volume) = new_volume {
            set_volume(new_volume);
            return Ok(());
        }
        Err("No more schedule exists".into())
    }
    fn get_volume(&mut self) -> Option<f32> {
        let elapsed_second = self.elapsed_second();
        loop {
            let next_volume_point = self.volume_points.get(self.volume_point_cursor + 1)?;
            match elapsed_second < next_volume_point.offset_second {
                true => break,
                false => self.volume_point_cursor += 1,
            }
        }
        match (
            self.volume_points.get(self.volume_point_cursor),
            self.volume_points.get(self.volume_point_cursor + 1),
        ) {
            (Some(current), None) => Some(current.volume),
            (Some(current), Some(next)) => current.interpolated_volume(next, elapsed_second),
            _ => None,
        }
    }
    fn elapsed_second(&self) -> f32 {
        let elapsed = self.started_at.elapsed().unwrap();
        elapsed.as_secs_f32()
    }
}
