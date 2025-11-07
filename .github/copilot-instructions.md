## Purpose
Help AI coding agents become productive quickly in the CurateScroll codebase.

Keep suggestions concrete and local to this repo — reference files, patterns, and scripts below.

---

## Quick dev commands (use these first)
- Run the app (Expo): `npm run start` (or `npm run ios` / `npm run android` / `npm run web`).
- Install deps: `npm ci` (uses package-lock.json). Type-check: `npx tsc --noEmit`.

## Mandatory startup reads (DO THIS on every prompt)
- Before doing any work, always open and read the following files in this repo to pick up context that may have changed since the previous run:
	- `.github/common.md` — the project's extended planning & conventions (long-form guidance).
	- `README.MD` — the user-facing quick start and setup notes.
- Note: these files are updated by humans and may contain the latest design decisions, run commands, or caveats. If you make any code or doc changes, append a changelog entry to `.github/copilot-changelog.md` (see Changelog section below).

## Project overview (big picture)
- Expo + React Native TypeScript app (root `App.tsx`, `index.ts`).
- UI uses `react-native-paper` and assets live in `assets/`.
- Feature structure: `src/components/` (shared + feature subfolders), `src/screens/` (screen-level views), `src/navigation/` (app navigator), `src/services/` (external API wrappers / aggregator / cache), `src/stores/` (Zustand stores for app state), `src/config/` (firebase, theme, constants).

## Key integration points and data flow
- External data is expected to come through `src/services/*` (e.g. `youtube.service.ts`, `aggregator.service.ts`). These services are the single source for network calls — keep API keys and env config in `.env` (`.env.example` shows keys).
- Services write/read cached responses via `cache.service.ts` and push normalized data into domain stores (e.g. `feedStore.ts`, `subscriptionStore.ts`) implemented with `zustand` in `src/stores/`.
- UI consumes stores directly in screens/components (look under `src/screens/` and `src/components/feed/` for examples).

## File & naming conventions (follow these exactly)
- Components: colocate small reusable UI in `src/components/common/` and feature-specific UI in `src/components/<feature>/`.
- Stores: one store per domain file, named `<domain>Store.ts` under `src/stores/`.
- Services: one responsibility per file under `src/services/`. Aggregation/composition should live in `aggregator.service.ts`.
- Config: static values and secrets go in `src/config/` (firebase keys must come from env vars, not checked-in files).

## Patterns and examples (concrete)
- Use `react-native-paper` Provider at app root (see `App.tsx`).
- Screens are intended to be registered in `src/navigation/AppNavigator.tsx` (file exists but is currently an empty scaffold — when adding routes, prefer stack/bottom-tab subfolders if needed).
- Look at `src/components/common/Button.tsx` and `Card.tsx` to follow project styling and props patterns when creating new components.

## What to avoid / assumptions to check
- Many `src/services/*` and `src/stores/*` files are scaffolds — do not assume implemented behavior. If a service/store is empty, create small focused tests or stubs before large refactors.
- Do not commit secrets: use `.env` and follow `.env.example` keys (Expo expects `EXPO_PUBLIC_` prefix for public env vars).

## When proposing code changes
- Keep edits scoped: add/modify a single feature folder or service per PR.
- Reference exact files you change in commit messages and in the PR description.
- If adding new external API usage, update `.env.example` and add a short note in `README.MD`.

## Developer workflows specific to this repo
- No tests are present currently — PRs should include a minimal smoke validation (e.g., small component snapshot or tsc check) where practical.
- Build / run expectations: the app runs via Expo (`expo` is pinned in `package.json`). Use the project's `npm` scripts.

## Helpful files to inspect before coding
- `App.tsx` — app root and providers
- `index.ts` — app entry
- `src/components/common/*` — common UI building blocks
- `src/services/*` — API/service boundaries (youtube, aggregator, cache)
- `src/stores/*` — zustand stores and domain state
- `.env.example` — required environment variables and keys
- `package.json` — scripts and dependency list (Expo SDK & react-native-paper are used)

## Changelog requirement (append on each prompt/change)
- File: `.github/copilot-changelog.md`
- Every time you (the AI agent) make a change to files in the repo or produce a substantive suggestion that will be applied, append a short changelog entry to `.github/copilot-changelog.md` describing:
	1. Timestamp (ISO 8601)
	2. Agent name / author (e.g. Copilot)
	3. Summary of change (1 line)
	4. Files changed (list)
	5. Why the change was made (1–2 lines)
	6. What the repository looked like previously (1 line)

Example entry (append, newest on top):

```text
2025-11-06T14:30:00Z — Copilot
- Summary: Add initial copilot instructions for repo context and quick commands
- Files changed: .github/copilot-instructions.md
- Why: Provide AI agents with repo-specific conventions and quick start commands
- Prev: No copilot instructions file present
```

- Keep entries concise. If a change is experimental, mark it `WIP` in the summary. If you cannot write to the changelog (CI or permission issue), at least print the entry in your response so a human can paste it.

---
If anything above is unclear or you'd like the file to include additional policies (commit message format, CI checks, or required linters), tell me which area to expand and I will iterate.
