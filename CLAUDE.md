# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal homepage built with Nuxt 3: multi-engine search, categorized link navigation, and an admin panel for editing the site configuration. SSR is used in production (Vercel or Node/Docker), with configuration persisted to Qiniu object storage (or a local file for development).

## Development Commands

- `npm run dev` – dev server on http://localhost:3000
- `npm run build` – production build (`.output/`)
- `npm run preview` – preview the production build
- `npm run generate` – static generation
- `npm run lint` / `npm run lint:fix` – ESLint
- `npm run typecheck` – vue-tsc type checking
- `npm run format` / `npm run format:check` – Prettier
- `npm install` – install dependencies

Node.js >= 22.12 is required (`engines` in `package.json`). There is no automated test suite yet.

## Architecture

- Nuxt 3 (3.21), Vue 3 Composition API, TypeScript 5, custom CSS (no Tailwind).
- Pages: `pages/index.vue` (public homepage), `pages/admin.vue` (admin UI), `pages/login.vue`.
- Auth: JWT in an **httpOnly cookie** (`admin_token`, 2h TTL). Login sets it; `requireAdmin()` reads it from the cookie (an `Authorization: Bearer` header is also accepted for scripting). Tokens are never stored in localStorage or passed in query strings.
- Config storage: `server/utils/config-store.ts`. `STORAGE_TYPE=qiniu` for production/Vercel; `STORAGE_TYPE=local` for development/Docker, using `CONFIG_FILE_PATH` (default `./site-config.json`).
- Config API: `GET /api/config` (public, strips `_admin`), `POST /api/config` (admin).
- Auth API: `POST /api/auth/login`, `GET /api/auth/verify`, `POST /api/auth/logout`, `POST /api/auth/change-password`.
- Utility API: `GET /api/fetch-site-info` (admin only, SSRF-guarded), `GET /api/health`.
- `/admin` is protected by `middleware/auth.ts`, which verifies via `/api/auth/verify` on both server (forwarding the request cookie) and client.

## Configuration

- `utils/config.ts` – built-in `defaultConfig`, used only when no stored configuration exists yet.
- `site-config.json` – local storage file (kept in the repo as the default/reference configuration).
- `types/config.ts` – `SiteConfig` schema.
- Environment variables read by `nuxt.config.ts`: `NUXT_ADMIN_PASSWORD` and `NUXT_JWT_SECRET` are required; `STORAGE_TYPE`, `CONFIG_FILE_PATH`, and `NUXT_QINIU_ACCESS_KEY` / `NUXT_QINIU_SECRET_KEY` / `NUXT_QINIU_BUCKET` / `NUXT_QINIU_DOMAIN` / `NUXT_QINIU_CONFIG` for storage.
  There are **no weak default secrets**: if the password or JWT secret is missing, login returns 503.

## Icon System

- SVG sprites live in `public/icons.svg`, referenced as `#icon-name`.
- `IconComponent.vue` renders sprite SVGs, images (`/` or `http` URLs), or inline SVG strings.
- The sprite is injected on the client by `plugins/svg-icons.client.ts`.

## Conventions

- Vue 3 `<script setup>` with TypeScript. Prettier: no semicolons, single quotes, 100 columns.
- Error responses use h3's `message` field; clients read `error.data.message` (falling back to `statusMessage` for compatibility).
- Never reintroduce `v-html` for admin-editable fields – the copyright block is rendered with text interpolation to avoid stored XSS.
