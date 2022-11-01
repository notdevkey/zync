pub mod sample_data;

#[derive(Default)]
pub enum PropertyType {
    #[default]
    String,
    Integer,
    DateTime,
    Foreign(Class),
}

#[derive(Default)]
pub struct Property {
    pub name: String,
    pub property_type: PropertyType,
    pub required: Option<bool>,
    pub description: String,
}

#[derive(Default)]
pub struct EnumValue {
    pub name: String,
    pub description: Option<String>,
}

pub struct Class {
    pub name: String,
    pub description: String,
    pub properties: Vec<Property>,
}

pub struct Enum {
    pub name: String,
    pub description: Option<String>,
    pub values: Vec<EnumValue>,
}

#[derive(Default)]
pub struct SystemSchema {
    pub name: String,
    pub classes: Option<Vec<Class>>,
    pub enums: Option<Vec<Enum>>,
}
