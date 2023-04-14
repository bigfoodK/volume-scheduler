use windows_volume_control::AudioController;

pub fn set_volume(volume: f32) {
    unsafe {
        let mut controller = AudioController::init();
        controller.GetSessions();
        controller.GetDefaultAudioEnpointVolumeControl();
        let test = controller.get_all_session_names();
        let master_session = controller
            .get_session_by_name(test.first().unwrap().clone())
            .unwrap();
        master_session.setVolume(volume);
    }
}
