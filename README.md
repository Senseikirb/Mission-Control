# Mission Control

**A single-file, offline-first sci-fi RPG that turns career development into a game you actually finish.**

Version 7.8 · 1,855 lines · 225 KB · Zero dependencies · Works by double-clicking

---

## The 30-second version

You download one HTML file. You open it in Safari on your iPhone. You add it to your home screen. From that moment forward, you have a full-screen, offline-first career development dashboard that gamifies a 24-week, multi-domain learning plan across six career tracks. You check off missions, you earn XP, you unlock ranks and augmentations, you roll for thematic loot rewards, you write reflections every four cycles, and when the time comes you export a professional portfolio suitable for a performance review or job application.

It runs on an iPhone PWA. It runs by double-clicking the file on a desktop. It never makes a network request. Your data never leaves the device. The entire plan is defined in one `CONFIG` object at the top of the file, meaning you can copy it into any AI assistant, ask for modifications in plain English, and paste the result back in — while keeping all your progress.

---

## Table of Contents

1. [Why this exists](#why-this-exists)
2. [Who it's for](#who-its-for)
3. [Quick start](#quick-start)
4. [What's in the plan](#whats-in-the-plan)
5. [The ten views](#the-ten-views)
6. [The RPG layer](#the-rpg-layer)
7. [The Narrative Layer (v7.8)](#the-narrative-layer-v78)
8. [Daily-use features](#daily-use-features)
9. [Architecture](#architecture)
10. [The CONFIG system — forking the plan](#the-config-system--forking-the-plan)
11. [Customization guide](#customization-guide)
12. [Data and privacy](#data-and-privacy)
13. [Technical constraints](#technical-constraints)
14. [Accessibility](#accessibility)
15. [Known limitations](#known-limitations)
16. [Build history](#build-history)
17. [License](#license)

---

## Why this exists

Most career tracking tools fall into one of two traps. They're either rigid checklists that feel like homework and get abandoned by week three, or they're free-form journaling apps that require too much decision-making each day to sustain. Mission Control splits the difference: the plan is already structured (240 missions across 24 cycles), but the gamification layer creates intrinsic pull — streaks to maintain, XP to earn, ranks to achieve, rewards to unlock, augmentations to install.

The sci-fi military theme isn't cosmetic. It reframes a six-month career transition as a campaign, which is both more motivating and more honest: careers are campaigns, with phases, objectives, milestones, and moments of reflection. The Intelligence Brief on the Command Deck doesn't just say "you have 4 missions left" — it says "Hardware stat lags 12 points behind Neural — prioritize accordingly." That reframing matters.

And because the entire plan lives in one modular `CONFIG` object, Mission Control isn't just *a* career plan — it's a *template for any structured personal development goal*. Copy the CONFIG, paste it into an AI assistant, describe your own goals, and you'll get a fully customized version back. The engine is career-agnostic.

---

## Who it's for

- Engineers or professionals planning a multi-year career transition who want structure without losing autonomy
- Self-directed learners who benefit from gamification and visible progress
- Defense or aerospace professionals exploring adjacent technical domains (AI, game dev, RF, program management)
- Anyone who wants a private, offline, no-telemetry tracker that works on mobile
- People who'd rather spend 10 minutes customizing a thoughtful template than 10 hours building their own

It is not for you if you want cloud sync, team collaboration, real-time notifications, or a social/leaderboard layer. Those features intentionally don't exist.

---

## Quick start

**On iPhone (the recommended path):**

1. Open `Mission_Control_v7.8_FINAL.html` in Safari. (Chrome and Firefox on iOS don't support PWA home screen install.)
2. Tap the Share icon, then "Add to Home Screen."
3. Launch from your home screen. It now runs full-screen like a native app.
4. When first launched, set a deployment date and create your operative (name, callsign, class).
5. On the Operative Profile, write a one-sentence **Mission Statement** — the "why" behind your plan. It will display as a gold-bordered banner at the top of your Command Deck every time you open the app.
6. Open the Mission Board. Cycle 1 is expanded by default; future cycles are collapsed.
7. Activities marked with a cyan hexagon beacon are recommended starting points. Start with those.

**On desktop:**

1. Download `Mission_Control_v7.8_FINAL.html`.
2. Double-click to open in any modern browser.
3. Follow the same setup flow.

**Your first session should include:**

- Set start date
- Create operative (name, callsign, choose a class)
- Write your mission statement
- Open the Mission Briefing panel, read it, then dismiss it
- Check off one activity to see the XP system in action
- Visit the Operative Profile to see your dossier, stats, and reward log

That's 10–15 minutes. After that, daily use is 2–5 minutes of checking off missions and (optionally) writing a short note on ones that taught you something.

---

## What's in the plan

The default plan is calibrated for a senior defense engineer exploring transitions into AI/ML, game development, staff/principal engineering, program management, creative AI, and RF/hardware engineering. Everything below can be swapped out via the CONFIG editor.

| Asset type | Count | Description |
|------------|-------|-------------|
| Missions | 240 | 10 per cycle across 24 cycles, grouped into 5 phases |
| Side quests | 120 | 20 per track — mix of credentials and portfolio projects |
| Leadership lessons | 23 | Curated books, podcasts, frameworks, certs |
| Portfolio projects | 6 | With subtasks, URLs, metrics, and crossover matrices |
| Curated resources | 97 | Courses, tools, books, communities |
| External links | 563 | 100% coverage — every activity has at least one link |
| Credential opportunities | 59 | 13 in missions, 46 in side quests |

**The five phases:**

1. **Orient & Equip** (Cycles 1–4) — Environment setup, math refreshers, first models
2. **Build Core Skills** (Cycles 5–9) — Specializations begin
3. **Specialize & Certify** (Cycles 10–14) — Deep dives and credential work
4. **Integrate & Apply** (Cycles 15–19) — Cross-track projects, job applications
5. **Launch & Expand** (Cycles 20–24) — Ship portfolio, interviews, decisions

**The six career tracks:**

| Code | Track Name | Color | Primary Stat | Activities | Stat Boost |
|------|------------|-------|--------------|------------|------------|
| AI | Neural Ops | Cyan | Neural | 176 (73%) | 1.0x |
| PS | Command Path | Gold | Credits | 122 (51%) | 1.1x |
| EE | RF & Hardware | Orange | Hardware | 86 (36%) | 1.5x |
| GE | Engine Core | Green | Vitality | 84 (35%) | 1.4x |
| CW | Creative Matrix | Magenta | Influence | 76 (32%) | shared |
| PM | Ops Management | Blue | Influence | 71 (30%) | 1.3x |

Activity counts exceed 240 because 82% of activities are cross-track (tagged with multiple track codes). The stat boost multipliers compensate for track representation imbalance so that all five stat bars grow meaningfully across the full plan.

---

## The ten views

Mission Control has ten views, accessed via the sidebar on desktop or the bottom navigation bar on mobile. Six are always in the bottom nav; the other four are sidebar-only on desktop.

| View | Bottom Nav | What it's for |
|------|------------|---------------|
| **Command Deck** | Yes | Dashboard: rank, XP, stats, streak, Mission Statement banner, Intelligence Brief, Today's Focus |
| **Mission Board** | Yes | The 24-cycle plan — expandable weeks, checkboxes, mode filters, activity notes |
| **Side Quests** | Yes | 120 optional missions filtered by track — credentials and portfolio projects |
| **Operations** | No | 6 portfolio projects with subtasks, status, URLs, crossover matrices |
| **Intel Archive** | No | 97 curated resources with search, category filters, completion status |
| **Recruit Network** | No | Job application tracker organized by track, weekly target counter |
| **Operative Profile** | Yes | Dossier, HP/MP, stats, class, Mission Statement editor, Retrospectives, Augmentation Tree, Reward Log, Portfolio Export |
| **Hall of Valor** | Yes | 18 achievements with unlock conditions |
| **Leadership Academy** | Yes | 23 development lessons across 6 categories |
| **Config Editor** | No | Full CONFIG export, edit, and live apply |

---

## The RPG layer

### Ranks (13 levels)

Recruit, Cadet, Specialist, Corporal, Sergeant, Lieutenant, Captain, Major, Colonel, Brigadier, General, Marshal, Supreme Commander.

XP required per rank follows a quadratic curve: `rank^2 * 50 + rank * 50`. Early ranks come quickly; later ranks require sustained effort. Every 5 ranks earns one augmentation point.

### Classes (6, chosen at character creation)

Each class provides bonus multipliers to specific track stat gains:

- **Neural Architect** — AI track bonus
- **Engine Forger** — Game Engine track bonus
- **Command Operative** — Staff Engineering track bonus
- **Ops Strategist** — Program Management track bonus
- **Creative Cipher** — Creative/Narrative track bonus
- **Explorer** — Small bonus to all tracks (default, balanced)

### Stats (5 primary)

Stats grow automatically when you complete activities in their linked tracks. Growth scales with base XP, class bonus, and the stat's boost multiplier.

- **Vitality** (GE) — Engine and systems resilience
- **Neural** (AI) — Machine learning and data capability
- **Credits** (PS) — Technical credibility and architecture depth
- **Influence** (PM, CW) — Leadership and creative impact
- **Hardware** (EE) — RF, FPGA, and electronics proficiency

### XP and difficulty

Activities are auto-classified by estimated hours:

| Hours | Difficulty | Base XP | Stars |
|-------|------------|---------|-------|
| 0–1 | Routine | 10 | 1 |
| 2 | Standard | 25 | 2 |
| 3 | Complex | 40 | 3 |
| 4–5 | High-Risk | 60 | 4 |
| 6+ | Critical | 100 | 5 |

Stretch missions earn 75% of base XP. Daily first-completion bonus: +25 XP. Streak multiplier: up to 2x at a 10-day streak. Every 10th activity within a track grants a +50 XP bonus.

### Streak system

The streak counter increments each day you complete at least one activity. If you miss a day, a **streak freeze** automatically protects it. You get one freeze per calendar week, auto-replenished every Sunday. Miss two days in the same week with no freeze available, and the streak resets to zero. The freeze count displays on the dashboard as "❄ 1" next to your streak.

This matters: perfect consistency isn't realistic for working adults. The freeze system acknowledges that and rewards sustained effort over performative daily engagement.

### Rewards

Every completed mission rolls for a loot reward using a variable-ratio schedule. Base 70% chance, modified by difficulty, streak length, and your Credits stat. Five tiers:

| Tier | Probability | Flavor |
|------|-------------|--------|
| Common | 40% | "Requisition: 10-min guilt-free scroll" |
| Uncommon | 30% | "Supply drop: treat yourself to a coffee" |
| Rare | 15% | "Shore leave: 1 hour of gaming" |
| Epic | 10% | "Armory unlock: buy that tool you've been eyeing" |
| Legendary | 5% | "Full extraction: weekend trip or adventure" |

Every roll is logged to the **Reward Log** on the Operative Profile, including aggregate tier counts. Enable **Quiet Mode** on the Operative Profile to suppress the full-screen popup and show a brief corner banner instead — useful when batch-checking multiple activities.

### Augmentations (6 available)

Purchasable with augmentation points (1 point per 5 ranks, so 2–3 lifetime across the plan). Each provides a passive bonus: XP boosts on hard missions, stat growth multipliers, better reward odds, HP increase, etc. Purchases require confirmation to prevent misclicks.

### XP revoke

Unchecking a completed mission cleanly reverses everything: XP, stat gains, rank changes, augmentation point refunds, achievement removals, and reward history entries. The `_gains` object stored per activity enables precise undo. This eliminates the "oops I clicked the wrong checkbox" anxiety that kills most trackers.

---

## The Narrative Layer (v7.8)

Four features added in v7.8 that shift Mission Control from a tracker to something more interesting: an instrument for building your own career story.

### Mission Statement

A one-sentence editable text field on the Operative Profile. It displays as a gold-bordered banner at the top of the Command Deck every time you open the app. Leave it blank and you'll see a gentle empty-state prompt. Fill it in and every mission check ties back to a concrete "why."

### Intelligence Brief

A dynamically generated daily briefing on the Command Deck, written in the sci-fi theme but computed from real state. Example output:

> *Cycle 7 of 24 active — 4 missions outstanding. 2 missions scheduled for Fri. Hardware stat lags 18 points behind Neural — prioritize EE work to balance. Streak secure at 5 days. 1 priority mission remains in this cycle — recommended starting point.*

The brief reports cycle progress, today's scheduled missions, stat imbalances (when the gap is at least 15 points), streak status with urgency warnings, pending augmentation points, and outstanding priority missions. When nothing needs flagging, it says "All systems nominal."

### Retrospective Rewrite

Every four cycles (after Cycle 4, 8, 12, 16, 20, 24), once the phase is at least 60% complete, the Intelligence Brief surfaces a prompt: "You've completed enough of the phase ending at Cycle 8. Write a reflection."

Clicking opens a modal with an auto-generated draft summarizing the phase: completion percentage, dominant track, credentials earned, projects shipped. Then a clear instruction:

> *[Rewrite this in your own voice — what did you actually learn? What shifted? What would you do differently?]*

You rewrite it in your own words and save. Over 24 cycles you'll accumulate up to six retrospectives. They're listed on the Operative Profile, editable at any time, and included in the Portfolio Export. These short paragraphs are dramatically more useful for performance reviews, resume updates, and LinkedIn posts than any number of completed checkboxes.

### Portfolio Export

A button on the Operative dossier opens a new tab with a clean, light-themed, print-ready one-page summary. Sections:

- Header: name, class, callsign, current rank
- Mission Statement (italicized, orange left border)
- Four KPI tiles: completion percentage, missions completed, hours logged, total XP
- Stats row
- Portfolio Projects (shipped and polished) with tech stack, URLs, outcomes
- Credentials Earned list
- Leadership Development list
- Achievements list
- All written Retrospectives

The output is self-contained HTML with inline CSS. Press Cmd/Ctrl+P to save as PDF. This turns a private tracker into something you could attach to a promotion packet, a job application, or a quarterly review.

---

## Daily-use features

Features added in v7.6 and v7.7 that make the app sustainable for months, not weeks.

### Today's Focus

A card at the bottom of the Command Deck showing up to three uncompleted missions from the current cycle. Ranking is: priority flag, then matches today's day-of-week, then non-stretch, then stretch. Each entry shows the mode icon, day, name, hours estimate, and track badges. Tagged with PRIORITY or TODAY labels to explain why it was picked. "Open Mission Board" jumps straight to the full list.

### Content-Mode Filter

A row of filter buttons at the top of the Mission Board: All, Audio, Video, App, Reading, Hands-on. Every activity is auto-classified via keyword heuristics. Select a mode and the Mission Board shows only activities that match — weeks containing no matches dim to 35% opacity.

Why this matters: your plan is the same, but your availability changes by the hour. Driving or cooking, tap Audio to see the 18 podcasts. Commuting on transit, tap App to see the 37 mobile-friendly items. Kids asleep, quiet time, tap Reading. At the lab bench, tap Hands-on. The selection persists across sessions.

Auto-classification distribution for the default plan: Reading 117, Hands-on 48, Video 37, App 20, Audio 18. You can override per-activity by adding `mode: 'audio'` to any activity in CONFIG.

### Activity notes

A small `+` button (becomes `✎` when filled) on every mission row. Tap to expand an inline textarea. Capture a quick thought: "hit issue X, fixed with Y", "this was harder than expected", "revisit in 2 weeks". Persists in state and survives mission checking/unchecking. Capped at 2,000 characters.

### Completion timestamps

Every mission check stores the completion time. Displayed inline as "· Apr 17" next to the mission name. Hover (or long-press) for full timestamp. Cleared on uncheck so revoke stays clean.

### Progressive disclosure

The Mission Board only expands Cycle 1 on first load (in addition to the current active cycle). New users don't see a wall of 240 missions. Once you dismiss the Mission Briefing panel, the Mission Board reverts to standard behavior: only the current cycle auto-expands.

### Config size guard

If you apply a modified CONFIG with more than 30 weeks, a confirmation dialog warns about potential performance issues on older devices before proceeding.

---

## Architecture

Strict separation between plan data and engine code:

```
Mission_Control_v7.8_FINAL.html   (1,855 lines, 225 KB)
|
|-- <style>        ~380 lines of inline CSS
|-- <body>         ~75 lines of structural HTML (modals, overlays, nav shell)
|-- <script>
     |
     |-- CONFIG    ~640 lines — ALL plan content lives here
     |   |-- meta, tracks, phases
     |   |-- weeks[24].activities[10 each]
     |   |-- projects[6]
     |   |-- resources[97]
     |   |-- bonusMissions[120]
     |   |-- leadershipLessons[23]
     |   |-- jobTracks[6]
     |   |-- rpg (classes, ranks, stats, augmentations, achievements, rewards)
     |   |-- views[10]
     |
     |-- ENGINE    ~1,140 lines — reads CONFIG dynamically, never hardcodes plan data
         |-- State management (localStorage, deepMerge, save/load, migration)
         |-- RPG engine (XP, ranks, stats, rewards, achievements, revoke, streak freezes)
         |-- Content-mode classifier (inferMode) with explicit override support
         |-- Render functions (dashboard, calendar, projects, resources, jobs, leadership, reward log, retrospectives)
         |-- Intelligence Brief generator (state -> thematic text)
         |-- Portfolio Export (state -> standalone print-ready HTML)
         |-- Retrospective flow (eligibility check, auto-draft, modal)
         |-- Nav, view switching, modal handling
         |-- Config editor (serialize, validate strictly, apply)
         |-- Export/import/reset
```

The CONFIG object is designed to be copied into any AI assistant with a prompt like "Modify this CONFIG for a 12-week cybersecurity track." The AI returns a new CONFIG. You paste it into the in-app editor. The engine rebuilds everything while preserving your progress.

---

## The CONFIG system — forking the plan

This is the feature that makes Mission Control a template, not just an app.

### How to fork

1. Open the **Config Editor** view.
2. Click **Copy Config**. The entire CONFIG (meta, tracks, phases, weeks, projects, resources, bonusMissions, leadershipLessons, jobTracks, rpg, views) copies to your clipboard.
3. Paste into any AI assistant: Claude, ChatGPT, Gemini, local LLM, whatever.
4. Prompt in plain English: *"Modify this CONFIG for a 12-week cybersecurity bootcamp with tracks for SOC analyst, red team, cloud security, and governance. Include relevant certifications as side quests."*
5. Copy the AI's output.
6. Paste into the Config Editor textarea.
7. Click **Apply Config**.

The validator strictly checks for all required sections (meta, tracks, phases, weeks, projects, resources, bonusMissions, jobTracks, rpg, views) and specific substructures (rpg.stats, rpg.classes, rpg.ranks). If any are missing, you get a specific error message before anything breaks.

Your progress data — completions, timestamps, notes, retrospectives, mission statement, rewards, ranks — is preserved. Only the plan structure updates.

### What AI assistants are good at modifying

- Swapping track codes and names ("Replace the Creative track with a DevOps track")
- Adding or removing activities in specific weeks
- Rewriting the 24-cycle plan for a different duration ("Compress to 12 weeks")
- Generating new side quests for a new track
- Swapping the class bonuses to fit a different career focus
- Adjusting XP difficulty curves if the default feels too easy or too hard

### What still requires manual edits

- The RPG engine itself (XP formulas, rank names, achievement unlock logic)
- The visual theme (colors, animations, layout)
- View definitions (adding a whole new tab requires code changes, but you can repurpose existing ones)

---

## Customization guide

Specific recipes for common modifications, assuming you're either editing the file directly or prompting an AI:

### Change career tracks

Edit the `tracks` array. Each track needs `code` (2-letter identifier), `name` (display), `color` (hex), `bg` (rgba). Update activities, side quests, and the RPG stats to reference the new codes.

### Change plan duration

Edit the `weeks` array — add or remove week objects. Update the `phases` array to reflect new week ranges. The engine handles any number of weeks, but the dashboard layout works best at 12–32 cycles.

### Add or modify activities

Each week has an `activities` array. Each activity needs:
- `day` — string, e.g., 'Mon', 'Tue', 'Sat', or 'Mon-Tue' for multi-day
- `name` — string
- `links` — array of `{t: 'label', u: 'url'}` objects (can be empty)
- `hrs` — number (determines difficulty and XP)
- `tracks` — array of track codes
- `stretch` — boolean (true = optional, 75% XP)
- Optional: `priority: true` (shows cyan beacon), `isCredential: true` (counts toward Creds stat), `mode: 'audio'` (override auto-classification)

### Add side quests

Append to `bonusMissions`. Each needs: `id`, `track`, `title`, `desc`, `xp`, `cost`, `url`, `isCredential`.

### Add leadership lessons

Append to `leadershipLessons`. Each needs: `id`, `title`, `desc`, `url`, `cat` (Reading/Course/Podcast/Video/Framework/Cert), `xp`. Optional: `cost`.

### Change the reward pool

Edit `rpg.defaultRewards`. Each tier (Common, Uncommon, Rare, Epic, Legendary) is an array of strings. The thematic voice matters — keep it in-universe for the best experience.

### Mark activities as priority

Add `priority: true` to any activity object. Renders with a cyan hexagon beacon and subtle row highlight. The Today's Focus widget prioritizes these.

### Tune the streak system

Edit the streak freeze replenishment in `recomputeStreak()`. Default: 1 freeze per calendar week (Sunday-start). Change to `available: 2` for a gentler experience, or `0` for a stricter one.

### Change the theme

Edit the CSS variables in `:root`. `--accent` drives the primary cyan, `--success` the green, etc. Font stacks use system fonts only — changing fonts is a variable swap.

---

## Data and privacy

- All data stored in `localStorage` under the key `missionControlRPG_v3`
- Zero network requests — the app never phones home
- No analytics, no tracking, no cookies, no telemetry, no IDs
- Export your data as JSON via the Export button (sidebar or mobile toolbar)
- Import previously exported JSON to restore or transfer between devices
- Reset purges all data from localStorage (requires confirmation)

Your mission statement, retrospectives, notes, and progress are completely yours. Nobody else can see them unless you physically share the file or an export.

---

## Technical constraints

These are enforced across every version and will never be violated:

- Single-file HTML — everything in one `.html` file
- Vanilla JavaScript only — no frameworks, no libraries, no build tools
- Inline CSS only — no external stylesheets
- Zero external dependencies — no CDN, no Font Awesome, no Google Fonts
- System fonts and Unicode symbols only
- No `Function()` constructor — achievement conditions use a safe regex-based `evalCondition()`
- Must work offline by double-clicking the file
- `localStorage` access wrapped in `try/catch`
- iPhone-first (Safari PWA with home screen install)
- Respects `prefers-reduced-motion` media query
- Mobile touch targets meet 28–44px minimum

---

## Accessibility

v7.4 onward includes:

- Semantic HTML landmarks: `<nav>`, `<main>` with `aria-label` attributes
- `role="tablist"` and `role="tab"` with `aria-selected` on navigation items
- `role="checkbox"` and `aria-checked` on all activity checkboxes
- `role="alertdialog"` and `aria-live="assertive"` on reward and rank-up popups
- `role="status"` and `aria-live="polite"` on the save confirmation toast and reward banner
- `tabindex="0"` on all interactive non-button elements (nav items, filter buttons, week headers, augmentation cards)
- `onkeydown` handlers for Enter/Space activation on keyboard-focusable elements
- `:focus-visible` outlines on 10+ interactive element types
- `aria-label` on toolbar buttons (export, import, reset)
- Minimum font size of 0.5rem
- `prefers-reduced-motion` disables pulse and beacon animations

### Known accessibility gaps

- Not all dynamically rendered buttons (e.g., "Complete All", subtask toggles) have explicit ARIA roles
- The Config Editor textarea lacks a programmatic label
- Color contrast on some low-opacity text (e.g., `var(--tx-3)` at `#607898` on `#0c0c1a`) may not meet WCAG AAA for small text
- The activity row uses a 7-column grid that can be cramped on very narrow screens (below 360px)

---

## Known limitations

- **No cloud sync.** Data lives in localStorage on the specific browser on the specific device. Use Export/Import to transfer between devices.
- **No multi-device sync.** Intentional privacy trade-off.
- **Safari-only PWA on iOS.** Chrome and Firefox on iOS don't support PWA home screen install. Android browsers handle PWAs differently and may work but aren't the primary target.
- **Links don't work in Claude preview.** Open the file in Safari (or any standard browser) for clickable links.
- **Large custom CONFIGs (30+ weeks) may slow older devices.** The app warns before applying oversized configurations.
- **No undo on side quest or leadership completions.** Only main mission checkboxes support XP revoke. Side quests and leadership lessons are intentionally one-way to reduce state complexity.
- **localStorage size limits.** Browsers typically allow 5–10 MB. Default save data is under 100 KB; text fields are capped (notes 2,000 chars, mission statement 500, retrospectives 5,000).
- **Rapid mission checks overlap the reward popup.** Only the latest reward popup is visible, but all rewards are still logged to the reward history. Use Quiet Mode to avoid popup fatigue when batch-checking.
- **Today's Focus depends on the current cycle.** If you're ahead of schedule and complete the full current cycle, it shows a completion message rather than pulling from the next cycle.

---

## Build history

Mission Control was built iteratively using a two-workflow system: **Claude (Anthropic) builds, SuperGrok Heavy (xAI) audits**. Feedback from audits informed each subsequent cycle.

| Version | Cycle | Focus |
|---------|-------|-------|
| v5.0 | — | Initial prototype: 16 weeks, basic RPG, limited content |
| v6.0 | — | Expanded to 24 cycles, added EE/RF track, side quests, full RPG layer |
| v7.0 | C1 | Full rebuild: 240 activities, 120 quests, XP revoke, cross-cutting phases |
| v7.1 | C2 | Polish: filled 20 missing links (99% coverage), Safari notices, restored resources |
| v7.3 | C3 | Quick-start briefing panel, priority markers, progressive disclosure |
| v7.3-C4 | C4 | Accessibility overhaul, XP stat rebalancing, 100% link coverage |
| v7.4 | C5 | Auto-collapse for new users, aria-live on popups, themed rewards, config guard |
| v7.5 | Post | Leadership Academy tab (23 lessons), expanded reward pool |
| v7.6 | Bugs | Stale streak fix, streak freeze tokens, stricter config validator, augmentation confirm, reward log, quiet mode |
| v7.7 | Daily | Completion timestamps, activity-level notes, Today's Focus widget, content-mode filter system |
| v7.8 | Narrative | Mission Statement, Intelligence Brief, Retrospective Rewrite, Portfolio Export — plus XSS hardening and input length caps |

Built with Claude Opus 4.6 through v7.6, then Claude Opus 4.7 from v7.7 onward. The transition showed up in the audit pass between v7.6 and v7.7: the newer model proactively found bugs that the older versions had missed (stale streak, loose config validator, reward fatigue, invisible reward history) and proposed the feature set that became v7.8 (mission statement, intelligence brief, retrospectives, portfolio export).

---

## License

Provided as-is for personal use. The plan content (activity descriptions, resource links, curriculum structure) reflects one specific career context — customize via the CONFIG system for your own goals. External resources linked within the app are owned by their respective creators and are subject to their own terms.

---

*Built with Claude. Audited with SuperGrok Heavy. Designed for one user, structured for anyone.*
