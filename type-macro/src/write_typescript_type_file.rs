use std::{env, fs::create_dir_all, io::Write, path::PathBuf};

pub fn write_typescript_type_file(type_name: &str, content: &str) {
    let file_name = format!("{}.ts", type_name);
    let out_dir = PathBuf::from(env::current_dir().unwrap().as_path()).join("__generated__");
    create_dir_all(&out_dir).unwrap();
    let mut file = std::fs::File::create(out_dir.join(file_name)).unwrap();
    file.write_all(content.as_bytes()).unwrap();
}
