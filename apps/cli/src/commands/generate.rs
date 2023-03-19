use crate::{
    languages::{prisma::generate_prisma, typescript::Typescript, TargetLanguage},
    utils::{config::Config, Class, Workspace},
    ConfigFile, Generate, Language,
};

pub async fn run_generate(args: &Generate) -> Result<bool, Box<dyn std::error::Error>> {
    let config = ConfigFile::new(&args.config_file_path).unwrap();

    let workspace = reqwest::get(format!(
        "{}/workspaces?name=First workspace",
        Config::get_host()
    ))
    .await
    .expect("Couldn't make request")
    .json::<Workspace>()
    .await
    .expect("Couldn't parse data");

    let mut tsGen = Typescript {};
    for schema in config.schemas.iter() {
        tsGen.generate(&workspace.id, &schema.1).await;
    }
    // TODO: call a generate function here

    // for schema in config.schemas.iter() {
    //     match schema.1.project_type {
    //         Language::Prisma => generate_prisma(&workspace.id, &schema.1).await,
    //         Language::Typescript => generate_typescript(&workspace.id, &schema.1).await,
    //     }
    // }
    Ok(true)
}
