# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
deno install
```

## Environment

Set the backend API URL with `NUXT_API_BASE_URL`.

```bash
NUXT_API_BASE_URL=http://localhost:8000
```

Use the same variable in dev and production. `runtimeConfig.public.apiBaseUrl`
reads from it.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
deno task dev
```

## Production

Build the application for production:

```bash
deno task build
```

Locally preview production build:

```bash
deno task preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
