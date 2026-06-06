# Family Tree Frontend

This repository contains the frontend application for a family-tree app. It provides the user interface for exploring and managing genealogy data.

## Package Manager

This project uses `pnpm` instead of `npm`. Use `pnpm` for installing dependencies and running scripts.

```sh
pnpm install
```

## Development

Start the frontend development server:

```sh
pnpm dev
```

## Build

Type-check and build the production bundle:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

## Tests

Run unit tests:

```sh
pnpm test:unit
```

Run end-to-end tests:

```sh
pnpm test:e2e
```

Install Playwright browsers before running end-to-end tests for the first time:

```sh
pnpm exec playwright install
```

## Code Quality

Run linters:

```sh
pnpm lint
```

Format source files:

```sh
pnpm format
```

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- Tailwind CSS
- Vitest
- Playwright
