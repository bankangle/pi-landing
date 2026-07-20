# PI Retail landing — SvelteKit (adapter-node) SSR, served as one small Node process.
# Multi-stage: build with dev deps, ship only the build output + production deps.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Behind Caddy: derive the request origin from proxy headers so both domains work
# (adapter-node CSRF for the contact form). Caddy sets these on reverse_proxy.
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
# Real client IP from Caddy — without this the per-IP rate limit sees every
# visitor as the proxy and throttles the whole site as one user.
ENV ADDRESS_HEADER=x-forwarded-for
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "build"]
