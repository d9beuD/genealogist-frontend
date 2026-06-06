# AGENTS.md

## Repo Shape
- This repository now contains the frontend app only, still nested under `frontend/`; run app commands from `frontend/`.
- Root `.github/`, release automation, and this file are repository-level concerns; frontend app details live in `frontend/AGENTS.md`.

## Frontend Commands
- Use `pnpm`, not npm/yarn. `frontend/package.json` requires Node `>=26.0.0` and declares `packageManager: pnpm@11.1.2`; CI currently installs pnpm 10.
- From `frontend/`: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview`.
- `pnpm build` runs `vue-tsc --build` and `vite build` in parallel via `run-p`; CI runs `pnpm type-check`, `pnpm exec oxlint .`, `pnpm exec eslint . --cache --cache-location .eslintcache`, then `pnpm test:unit --run`.
- Unit tests: `pnpm test:unit`; focused non-watch run: `pnpm test:unit --run src/__tests__/App.spec.ts`.
- E2E tests: `pnpm test:e2e`; first run needs `pnpm exec playwright install`. Focus one file/browser with `pnpm test:e2e e2e/vue.spec.ts --project chromium`.
- `pnpm lint` fixes files because both oxlint and eslint scripts use `--fix`; use it only when edits are acceptable. `pnpm format` runs `oxfmt src/`.
- The local `rtk` command wrapper may summarize standard command output to save tokens; treat its compact output as the expected result of the underlying command, not as a different command being run.

## Frontend Tooling Notes
- Vite validates `VITE_*` env at config load through `src/env.schema.ts`; `VITE_BACKEND_BASE_URL` defaults to `http://localhost:8000/api` and must be a URL if overridden.
- Vite aliases `@` to `frontend/src`.
- Vitest uses `jsdom` and excludes `e2e/**`.
- Playwright starts `npm run dev` locally on port `5173` and `npm run preview` in CI on port `4173`, even though the repo docs prefer pnpm.
- shadcn-vue is configured by `frontend/components.json` with `new-york` style, taupe base color, lucide icons, and aliases under `@/components`, `@/lib`, and `@/composables`.
- Frontend API calls go through `src/api/index.ts` with `credentials: 'include'` and JSON-LD headers. Router auth guards refresh the session before protected routes; feature i18n messages are registered in `src/main.ts`.

## Release Notes
- Root release automation uses `release-please` on `main` with simple versioning and conventional commit sections from `release-please-config.json`.
