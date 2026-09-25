# Working on Mission Control

The application is still a single HTML file. Node.js and Playwright are used only to build and test changes; users need neither.

## Source of truth

- `src/config.json`: complete learning content and stable identifiers.
- `src/engine.js`: validation, migration, planning and progression.
- `src/app.js`: browser interface and storage transactions.
- `src/shell.html`: accessible document shell and styles.
- `scripts/build.cjs`: deterministic, dependency-free HTML assembly.

Edit the source, then run `npm run build`. Commit both generated files: `index.html` for GitHub Pages and `Mission_Control_v8.0.0.html` for the standalone download. `npm run build:check` detects drift between the source and either entry point. Builds do not need the original author's desktop files.

## Verify a change

Use Node.js 22 or newer:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

`npm test` checks generated-file parity, documentation links, legacy preservation, fixture integrity and the data-model suite. Browser tests use disposable profiles and synthetic progress. They normally run against `index.html` as a local file. `MC_TEST_URL` can point them at a development HTTP URL, and `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select an existing Chromium/Edge executable. Results and screenshots go into ignored `test-results/`; tests do not rewrite the committed fixtures.

The GitHub Actions workflow executes these checks on pull requests and main-branch updates. GitHub Pages continues to publish the root of `main`. Merge only after checks pass; confirm the Pages deployment finishes before reporting the live site updated.

## Protect progress

Keep IDs when moving or editing existing content. New work needs a new ID. Never reuse an old ID for unrelated work. Validate changes, preserve recovery archives, and test complete → undo → complete. Keep application schema changes separate from simple presentation changes and add explicit migrations when needed.

Do not commit personal backups, portfolio exports, browser profiles or real progress. Files in [fixtures](fixtures/README.md) are synthetic. [Migration guidance](MIGRATION_AND_BACKUP_GUIDE.md) documents limits on reconstructing legacy history.

## Review expectations

Keep the six-domain plan, offline operation, quiet mode, browser zoom and recovery paths working. Use real controls with accessible names; keep all sections reachable on narrow screens. Clearly distinguish browser emulation from physical device testing. Do not describe preserved third-party resource claims as current without verifying them.
