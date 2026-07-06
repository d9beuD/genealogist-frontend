FROM denoland/deno:alpine-2.4.1 AS builder

WORKDIR /app

COPY deno.json deno.lock package.json ./
COPY app ./app
COPY server ./server
COPY components.json nuxt.config.ts tsconfig.json ./
COPY modules ./modules

RUN deno install
RUN deno task build

FROM denoland/deno:alpine-2.4.1 AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", ".output/server/index.mjs"]
