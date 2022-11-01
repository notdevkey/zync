use crate::{
    languages::{prisma::generate_prisma, typescript::generate_typescript},
    utils::sample_data::get_sample_data,
    ConfigFile, Generate, Language,
};

pub fn run_generate(args: &Generate) {
    let config = ConfigFile::new(&args.config_file_path).unwrap();
    // TODO: Fetch system models from webapp
    // let data_to_write = reqwest::get("http://localhost:4200/");

    let data = get_sample_data();

    for schema in config.schemas.iter() {
        match schema.project_type {
            Language::Prisma => generate_prisma(&data, &schema.path),
            Language::Typescript => generate_typescript(&data, &schema.path),
        }
    }
}
