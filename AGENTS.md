# AGENTS.md

## App Shape
- This repository is the standalone Vue/Vite frontend; run app commands from the repository root.
- Entrypoints are `src/main.ts`, `src/App.vue`, and `src/router/index.ts`; routes use lazy imports and auth meta (`requiresAuth`, `guestOnly`) guarded by `useAuthStore().refreshSession()`.
- App plugins are wired in `src/main.ts`: Pinia, vue-i18n, TanStack Vue Query, router, and feature i18n message registration.
- Backend calls should go through `src/api/index.ts`; it uses `VITE_BACKEND_BASE_URL`, `credentials: 'include'`, JSON-LD headers, and shared `toAppError` handling.

## Commands
- Use `pnpm`, not npm/yarn. `package.json` requires Node `>=26.0.0` and declares `packageManager: pnpm@11.1.2`; frontend CI currently installs pnpm 10.
- Install and dev server: `pnpm install`, `pnpm dev`.
- Production checks/build: `pnpm build`; this runs `vue-tsc --build` and `vite build` in parallel via `run-p`.
- CI-equivalent local checks without autofix: `pnpm type-check`, `pnpm exec oxlint .`, `pnpm exec eslint . --cache --cache-location .eslintcache`, then `pnpm test:unit --run`.
- Unit tests: `pnpm test:unit`; focused non-watch run: `pnpm test:unit --run src/__tests__/App.spec.ts`.
- E2E tests: `pnpm test:e2e`; first run needs `pnpm exec playwright install`. Focus one file/browser with `pnpm test:e2e e2e/vue.spec.ts --project chromium`.
- `pnpm lint` modifies files because both oxlint and eslint use `--fix`; use it only when edits are acceptable. `pnpm format` runs `oxfmt src/`.

## Tooling Notes
- Vite validates `VITE_*` at config load through `src/env.schema.ts`; `VITE_BACKEND_BASE_URL` defaults to `http://localhost:8000/api` and must stay a valid URL if overridden.
- Vite aliases `@` to `src`.
- Vitest uses `jsdom` and excludes `e2e/**`.
- Playwright starts `npm run dev` locally on port `5173` and `npm run preview` in CI on port `4173`, even though repo docs prefer pnpm; CI installs only Chromium and runs `--project=chromium`.
- shadcn-vue is configured in `components.json` with `new-york` style, taupe base color, lucide icons, and aliases under `@/components`, `@/lib`, and `@/composables`.
- `opencode.json` enables the shadcn-vue MCP via `npx shadcn-vue@latest mcp`; use the shadcn-vue tools for registry components instead of guessing generated files.
- TanStack Query defaults live in `src/query/index.ts`: `refetchOnWindowFocus: false`, `retry: 1`, `staleTime: 30_000`, with global toast errors for unhandled mutations/background query failures.
