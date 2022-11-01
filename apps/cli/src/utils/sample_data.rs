use std::vec;

use super::{Class, Enum, EnumValue, Property, PropertyType, SystemSchema};

pub fn get_sample_data() -> SystemSchema {
    SystemSchema {
        name: "Sample system".to_string(),
        classes: Some(vec![
            Class {
                name: "Product".to_string(),
                description: "This is a product model for e-commerce sample system".to_string(),
                properties: vec![
                    Property {
                        name: "Name".to_string(),
                        property_type: PropertyType::String,
                        description: "Name of the product".to_string(),
                        ..Default::default()
                    },
                    Property {
                        name: "Width".to_string(),
                        property_type: PropertyType::Integer,
                        description: "Width of the product".to_string(),
                        ..Default::default()
                    },
                ],
            },
            Class {
                name: "User".to_string(),
                description: "".to_string(),
                properties: vec![
                    Property {
                        name: "Name".to_string(),
                        property_type: PropertyType::String,
                        description: "Name of the user".to_string(),
                        ..Default::default()
                    },
                    Property {
                        name: "Email".to_string(),
                        description: "User's email".to_string(),
                        property_type: PropertyType::String,
                        ..Default::default()
                    },
                    Property {
                        name: "Age".to_string(),
                        description: "Age of the user".to_string(),
                        property_type: PropertyType::Integer,
                        ..Default::default()
                    },
                ],
            },
        ]),
        enums: Some(vec![Enum {
            name: "Colors".to_string(),
            description: Some("All possible colors you can imagine".to_string()),
            values: vec![
                EnumValue {
                    name: "Red".to_string(),
                    ..Default::default()
                },
                EnumValue {
                    name: "Green".to_string(),
                    ..Default::default()
                },
            ],
        }]),
        ..Default::default()
    }
}
