use crate::{
    languages::{prisma::generate_prisma, typescript::generate_typescript},
    utils::Workspace,
    ConfigFile, Generate, Language,
};

pub async fn run_generate(args: &Generate) -> Result<bool, Box<dyn std::error::Error>> {
    let config = ConfigFile::new(&args.config_file_path).unwrap();

    let workspace = reqwest::get(format!(
        "http://localhost:3333/api/workspaces?name={}",
        config.workspace
    ))
    .await
    .expect("Couldn't make request")
    .json::<Workspace>()
    .await
    .expect("Couldn't parse data");

    for schema in config.schemas.iter() {
        match schema.1.project_type {
            Language::Prisma => generate_prisma(&workspace.id, schema.1).await,
            Language::Typescript => generate_typescript(&workspace.id, schema.1).await,
        }
    }
    Ok(true)
}
