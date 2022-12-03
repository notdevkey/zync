use serde::Deserialize;

pub mod config;

#[derive(Debug, Default, Deserialize)]
pub enum PropertyType {
    #[default]
    String,
    Integer,
    DateTime,
    Foreign(Class),
}

#[derive(Default, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Property {
    pub name: String,
    pub property_type: PropertyType,
    pub is_required: bool,
    pub description: String,
}

#[derive(Default, Deserialize)]
pub struct EnumValue {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Class {
    pub id: String,
    pub name: String,
    pub description: String,
    pub properties: Vec<Property>,
    pub workspace_id: String,
}

#[derive(Deserialize)]
pub struct Enum {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub values: Vec<EnumValue>,
}

#[derive(Debug, Deserialize)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub description: String,
}
