# Mission Control 8.0.0 — start, migrate and recover

## Open the app

Open **Mission_Control_v8.0.0.html** in a browser that can run local HTML. Everything the application needs is inside that file: no installation, server, subscription, AI API, fonts or downloaded libraries. External learning links still need an internet connection; the original projects may independently mention paid services or APIs.

Your supplied v7.8 HTML is unchanged. This delivery contains no real or invented personal accomplishments. Test progress is confined to files explicitly named as fixtures.

The new save key is `missionControl_v8`; the old `missionControlRPG_v3` key is never changed or deleted. Browser storage is local to a browser/profile/origin. Moving or renaming a local HTML file can expose different storage. **Download a Full backup before moving the file, changing browser, clearing browser data or upgrading again.**

## Bring your existing progress forward

1. Open your original v7.8 application in the browser where your progress is saved. Use its **Export** control and keep that JSON and the original HTML.
2. Open v8. On a phone, use **Menu → Config Editor**. Choose **Import / restore** and select the old JSON. If the browser exposes the old storage automatically, a migration banner provides the same workflow.
3. Review the provenance checkbox. Check **“I confirm this save used the exact unchanged plan in the supplied v7.8 HTML”** only if that is true. Legacy activity/resource records used array positions; their export did not include the plan. An old customized plan cannot be recovered from positional progress alone.
4. Preview the migration counts, then save the migrated bundle. Without that confirmation, uncertain positional records go to recovery. Recognizable Side Quest/Academy IDs and unique named companies can still migrate. Duplicate activity titles are flagged as ambiguous even when names are available.
5. Open **Review recovery records**. Inspect each record and explicitly choose an activity where appropriate. Mapping refuses to overwrite an existing record. Unmatched resources, cycle notes and other records remain inspectable and exportable for manual recovery; they are not guessed or discarded.
6. Download a **Full backup** immediately. It includes schema version 8, the active configuration, all progress, event/session history, recovery records and the original legacy JSON values.

### What is preserved, and what cannot be reconstructed

Completion, notes, actual hours, projects and subtasks, resource states, recruitment records, custom companies, retrospectives, profile, quiet mode and legacy balances are retained where identities are known. Unknown fields, original start date and old streak/freezes also remain in the original-save archive.

Legacy XP and stats become an explicitly labeled opening balance. The old engine mixed total/remaining XP, omitted some bulk reversal records, converted optional XP incorrectly and removed rewards without source IDs. Reconstructing exact historical awards would require guessing. Therefore:

- Undoing a migrated completion changes its completion status, but does not subtract from the opening balance. Re-completing it awards no new XP.
- Legacy rewards, augmentations and achievements remain in a historical archive; undoing an unrelated activity does not remove them.
- Reported legacy credential counts remain visible separately. Add issuer/certificate evidence to record an earned credential in the new system.
- Legacy hours remain undated. They count toward activity history, but are not assigned to a fabricated week or streak day.
- New rank is derived consistently from preserved total XP. It can differ from the inconsistent legacy rank; the original rank remains in the archive.

### Roll back

In v8, choose **Export original legacy save**. Open your unchanged v7.8 HTML and import that JSON. This restores the original legacy state, not work subsequently added in v8. Keep a v8 Full backup before rolling back so you can return to the upgraded application.

## Use it in an interrupted week

Set a weekly hour budget, preferred tracks, next-session minutes and format. Recommendations are alternatives: choose one, not all three. The planner uses the selected cycle and already-started plan work. It does not accumulate calendar-based overdue tasks.

**Log session** records actual time without changing the original estimate or completing the activity. Notes, an example link and checkpoint results help you pick up later. **Mark activity complete** is a separate decision. **Skill demonstrated** requires completion and evidence and is labeled self-reported. **Record earned credential** requires issuer, reference and earned date; it does not assume an exam attempt was successful.

**Park for later** removes work from recommendations and retains its history. Find it under **Mission Board → Show → Parked**, then resume it. Change the active cycle when ready. Stretch work is optional and hidden from recommendations by default. Rest has no cost, unlock or penalty. Quiet mode is preserved; celebration banners require an explicit opt-in and quiet mode off.

## Edit configuration safely

The editor exports the entire active configuration, including `bonusMissions`, `leadershipLessons` and `views`. Use **Validate & preview changes** before application. Keep an existing activity’s `id` when reordering or moving it. Give new work a new ID; the **New ID** control supplies one. Never reuse an old ID for unrelated work.

Resources, cycles, projects, project checkpoints and companies also have stable IDs. Removed activity records and events stay archived; reinstating the same ID restores them. A successful config change saves the config and progress in one bundle and keeps one previous snapshot. **Restore previous snapshot** swaps back to that saved bundle; download separate backups to retain multiple versions.

Prerequisites must be explicitly configured: `null` means unknown, `[]` explicitly declares none, and an ID array declares requirements. No prerequisite graph was invented for the original plan. Format inference is labeled. All original resource claims, prices, credential descriptions and availability are labeled unverified. Activity sums drive planned hours; disagreements with declared cycle totals remain visible.

## If saving or importing fails

“Saved on this device” appears only after a successful write. A failed write keeps the last active saved bundle and a pending candidate in memory. Use **Download unsaved backup** or **Retry save**. Resolve the pending write before making more changes; closing the browser can lose unsaved memory. Downloading is not the same as saving to browser storage.

Malformed or inaccessible storage is not silently replaced. Recovery offers the original text, a previous snapshot, import, or an explicit fresh start retaining the malformed text in the recovery archive. Invalid imports/configurations do not apply. A different tab’s save is detected; export your pending work and reload before reviewing the newer bundle.

On iPhone, a file preview may not execute an HTML application. Use a browser environment that executes the document and permits storage. Browser-based mobile checks were performed; actual iPhone/Safari file handling, on-screen keyboard and background behavior still require device testing. Normal browser zoom remains enabled.
