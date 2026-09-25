# Repository integration verification

This report covers the repository integration separately from the original [v8 application test report](TEST_REPORT.md).

The repository's GitHub Pages entry point was still v7.8, although a separate v8 HTML had been uploaded. Supporting fixture and verification files were also at the root while documentation linked to directories. The integration replaces `index.html` with the same standalone v8 application, preserves the original at [the legacy rollback page](legacy/Mission_Control_v7.8.html), and restores the documented folder layout.

The repository now contains the editable source, a deterministic build, executable regression suites, dependency lockfile and GitHub Actions verification. Test results are generated under ignored `test-results/`; committed `verification/` files remain historical evidence of the original v8 run.

## Executed local checks

On September 25, 2026, all **61 checks passed** using Node.js and headless Microsoft Edge 153.0.4234.32 on Windows:

| Suite | Passed | Scope |
| --- | ---: | --- |
| Repository | 5 | Identical generated entries, preserved legacy config, documentation links, fixture validation, portable source paths |
| Engine | 28 | Config round trips, stable IDs, migration/recovery, progression reversals including randomized sequences, planner and local-day boundaries |
| Browser | 21 | Persistence/reload, backup restoration, failed storage, migration, evidence, deferral, bulk completion, mobile emulation and keyboard access |
| Focused regression | 4 | Original content preservation, nested malformed backup rejection, focus restoration and visible save failure in dialogs |
| Hosted-origin browser | 3 | HTTP homepage/rollback availability, legacy migration on the same origin, shared saves between homepage and versioned entry |

The deterministic build check and JavaScript syntax checks also passed. The dependency lockfile was resolved against the npm registry. Browser test dependencies are development tools only; the delivered HTML needs no install or external runtime.

Phone checks use browser emulation, including narrow layouts and a reduced viewport representing limited keyboard space. These are **not physical iPhone, Safari, or actual mobile-keyboard tests**. All progress used for testing is synthetic.

## GitHub verification

The [Verify standalone app workflow](.github/workflows/verify.yml) repeats the repository, engine and browser suites on Ubuntu with Node.js 22 and Playwright Chromium. Each run installs from the lockfile and uploads results/screenshots as a temporary artifact. Current run status is available in [GitHub Actions](https://github.com/Senseikirb/Mission-Control/actions/workflows/verify.yml); this document records the local execution above rather than predicting future CI results.
