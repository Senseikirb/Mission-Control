# Synthetic verification fixtures

**These are test data, not the user's accomplishments.** Use an isolated browser profile/context, or export your real Full backup first. Importing a full fixture replaces the active bundle after review.

| File | Purpose |
| --- | --- |
| `fresh-v8.json` | Empty schema-8 bundle with the entire shipped config. |
| `legacy-populated-v7.json` | Synthetic legacy notes, partial hours, completions, project, jobs, retrospective, rewards, balance and unmatched records. With exact-original-plan confirmation, two records remain unmatched. |
| `legacy-ambiguous-v7.json` | A completed activity named “LeetCode: 5 medium problems,” which occurs twice in the plan. It must remain flagged for mapping review. |
| `full-backup-populated-v8.json` | A migrated synthetic bundle plus one new partial session/completion. Exercises config + progress + archive restoration. |
| `config-unchanged-v8.json` | Complete exported config. It must validate and apply unchanged. |
| `config-reordered-v8.json` | Moves the first activity from cycle 1 to cycle 2 while keeping its ID. Progress must follow the activity; derived-hour warnings are expected. |
| `malformed-v8.json` | Intentionally invalid progress shape. Import must fail without changing active data. |

The automated suites also inject storage quota/security failures, unsafe links, invalid config sections, duplicate IDs, unknown/cyclic prerequisites, local dates around midnight/DST, and altered completion orders. Those fault injections affect only disposable browser contexts.
