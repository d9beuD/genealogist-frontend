# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Shape

- Single Vue 3.5 + Vite frontend app; use `pnpm`, not `npm`, for installs and scripts. `package.json` declares Node `>=26.0.0` and `pnpm@11.1.2`.
- Main wiring is in `src/main.ts`: Pinia, vue-i18n, feature message registration, TanStack Vue Query, and Vue Router are installed there.
- Route auth is centralized in `src/router/index.ts`; protected routes use `meta.requiresAuth`, guest-only routes use `meta.guestOnly`, and the guard resolves the initial session through `useAuthStore(pinia)` before routing.

## Commands

- Install: `pnpm install` or CI-equivalent `pnpm install --frozen-lockfile`.
- Dev server: `pnpm dev`.
- Production build: `pnpm build` runs `vue-tsc --build` and `vite build` through `run-p`.
- Type check only: `pnpm type-check`.
- Unit tests watch by default: `pnpm test:unit`; one-off or CI style: `pnpm test:unit --run`; focused file: `pnpm test:unit --run src/__tests__/App.spec.ts`.
- E2E tests: first run `pnpm exec playwright install`; local full suite is `pnpm test:e2e`; focused Chromium run: `pnpm test:e2e e2e/vue.spec.ts --project chromium`; CI only runs Chromium with `pnpm test:e2e --project=chromium` after `pnpm build`.
- Lint script mutates files: `pnpm lint` runs `oxlint . --fix` then `eslint . --fix --cache`. For CI-style checks without fixes, use `pnpm exec oxlint .` and `pnpm exec eslint . --cache --cache-location .eslintcache`.
- Format only covers `src/`: `pnpm format` runs `oxfmt src/`.

## App Architecture (feature-scoped)

- The app is organized by feature under `src/features/<name>/`. Current features: `auth`, `login`, `registration`, `tree`. Cross-cutting infrastructure lives at `src/` top level: `api/` (HTTP wrapper), `query/` (TanStack defaults), `router/`, `stores/`, `i18n/`, `components/ui/` (shadcn-vue primitives), `lib/`, `interfaces/`, `views/` (route-level shells not owned by a single feature).
- A feature folder uses a flat, predictable layout — only the subfolders it needs:
  - `api/` — one file per backend call (e.g. `login/api/authenticateUser.ts`, `auth/api/getCurrentUser.ts`). Each call uses the shared `backend` client from `src/api/`.
  - `schemas/` — zod schemas for forms and payloads (e.g. `login/schemas/loginSchema.ts`).
  - `components/` — feature-local Vue components (e.g. `LoginForm.vue`). Generic primitives stay in `src/components/ui/`.
  - `views/` — route-level pages mounted by the router (e.g. `LoginView.vue`).
  - `i18n/` — a single `<feature>Messages.ts` exporting the feature's locale bundle.
- Feature i18n is registered centrally in `src/features/registerFeatures.ts`, which calls `registerFeatureMessages(namespace, messages)` for each feature. `src/main.ts` invokes `registerFeatures()` during boot — add new feature messages there, not inline in `main.ts`.
- `auth` is the cross-feature seam: it owns session state via `useAuthStore` and the `getCurrentUser`/`logoutUser` calls. The router guard in `src/router/index.ts` consults it before navigating, and the query layer silences 401s so forced logouts stay quiet.
- When adding a feature: create `src/features/<name>/` with only the subfolders you need, expose its messages via `<name>/i18n/<name>Messages.ts`, register them in `registerFeatures.ts`, and wire any routes through `src/router/index.ts` with the appropriate `meta.requiresAuth` / `meta.guestOnly`.

## Env And API

- Vite validates `VITE_*` env in `vite.config.ts` using `src/env.schema.ts`; `VITE_BACKEND_BASE_URL` must be a URL and defaults to `http://localhost:8000/api`.
- API calls should go through `src/api/index.ts` `backend`, which sets `credentials: 'include'` and JSON-LD headers (`Content-Type` and `Accept` as `application/ld+json`) and normalizes errors via `toAppError`.
- TanStack Query defaults live in `src/query/index.ts`: `refetchOnWindowFocus: false`, `retry: 1`, `staleTime: 30_000`; global mutation/query errors toast unless a mutation provides its own `onError` or a query has no prior data. 401 responses are intentionally silent so forced logout stays quiet.

## UI And Paths

- `@/*` aliases to `src/*` in both Vite and tsconfig; prefer `@/` imports over deep relative imports outside the same folder.
- shadcn-vue is configured in `components.json` with `new-york`, Tailwind CSS file `src/style.css`, base color `taupe`, Lucide icons, and aliases like `@/components/ui`, `@/lib`, and `@/composables`.
- `opencode.json` enables the shadcn-vue MCP via `npx shadcn-vue@latest mcp`; use the shadcn-vue tools for registry components instead of guessing generated files.
- `src/components/ui/**` contains shadcn-vue primitives; avoid hand-editing generated primitives unless the change is intentionally local to this project.

## i18n

- Supported locales are exactly `en` and `fr` in `src/i18n/index.ts`; default is `en`, persisted under `genealogist.locale`.
- Base messages/formats live under `src/i18n/locales/*.json` and `src/i18n/formats/*.json`; feature messages live beside features and are registered in `src/main.ts` through `registerFeatureMessages(namespace, messages)`.

## Testing Notes

- Vitest uses `jsdom` and excludes `e2e/**`; test globals are not enabled, so import `describe`, `it`, and `expect` from `vitest`.
- Playwright local base URL is `http://localhost:5173`; CI base URL is `http://localhost:4173`. The Playwright `webServer` command currently invokes `npm run dev` locally and `npm run preview` in CI even though the repo otherwise uses pnpm.
