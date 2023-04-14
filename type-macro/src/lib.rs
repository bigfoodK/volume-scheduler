extern crate proc_macro;

mod generate_struct_type;
mod write_typescript_type_file;

use generate_struct_type::generate_struct_type;
use proc_macro::TokenStream;
use syn::{parse_macro_input, DeriveInput, __private::ToTokens};
use write_typescript_type_file::write_typescript_type_file;

#[proc_macro_attribute]
pub fn export_struct_as_typescript_type(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as DeriveInput);
    let struct_name = input.ident.to_string();
    let content = match &input.data {
        syn::Data::Struct(data) => generate_struct_type(&struct_name, data),
        _ => panic!("Only structs can be exported as typescript types"),
    };
    write_typescript_type_file(&struct_name, &content);
    input.to_token_stream().into()
}

// TODO ipc types
