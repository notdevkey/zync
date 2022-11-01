use clap::{Parser, ValueEnum};
use serde::Deserialize;
use std::{
    fs::File,
    io::{prelude::*, BufReader},
    path::PathBuf,
};

mod commands;
mod languages;
mod utils;

use commands::generate::run_generate;

#[derive(Copy, Clone, Debug, ValueEnum, Deserialize)]
enum Language {
    Typescript,
    Prisma,
}

#[derive(Parser)]
#[command(name = "zync")]
#[command(bin_name = "zync")]
enum Cli {
    Generate(Generate),
    Sync(Sync),
}

#[derive(Parser)]
pub struct Sync {}

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Generate {
    #[arg(short = 'c', long = "config")]
    config_file_path: PathBuf,
    #[arg(value_enum, short, long = "language")]
    language_type: Option<Language>,
}

#[derive(Debug, Deserialize)]
struct Schema {
    name: Option<String>,
    project_type: Language,
    path: PathBuf,
}

#[derive(Debug, Deserialize)]
pub struct ConfigFile {
    schemas: Vec<Schema>,
}

impl ConfigFile {
    fn new(path: &PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let f = File::open(path).expect("Could not find config file");
        let mut reader = BufReader::new(f);
        let mut contents = String::new();
        reader.read_to_string(&mut contents)?;

        let deserialized_contents: ConfigFile =
            serde_yaml::from_str(&contents).expect("Couldn't parse file");
        Ok(deserialized_contents)
    }
}

fn main() -> Result<(), std::io::Error> {
    let Cli::Generate(args) = Cli::parse();

    run_generate(&args);

    Ok(())
}
