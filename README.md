# Mission Control

A local-first learning planner for six technical and career-development tracks. Plan the next session around the time you actually have, keep useful evidence, and connect progress to projects without a growing overdue queue.

**[Open the live app](https://senseikirb.github.io/Mission-Control/)** · [Standalone HTML](Mission_Control_v8.0.0.html) · [Migration and backup guide](MIGRATION_AND_BACKUP_GUIDE.md)

## Start using it

Open the live app, or download `Mission_Control_v8.0.0.html` and open it in a browser that executes local HTML. The application has no required backend, account, subscription, runtime package or AI API. Learning links require internet access; some preserved project ideas independently mention external services.

1. Set a weekly time budget, preferred tracks and next-session minutes/format.
2. Choose one of the explained recommendations. Log partial sessions and record a next step.
3. Mark completion separately from time logged. Add an example, checkpoint or project link when useful.
4. Park unfinished work and resume when it fits. Cycles advance only when you choose.

The plan retains 24 cycles, 240 activities, six projects, 120 Side Quests, 23 Leadership Academy lessons and 97 resource-library entries. Resource pricing, availability and credential claims are preserved but labeled unverified.

## Existing progress

Export your save from v7.8 before migrating, then use **Config Editor → Import / restore** in v8. Saves are local to the browser and origin; the hosted app and a downloaded local file do not share storage. The migration preserves the original save and holds ambiguous positional records for explicit review. See the [full migration guide](MIGRATION_AND_BACKUP_GUIDE.md) before confirming the original-plan checkbox.

The [legacy v7.8 page](legacy/Mission_Control_v7.8.html) remains available for exporting or restoring old progress on the same hosted origin. It is retained only for rollback and has the original v7.8 limitations. Do not use it for new v8 work.

Download a **Full backup** before moving files, changing browser or clearing site data. **Do not upload personal progress to this public repository.** Ordinary rest is always available, quiet mode is supported, and celebrations are optional.

## Documentation and verification

- [Migration, backup and recovery](MIGRATION_AND_BACKUP_GUIDE.md)
- [Change log](CHANGELOG.md)
- [Original application test report](TEST_REPORT.md)
- [Repository integration checks](REPOSITORY_TEST_REPORT.md)
- [Synthetic test fixtures](fixtures/README.md)
- [Developer workflow](CONTRIBUTING.md)

Phone checks use browser emulation, not a physical iPhone. Actual Safari/file handling and on-screen keyboard behavior still need device testing.

## Maintain the app

Editable sources live in `src/`. A dependency-free build produces **identical** `index.html` and versioned standalone HTML files. GitHub Pages serves `index.html` from `main`.

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

Node.js and Playwright are development tools only; the resulting HTML needs neither. See [CONTRIBUTING.md](CONTRIBUTING.md) for stable-ID rules, test options and release checks.
