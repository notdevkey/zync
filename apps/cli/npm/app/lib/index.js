#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = require('child_process');
/**
 * Returns the executable path which is located inside `node_modules`
 * The naming convention is app-${os}-${arch}
 * If the platform is `win32` or `cygwin`, executable will include a `.exe` extension.
 * @see https://nodejs.org/api/os.html#osarch
 * @see https://nodejs.org/api/os.html#osplatform
 * @example "x/xx/node_modules/app-darwin-arm64"
 */
function getExePath() {
  const arch = process.arch;
  let os = process.platform;
  let extension = '';
  if (['win32', 'cygwin'].includes(process.platform)) {
    os = 'windows';
    extension = '.exe';
  }
  try {
    // Since the binary will be located inside `node_modules`, we can simply call `require.resolve`
    return require.resolve(`@zyncli/zync-${os}-${arch}/bin/cli${extension}`);
  } catch (e) {
    throw new Error(
      `Couldn't find application binary inside node_modules for ${os}-${arch}`,
    );
  }
}
/**
 * Runs the application with args using nodejs spawn
 */
function run() {
  var _a;
  const args = process.argv.slice(2);
  const processResult = (0, child_process_1.spawnSync)(getExePath(), args, {
    stdio: 'inherit',
  });
  process.exit((_a = processResult.status) !== null && _a !== void 0 ? _a : 0);
}
run();
