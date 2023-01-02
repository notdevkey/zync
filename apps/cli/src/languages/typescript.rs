use indoc::indoc;
use std::fs::write;

use convert_case::{Case, Casing};

use crate::{
    utils::{config::Config, Class, Enum, Property, PropertyTypeRelation},
    SystemSchema,
};

pub async fn generate_typescript(workspace_id: &str, schema: &SystemSchema) {
    // Fetch all workspace classes
    let classes_query = reqwest::get(format!(
        "{}/workspaces/{}/classes",
        Config::get_host(),
        workspace_id
    ))
    .await
    .expect("Failed to fetch endpoint")
    .json::<Vec<Class>>()
    .await
    .expect("Failed to parse json");

    // Generate classes (interfaces)
    let classes = generate_classes(&classes_query);
    // Generate enums
    // let enums = if let Some(enums) = &schema.enums {
    //     generate_enums(enums)
    // } else {
    //     "".to_string()
    // };

    let result = classes;
    let file = write(&schema.path, result);
    match file {
        Ok(_) => println!("File written successfully"),
        Err(_) => println!("Coulnd't write file"),
    }
}

fn generate_enums(enums: &Vec<Enum>) -> String {
    // Iterate over all enums and generate a single string out of them
    enums.iter().fold("".to_string(), |acc, _enum| {
        // Format enum values in the expected language format
        let values = _enum.values.iter().fold("".to_string(), |acc, value| {
            acc + &format!(
                indoc! {"
                  {},
                "},
                value.name
            )
        });

        // Wrap enum values in enum constructor
        let formatted_enum = format!(
            indoc! {"
              enum {} {{
              {}\
              }};
            "},
            _enum.name, values
        );
        acc + &formatted_enum
    })
}

fn generate_classes(classes: &Vec<Class>) -> String {
    // Iterate over classes and generate a single string out of them
    classes.iter().fold("".to_string(), |acc, class| {
        // Get all class properties (formatted)
        let properties = generate_properties(&class.properties);

        // Wrap class properties in constructor
        let class = format!(
            indoc! {"
              interface {} {{
              {}\
              }}
            "},
            class.name, properties
        );
        acc + &class
    })
}

fn generate_properties(properties: &Vec<Property>) -> String {
    // Iterate over properties and generate a list of properties separated by newline
    properties.iter().fold("".to_string(), |acc, property| {
        // Get the language-specific name of property
        let property_type = get_property_type(&property.property_type_relation);

        // Format and concatenate with result
        let property = format!(
            indoc! {"
            \t{}{}: {};
            "},
            property.name.to_case(Case::Camel),
            if property.is_required { "" } else { "?" },
            property_type
        );
        acc + &property
    })
}

fn get_property_type(property_type: &PropertyTypeRelation) -> &str {
    // Get the language-specific names for each property type
    match property_type {
        PropertyTypeRelation::String => "string",
        PropertyTypeRelation::Integer => "number",
        PropertyTypeRelation::DateTime => "Date",
        PropertyTypeRelation::Foreign { name } => name,
    }
}
