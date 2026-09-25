// A disposable local HTTP origin exercises the way GitHub Pages shares storage.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const files = new Map([
  ['/', 'index.html'],
  ['/Mission_Control_v8.0.0.html', 'Mission_Control_v8.0.0.html'],
  ['/legacy/Mission_Control_v7.8.html', 'legacy/Mission_Control_v7.8.html']
]);
const results = [];
async function test(name, fn) {
  try { await fn(); results.push({ name, passed: true }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, passed: false, error: error.stack }); console.error('FAIL ' + name + '\n' + error.stack); }
}
(async () => {
  const server = http.createServer((req, res) => {
    const file = files.get(req.url);
    if (!file) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(root, file)));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
    await test('Hosted root serves v8 and legacy recovery remains reachable', async () => {
      const context = await browser.newContext();
      try {
        const page = await context.newPage();
        await page.goto(url);
        assert.equal(await page.evaluate(() => MC.version), '8.0.0');
        const legacy = await context.request.get(url + 'legacy/Mission_Control_v7.8.html');
        assert.equal(legacy.status(), 200);
        assert.match(await legacy.text(), /missionControlRPG_v3/);
      } finally { await context.close(); }
    });
    await test('Hosted origin discovers and migrates v7 progress without changing its old save', async () => {
      const context = await browser.newContext();
      try {
        const legacy = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/legacy-populated-v7.json'), 'utf8'));
        const page = await context.newPage();
        await page.goto(url);
        await page.evaluate(value => localStorage.setItem('missionControlRPG_v3', JSON.stringify(value)), legacy);
        await page.reload();
        await page.locator('[data-action=legacy]').click();
        await page.locator('#legacyForm [name=original]').check();
        await page.locator('#legacyForm button[type=submit]').click();
        await page.locator('[data-action=confirm-migration]').click();
        assert.equal(await page.evaluate(() => MC.snapshot().progress.records['act-01-01'].completed), true);
        assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('missionControlRPG_v3'))), legacy);
      } finally { await context.close(); }
    });
    await test('Homepage and versioned hosted entry share the saved configuration and progress', async () => {
      const context = await browser.newContext();
      try {
        const page = await context.newPage();
        await page.goto(url);
        await page.locator('[name=weeklyHours]').fill('4.5');
        await page.locator('#plannerForm button[type=submit]').click();
        const saved = await page.evaluate(() => MC.snapshot());
        await page.goto(url + 'Mission_Control_v8.0.0.html');
        assert.deepEqual(await page.evaluate(() => MC.snapshot()), saved);
      } finally { await context.close(); }
    });
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
  fs.writeFileSync(path.join(root, 'test-results/hosted-results.json'), JSON.stringify({ runAt: new Date().toISOString(), results }, null, 2));
  if (results.some(x => !x.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
