const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const Engine = require('../src/engine.js');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const tests = [];
function test(name, fn) { fn(); tests.push(name); console.log('PASS ' + name); }
test('Pages homepage and versioned download are identical', () => {
  assert.equal(read('index.html'), read('Mission_Control_v8.0.0.html'));
  assert.match(read('index.html'), /window\.MC=/);
  assert.doesNotMatch(read('index.html'), /maximum-scale|user-scalable=no|<script[^>]+src=/);
});
test('Legacy rollback page keeps its old save key and original configuration', () => {
  const text = read('legacy/Mission_Control_v7.8.html');
  assert.match(text, /missionControlRPG_v3/);
  const start = text.indexOf('const CONFIG = ') + 15;
  const end = text.indexOf('; // \\u2190 END OF CONFIG', start);
  const original = vm.runInNewContext('(' + text.slice(start, end) + ')', {}, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(original)), JSON.parse(read('tests/original-config.json')));
});
test('Repository documentation links resolve locally', () => {
  for (const file of ['README.md', 'CONTRIBUTING.md', 'MIGRATION_AND_BACKUP_GUIDE.md', 'CHANGELOG.md', 'TEST_REPORT.md', 'REPOSITORY_TEST_REPORT.md', 'fixtures/README.md']) {
    for (const match of read(file).matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      const resolved = path.resolve(root, path.dirname(file), decodeURIComponent(target));
      assert.ok(resolved.startsWith(root + path.sep), 'Link escapes repository: ' + target);
      assert.ok(fs.existsSync(resolved), `${file}: broken link ${target}`);
    }
  }
});
test('Version-8 fixtures validate except the intentionally malformed fixture', () => {
  for (const file of ['fresh-v8.json', 'full-backup-populated-v8.json']) Engine.validateBundle(JSON.parse(read('fixtures/' + file)));
  for (const file of ['config-unchanged-v8.json', 'config-reordered-v8.json']) Engine.assertConfig(JSON.parse(read('fixtures/' + file)));
  assert.throws(() => Engine.validateBundle(JSON.parse(read('fixtures/malformed-v8.json'))));
});
test('Repository contains no machine-specific paths in build or test code', () => {
  for (const dir of ['src', 'scripts', 'tests']) {
    for (const file of fs.readdirSync(path.join(root, dir))) {
      if (!/\.(c?js|html)$/.test(file)) continue;
      assert.doesNotMatch(read(dir + '/' + file), /[A-Z]:[\\/]Users[\\/]|executablePath:\s*['"]C:/, dir + '/' + file);
    }
  }
});
fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/repository-results.json'), JSON.stringify({ runAt: new Date().toISOString(), results: tests.map(name => ({ name, passed: true })) }, null, 2));
console.log(`${tests.length}/${tests.length} repository checks passed`);
