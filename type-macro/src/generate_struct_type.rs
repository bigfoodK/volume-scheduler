use std::collections::BTreeSet;
use syn::{DataStruct, Field, Path};

pub fn generate_struct_type(struct_name: &str, data: &DataStruct) -> String {
    let mut imports = BTreeSet::<String>::new();
    let mut content = Vec::<String>::new();

    content.push(format!("export type {struct_name} = {{"));
    for field in &data.fields {
        let field_name = field.ident.as_ref().unwrap().to_string();
        let type_name = type_name(field, &mut imports);
        content.push(format!("  {field_name}: {type_name};"));
    }
    content.push("};".to_string());

    for import in imports {
        content.insert(0, format!("import {{ {import} }} from './{import}';"));
    }

    content.push("".to_string());
    content.join("\n")
}

fn type_name(field: &Field, mut imports: &mut BTreeSet<String>) -> String {
    match &field.ty {
        syn::Type::Path(path) => type_name_from_path(&path.path, &mut imports),
        _ => unimplemented!(),
    }
}
fn type_name_from_path(path: &Path, imports: &mut BTreeSet<String>) -> String {
    if let Some(ident) = path.get_ident() {
        let ident = ident.to_string();
        match try_convert_path_ident_str_to_typescript_builtin_type_name(&ident) {
            Some(builtin_typescript_type_name) => return builtin_typescript_type_name,
            None => {
                imports.insert(ident.clone());
                return ident;
            }
        }
    }

    if path.segments.len() != 1 {
        panic!("Only single segment paths are supported");
    }
    let segment = path.segments.first().unwrap();
    let segment_name = segment.ident.to_string();
    match segment_name.as_str() {
        "Vec" => {
            let inner_type_name = match &segment.arguments {
                syn::PathArguments::AngleBracketed(generic_arguments) => {
                    let generic_argument = generic_arguments.args.first().unwrap();
                    let syn::GenericArgument::Type(ty) = generic_argument else {
                         unimplemented!();
                    };
                    let syn::Type::Path(path)  =  ty else {
                        unimplemented!();
                    };
                    type_name_from_path(&path.path, imports)
                }
                _ => unimplemented!(),
            };
            format!("{}[]", inner_type_name)
        }
        _ => panic!("Only Vec is supported"),
    }
}
fn try_convert_path_ident_str_to_typescript_builtin_type_name(ident_str: &str) -> Option<String> {
    match ident_str {
        "String" | "Uuid" => Some("string".to_string()),
        "i8" | "u8" | "i16" | "u16" | "i32" | "u32" | "i64" | "u64" | "i128" | "u128" | "isize"
        | "usize" => Some("number".to_string()),
        _ => None,
    }
}
