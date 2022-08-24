const fs = require('fs');
function copyFromDefault(p) {
  if (!fs.existsSync(p)) {
    const defaultFile = `${p.replace('.json', '')}.default.json`;
    if (fs.existsSync(defaultFile)) {
      fs.copyFileSync(defaultFile, p);
    }
  }
}

['.vscode/settings.json', '.vscode/extensions.json', '.vscode/launch.json'].map(
  copyFromDefault
);
