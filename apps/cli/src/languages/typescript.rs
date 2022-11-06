use indoc::indoc;
use std::{fs::write, path::PathBuf};

use crate::utils::{Class, Enum, Property, PropertyType, SystemSchema};

pub fn generate_typescript(schema: &SystemSchema, dest_path: &PathBuf) {
    // Generate classes (interfaces)
    let classes = if let Some(classes) = &schema.classes {
        generate_classes(classes)
    } else {
        "".to_string()
    };

    // Generate enums
    let enums = if let Some(enums) = &schema.enums {
        generate_enums(enums)
    } else {
        "".to_string()
    };

    let result = classes + &enums;
    let file = write(dest_path, result);
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
                  \t{},
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
              }};\n
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
        let property_type = get_property_type(&property.property_type);

        // Format and concatenate with result
        let property = format!(
            indoc! {"
            \t{}{}: {};
            "},
            property.name.to_lowercase(),
            if let Some(_) = property.required {
                "?"
            } else {
                ""
            },
            property_type
        );
        acc + &property
    })
}

fn get_property_type(property_type: &PropertyType) -> &str {
    // Get the language-specific names for each property type
    match property_type {
        PropertyType::String | PropertyType::DateTime => "string",
        PropertyType::Integer => "number",
        PropertyType::Foreign(_) => todo!(),
    }
}
