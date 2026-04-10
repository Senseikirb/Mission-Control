# Mission Control — Sci-Fi RPG Career Development Dashboard

**Version 7.5 | Single-File HTML | Zero Dependencies | Works Offline**

Mission Control is a gamified career development tracker disguised as a sci-fi military RPG. It turns a structured, multi-domain career transition plan into an immersive operative experience — complete with ranks, XP, stat growth, loot crates, achievements, and augmentation trees.

The entire application is a single HTML file (198 KB). No build tools, no frameworks, no CDN, no server. Download it, double-click it, and it runs. Add it to your iPhone home screen and it works as a full-screen PWA.

---

## Table of Contents

1. [What This Is](#what-this-is)
2. [Who This Is For](#who-this-is-for)
3. [Quick Start](#quick-start)
4. [Features at a Glance](#features-at-a-glance)
5. [Architecture](#architecture)
6. [The Six Career Tracks](#the-six-career-tracks)
7. [Views and Navigation](#views-and-navigation)
8. [RPG System](#rpg-system)
9. [The CONFIG System](#the-config-system)
10. [Data and Privacy](#data-and-privacy)
11. [Customization Guide](#customization-guide)
12. [Technical Constraints](#technical-constraints)
13. [Accessibility](#accessibility)
14. [Known Limitations](#known-limitations)
15. [Build History](#build-history)
16. [License](#license)

---

## What This Is

Mission Control is a 24-cycle (week) structured career development plan with 240 missions, 120 side quests, 23 leadership lessons, 97 curated resources, 6 portfolio projects, and 563 linked external resources — all wrapped in an RPG progression system that makes sustained effort feel rewarding.

It was built for a specific use case — a senior defense engineer exploring transitions into AI/ML, game development, staff/principal engineering, program management, creative AI, and RF/hardware engineering — but the modular CONFIG architecture means anyone can fork it and rebuild the entire plan for their own career goals using any AI assistant.

## Who This Is For

- Engineers considering career transitions who want structure without rigidity
- Self-directed learners who benefit from gamification and visible progress
- Defense/aerospace professionals exploring adjacent technical domains
- Anyone who wants a private, offline, zero-dependency career tracker that works on mobile

## Quick Start

**Desktop:**
1. Download `index.html`
2. Double-click to open in any browser
3. Set your start date when prompted
4. Create your operative (name, callsign, class)
5. Open Cycle 1 on the Mission Board and start with activities marked with the priority beacon

**iPhone (recommended):**
1. Open the file in Safari (not Chrome — PWA features require Safari on iOS)
2. Tap Share, then "Add to Home Screen"
3. Launch from your home screen for a full-screen, app-like experience
4. All data persists in localStorage between sessions

**First session guidance:**
- The Mission Briefing panel at the top of the Mission Board explains the structure
- Activities marked with a cyan hexagon beacon are recommended starting points
- STRETCH missions are optional — skip them when time is tight
- Check boxes to earn XP, level up, and unlock rewards
- The Leadership Academy tab is a low-pressure breather between intensive cycles

---

## Features at a Glance

**Content**
- 240 missions across 24 cycles, organized into 5 phases
- 120 side quests (20 per track, balanced between credentials and portfolio projects)
- 23 leadership development lessons across 6 categories
- 97 curated resources (courses, tools, books, communities)
- 6 portfolio projects with subtask tracking, URLs, and crossover matrices
- 563 total external resource links (100% coverage — every activity has at least one link)
- 59 credential opportunities (13 in missions, 46 in side quests)

**RPG System**
- 13 ranks from Recruit to Supreme Commander
- 6 operative classes with unique stat bonuses
- 5 primary stats (Vitality, Neural, Credits, Influence, Hardware) with track-linked growth
- 6 augmentations purchasable with augmentation points (earned every 5 ranks)
- 18 achievements across missions, streaks, ranks, credentials, and shipped projects
- 5 reward tiers (Common through Legendary) with variable-ratio loot drops
- XP revoke on uncheck — cleanly reverses XP, stats, rank, and achievements
- Streak system with daily bonus and multiplier (up to 2x)
- Stat boost multipliers to balance underrepresented tracks

**Application**
- Single-file HTML, vanilla JavaScript, inline CSS — zero external dependencies
- Works 100% offline by double-clicking the file
- iPhone-first PWA with full-screen home screen mode
- Export/import save data as JSON
- In-app Config Editor for AI-assisted plan modification
- Dark sci-fi aesthetic with scanlines, star particles, and micro-animations
- Respects prefers-reduced-motion for users who need it
- localStorage with try/catch fallbacks
- Progressive disclosure: auto-collapses future cycles for new users

---

## Architecture

The application follows a strict separation between plan data and engine code:

```
Mission_Control.html
|
|-- <style>        ~340 lines of inline CSS
|-- <body>         ~60 lines of structural HTML (modals, overlays, nav shell)
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
     |-- ENGINE    ~890 lines — reads CONFIG dynamically, never hardcodes plan data
         |-- State management (localStorage, deepMerge, save/load)
         |-- RPG engine (XP, ranks, stats, rewards, achievements, revoke)
         |-- Render functions (dashboard, calendar, projects, resources, jobs, etc.)
         |-- Nav and view switching
         |-- Config editor (serialize, apply, validate)
         |-- Export/import/reset
```

The CONFIG object is designed to be copied into any AI assistant with a prompt like "Modify this CONFIG for a 12-week cybersecurity track" — the AI returns a new CONFIG, you paste it into the in-app editor, and the engine rebuilds everything. Your progress data is preserved.

---

## The Six Career Tracks

Each track has a code, a sci-fi name, a color, and dedicated side quests, resources, and stat linkages:

| Code | Track Name        | Color   | Primary Stat | Activities | Stat Boost |
|------|-------------------|---------|-------------|------------|------------|
| AI   | Neural Ops        | Cyan    | Neural      | 176 (73%)  | 1.0x       |
| PS   | Command Path      | Gold    | Credits     | 122 (51%)  | 1.1x       |
| EE   | RF & Hardware     | Orange  | Hardware    | 86 (36%)   | 1.5x       |
| GE   | Engine Core       | Green   | Vitality    | 84 (35%)   | 1.4x       |
| CW   | Creative Matrix   | Magenta | Influence   | 76 (32%)   | shared     |
| PM   | Ops Management    | Blue    | Influence   | 71 (30%)   | 1.3x       |

Activity counts exceed 240 total because 82% of activities are cross-track (tagged with multiple track codes). The stat boost multipliers compensate for track representation imbalance so that all five stat bars grow meaningfully across the full plan.

---

## Views and Navigation

Mission Control has 10 views, accessible via the sidebar (desktop) or bottom navigation bar (mobile):

| View               | Bottom Nav | Purpose |
|--------------------|-----------|---------|
| Command Deck       | Yes       | Dashboard: overall progress ring, phase bars, XP, rank, stats, streak |
| Mission Board      | Yes       | The 24-cycle plan with expandable weeks, checkboxes, links, hours tracking |
| Side Quests        | Yes       | 120 bonus missions filtered by track — credentials and portfolio projects |
| Operations         | No        | 6 portfolio projects with subtasks, status, URLs, crossover matrices |
| Intel Archive      | No        | 97 curated resources with search, category filters, and completion status |
| Recruitment Network| No        | Job application tracker organized by track with weekly target counter |
| Operative Profile  | Yes       | RPG character sheet: dossier, HP/MP, stats, class, augmentation tree |
| Hall of Valor      | Yes       | 18 achievements with unlock conditions |
| Leadership Academy | Yes       | 23 leadership development lessons with category filters and completion |
| Config Editor      | No        | Full CONFIG export, editing, and live application |

On mobile (screen width under 768px), the sidebar is replaced by a bottom navigation bar showing the 6 views marked `showBottom: true`. The remaining views are accessible via the bottom nav's tab system.

---

## RPG System

### Ranks (13 levels)

Recruit, Cadet, Specialist, Corporal, Sergeant, Lieutenant, Captain, Major, Colonel, Brigadier, General, Marshal, Supreme Commander.

XP required per rank follows a quadratic curve: `rank^2 * 50 + rank * 50`. Early ranks come quickly; later ranks require sustained effort.

### Classes (6 options, chosen at character creation)

Each class provides bonus multipliers to specific track stat gains:

- **Neural Architect** — AI track bonus
- **Engine Forger** — Game Engine track bonus
- **Command Operative** — Staff Engineering track bonus
- **Ops Strategist** — Program Management track bonus
- **Creative Cipher** — Creative/Narrative track bonus
- **Explorer** — Balanced small bonus to all tracks (default)

### Stats (5 primary)

Stats grow automatically when you complete activities in their linked tracks. Growth is modified by your class bonus and the stat's boost multiplier.

- **Vitality** (GE) — Engine and systems resilience
- **Neural** (AI) — Machine learning and data capability
- **Credits** (PS) — Technical credibility and architecture depth
- **Influence** (PM, CW) — Leadership and creative impact
- **Hardware** (EE) — RF, FPGA, and electronics proficiency

### XP and Difficulty

Activities are auto-classified by estimated hours:

| Hours  | Difficulty | Base XP | Stars |
|--------|-----------|---------|-------|
| 0-1    | Routine   | 10      | 1     |
| 2      | Standard  | 25      | 2     |
| 3      | Complex   | 40      | 3     |
| 4-5    | High-Risk | 60      | 4     |
| 6+     | Critical  | 100     | 5     |

Stretch missions earn 75% of base XP. Daily first-completion bonus: +25 XP. Streak multiplier: up to 2x at 10+ day streak.

### Rewards

Every completed mission rolls for a loot reward using a variable-ratio schedule (70% base chance, modified by difficulty, streak, and Credits stat). Five tiers: Common (40%), Uncommon (30%), Rare (15%), Epic (10%), Legendary (5%). Rewards are thematic — "Shore leave: 1 hour of gaming", "Black budget: one impulse buy under $15", "Full extraction: weekend trip."

### XP Revoke

Unchecking a completed mission cleanly reverses all gains: XP, stat growth, rank changes, augmentation point refunds, achievement removals, and reward history. The `_gains` object stored per activity enables precise undo without recalculating from scratch.

### Augmentations (6 available)

Purchasable with augmentation points (1 point per 5 ranks). Each provides a passive bonus: XP boosts, stat growth multipliers, better reward odds, HP increase, and more.

---

## The CONFIG System

The CONFIG object at the top of the script is the single source of truth for all plan content. It contains:

- `meta` — title, subtitle, version, labels
- `tracks` — the 6 career tracks with codes, names, colors
- `phases` — the 5 plan phases with week ranges and colors
- `weeks` — 24 cycles, each with 10 activities containing day, name, links, hours, tracks, stretch flag, and optional priority/credential flags
- `projects` — 6 portfolio projects with descriptions, tech stacks, metrics, subtasks, and crossover matrices
- `resources` — 97 curated external resources with names, URLs, categories, and costs
- `bonusMissions` — 120 side quests with track assignments, XP values, costs, URLs, and credential flags
- `leadershipLessons` — 23 leadership development items with categories, XP, and URLs
- `jobTracks` — 6 recruitment categories with default company targets
- `rpg` — complete RPG configuration (classes, ranks, stats, augmentations, achievements, difficulty mappings, reward tiers, reward pool)
- `views` — 10 navigation views with labels, icons, and bottom-nav visibility

### Modifying the CONFIG

1. Open the Config Editor view in the app
2. Click "Copy Config" to copy the entire CONFIG to your clipboard
3. Paste it into any AI assistant (Claude, ChatGPT, Gemini, etc.)
4. Prompt: "Modify this CONFIG for a [your goal here]"
5. Copy the AI's output
6. Paste it back into the Config Editor
7. Click "Apply Config"

Your progress data is preserved — only the plan structure updates. The engine dynamically rebuilds all views from the new CONFIG.

---

## Data and Privacy

- All data is stored in `localStorage` under the key `missionControlRPG_v3`
- No data is ever transmitted anywhere — the app makes zero network requests
- No analytics, no tracking, no cookies, no telemetry
- Export your data as JSON at any time via the Export button
- Import previously exported JSON to restore or transfer data
- Reset purges all data from localStorage (requires confirmation)

---

## Customization Guide

### Change career tracks

Edit the `tracks` array in CONFIG. Each track needs a `code`, `name`, `color`, and `bg`. Then update activities, side quests, and stats to reference the new track codes.

### Change the plan duration

Edit the `weeks` array. Add or remove week objects. Update the `phases` array to reflect new week ranges. The engine handles any number of weeks.

### Add activities to a week

Each week has an `activities` array of 10 items. Add more or change existing ones. Each activity needs: `day`, `name`, `links` (array of `{t, u}` objects), `hrs`, `tracks` (array of track codes), and `stretch` (boolean).

### Add side quests

Append to the `bonusMissions` array. Each quest needs: `id`, `track`, `title`, `desc`, `xp`, `cost`, `url`, and `isCredential`.

### Add leadership lessons

Append to the `leadershipLessons` array. Each lesson needs: `id`, `title`, `desc`, `url`, `cat` (Reading/Course/Podcast/Video/Framework/Cert), and `xp`. Optional: `cost`.

### Change the RPG system

Edit `rpg` within CONFIG: modify ranks, classes, stat definitions, achievements, augmentations, difficulty XP values, reward tiers, or the reward text pool.

### Mark activities as priority

Add `priority: true` to any activity object. It will render with a cyan hexagon beacon and subtle row highlight on the Mission Board.

---

## Technical Constraints

These constraints are enforced across all versions and must never be violated:

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
- All interactive elements have minimum 44px touch targets on mobile

---

## Accessibility

v7.4+ includes the following accessibility features:

- Semantic HTML landmarks: `<nav>`, `<main>` with `aria-label` attributes
- `role="tablist"` and `role="tab"` with `aria-selected` on navigation items
- `role="checkbox"` and `aria-checked` on all activity checkboxes
- `role="alertdialog"` and `aria-live="assertive"` on reward and rank-up popups
- `role="status"` and `aria-live="polite"` on the save confirmation toast
- `tabindex="0"` on all interactive non-button elements (nav items, filter buttons, week headers, augmentation cards)
- `onkeydown` handlers for Enter/Space activation on keyboard-focusable elements
- `:focus-visible` outlines on 10+ interactive element types
- `aria-label` on toolbar buttons (export, import, reset)
- Minimum font size of 0.5rem (bumped from 0.45rem in v7.4)
- `prefers-reduced-motion` disables pulse animations

### Known accessibility gaps

- Not all dynamically rendered buttons (e.g., "Complete All", subtask toggles) have explicit ARIA roles
- The Config Editor textarea lacks a programmatic label
- Color contrast on some low-opacity text (e.g., `var(--tx-3)` at `#607898` on `#0c0c1a`) may not meet WCAG AAA for small text

---

## Known Limitations

- **No cloud sync.** Data lives in localStorage on the device/browser where you use it. Use Export/Import to transfer between devices.
- **No multi-device sync.** This is an intentional privacy trade-off.
- **Safari-only PWA on iOS.** Chrome and Firefox on iOS do not support PWA home screen install.
- **Links do not work in Claude preview.** Open the file in Safari (or any standard browser) for clickable links.
- **Large custom CONFIGs (30+ weeks) may slow older devices.** The app warns before applying oversized configurations.
- **No undo on side quest or leadership completions.** Only main mission checkboxes support XP revoke.
- **localStorage size limits.** Browsers typically allow 5-10 MB. The default save data is well under 100 KB, but heavy use of notes fields could approach limits on very old devices.

---

## Build History

Mission Control was built iteratively through 5 improvement cycles using a two-workflow system: Claude (Anthropic) builds, SuperGrok Heavy (xAI) audits.

| Version | Cycle | Focus |
|---------|-------|-------|
| v5.0    | --    | Initial prototype with 16 weeks, basic RPG, limited content |
| v6.0    | --    | Expanded to 24 cycles, added EE/RF track, side quests, full RPG layer |
| v7.0    | C1    | Full rebuild: 240 activities, 120 quests, XP revoke, cross-cutting phases |
| v7.1    | C2    | Polish: filled 20 missing links (99% coverage), Safari notices, restored resources |
| v7.3    | C3    | Quick-start briefing panel, priority markers, progressive disclosure |
| v7.3-C4 | C4   | Accessibility overhaul, XP stat rebalancing, 100% link coverage |
| v7.4    | C5    | Auto-collapse for new users, aria-live on popups, themed rewards, config guard |
| v7.5    | Post  | Leadership Academy tab (23 lessons), expanded reward pool, Grok feedback integration |

---

## License

This project is provided as-is for personal use. The plan content (activity descriptions, resource links, curriculum structure) reflects a specific career context and should be customized for your own goals. External resources linked within the app are owned by their respective creators and subject to their own terms.

---

*Built with Claude (Anthropic). Audited with SuperGrok Heavy (xAI). Designed for one user, structured for anyone.*
