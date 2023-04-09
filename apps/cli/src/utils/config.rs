pub struct Config {}

impl Config {
    pub fn get_host() -> &'static str {
        if cfg!(debug_assertions) {
            dotenv!("HOST_DEV")
        } else {
            dotenv!("HOST_PROD")
        }
    }
}
