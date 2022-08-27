const fs = require('fs');
function copyFromDefault(p) {
  if (!fs.existsSync(p)) {
    const defaultFile = `${p.replace('.json', '')}.default.json`;
    if (fs.existsSync(defaultFile)) {
      fs.copyFileSync(defaultFile, p);
    }
  }
}
function copyEnv() {
  const envDestination = '.env';
  const envDefault = '.env.example';
  if (!fs.existsSync(envDestination) && fs.existsSync(envDefault)) {
    fs.copyFileSync(envDefault, envDestination);
  }
}

['.vscode/settings.json', '.vscode/extensions.json', '.vscode/launch.json'].map(
  copyFromDefault
);

copyEnv();
