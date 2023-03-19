use async_trait::async_trait;

use crate::{
    utils::{config::Config, Class, Enum, Property, PropertyTypeRelation},
    SystemSchema,
};

pub mod prisma;
pub mod typescript;

#[async_trait]
pub trait TargetLanguage {
    async fn generate(&mut self, workspace_id: &str, schema: &SystemSchema) {
        // Fetch all workspace classes
        let classes_query = reqwest::get(format!(
            "{}/workspaces/{}/classes",
            Config::get_host(),
            &workspace_id
        ))
        .await
        .expect("Failed to fetch endpoint")
        .json::<Vec<Class>>()
        .await
        .expect("Failed to parse json");
    }

    fn generate_types(&mut self, class_list: &Vec<Class>) -> String;

    fn generate_generic_types(&mut self, class_list: &Vec<Class>) -> String;

    fn generate_enums(&mut self, enum_list: &Vec<Enum>) -> String;

    fn generate_props(&mut self, prop_list: &Vec<Property>) -> String;

    // fn get_property_type(&mut self, property_type: &PropertyTypeRelation) -> &str;
}
