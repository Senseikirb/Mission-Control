// Developer-only build. The generated HTML needs no Node.js or packages at runtime.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const Engine = require('../src/engine.js');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const config = JSON.parse(read('src/config.json'));
Engine.assertConfig(config);
const shell = read('src/shell.html');
const parts = {
  '/*CONFIG_DATA*/': 'const CONFIG = ' + JSON.stringify(config).replace(/</g, '\\u003c') + ';',
  '/*ENGINE_CODE*/': read('src/engine.js'),
  '/*APP_CODE*/': read('src/app.js')
};
let html = shell;
for (const [marker, value] of Object.entries(parts)) {
  if (shell.split(marker).length !== 2) throw Error('Expected one build marker: ' + marker);
  html = html.replace(marker, () => value);
}
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
const files = ['index.html', `Mission_Control_v${config.meta.version}.html`];
for (const file of files) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, file)) || read(file) !== html) {
      throw Error(file + ' differs from source. Run npm run build and commit both HTML files.');
    }
  } else {
    fs.writeFileSync(path.join(root, file), html);
  }
}
console.log(`${process.argv.includes('--check') ? 'Verified' : 'Built'} identical standalone entries: ${files.join(', ')}`);
