use type_macro::export_struct_as_typescript_type;
use uuid::Uuid;

#[export_struct_as_typescript_type]
pub struct Schedule {
    pub id: Uuid,
    pub points: Vec<VolumePoint>,
}

#[export_struct_as_typescript_type]
pub struct VolumePoint {
    pub id: Uuid,
    pub offset_second: usize,
    pub volume: f32,
}
