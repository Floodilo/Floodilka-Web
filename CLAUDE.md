# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Floodilka is an open-source instant messaging / VoIP platform (Discord-like) — a fork of [Fluxer](https://github.com/fluxerapp/fluxer). AGPL-3.0-or-later. It's a polyglot monorepo of independently deployed services; see `docs/architecture/floodilka.c4` (LikeC4 format) for the authoritative system diagram (actors, hosts, data flow between services/databases).

Services, by language:
- `frontend/` — React 19 + TypeScript SPA, also packaged as an Electron desktop app. Rspack bundler.
- `backend/` — Node.ts + Hono REST API (`backend_api`) and background worker (`backend_worker`, same codebase, `src/worker/Worker.ts` entrypoint). Talks to Postgres, Cassandra, Valkey (Redis-compatible), Meilisearch, S3.
- `gateway/` — Erlang/OTP + Cowboy realtime WebSocket gateway + HTTP-RPC to backend.
- `media-proxy/` — Node.ts + Hono + sharp/onnxruntime, image resize/convert/thumbhash.
- `admin/` — Gleam + Mist admin panel.
- `metrics/` — Rust + Axum metrics ingestion, aggregates into ClickHouse.
- `migration/` — Node.ts scripts for data migration (phased, see `migration/phases`).
- `scripts/` — Rust CLI helper tools (Cassandra migrations, snowflake ID generator, license enforcer) invoked via `just`.
- `tests/integration/` — Go-based black-box integration test suite hitting the real stack via Docker Compose.
- `tests/load/` — load testing.
- `devops/` — per-service Dockerfiles/configs for the Swarm/Compose deployment.

Root-level tools: `just` (task runner, see `justfile`), `biome` (JS/TS/JSON/CSS lint+format), `prettier` (astro), pnpm workspaces.

## Common commands

All local dev runs through Docker Compose, orchestrated with `just` (see root `justfile`). Env file: `dev/.env` (copy from `dev/.env.example` via `just setup`).

```sh
just setup              # first-time: creates docker network, .env, livekit.yaml
just up [service...]    # start stack (all services, or specific ones) in background
just watch [service...] # start with compose watch (auto-rebuild on change)
just logs [service...]  # tail logs
just sh <service>       # shell into a running container
just down               # stop stack
just nuke               # stop stack AND delete volumes (destructive)
```

Frontend, outside Docker (for fast HMR against the real prod API):
```sh
cd frontend
pnpm dev                # local dev server on :3000, full local stack
just dev-prod           # rspack serve proxying prod API (no local backend needed)
just desktop-dev        # Electron shell + HMR renderer on :8088, proxying prod API
just desktop-preview    # unsigned unpacked Electron build, same shape as PR desktop preview CI
```

Backend:
```sh
cd backend
pnpm dev                # tsx watch, kills stale port first
pnpm dev:worker         # background worker process
pnpm typecheck          # tsc --noEmit
```

Tests (per-package, via vitest):
```sh
cd frontend && pnpm test                      # vitest run
cd frontend && pnpm test:watch                 # watch mode
cd frontend && pnpm exec vitest run path/to/File.test.tsx   # single file
cd frontend && pnpm exec vitest run -t "test name substring" # single test by name
cd backend && pnpm test
cd backend && pnpm test:coverage
```

Go integration tests (require the full stack running via Docker Compose):
```sh
just integration-tests   # spins up tests/integration/compose.yaml, runs, tears down
just go-integration-check # gofmt + go test + staticcheck + golangci-lint on tests/integration
```

Lint/format (root, JS/TS/CSS/JSON across the whole repo):
```sh
pnpm biome check .
pnpm biome check --write .
```

Rust helper scripts (Cassandra migrations, snowflake generator, license header enforcement):
```sh
just mig <name>          # scaffold a new Cassandra migration
just mig-check            # validate migration files
just mig-up               # apply migrations (localhost:9042 by default)
just mig-status
just snow [count]         # generate snowflake IDs
just lic                  # enforce license headers across the repo
```

## Frontend architecture

The frontend follows a Flux-like pattern (inherited from the Fluxer/Discord-web lineage), not a typical component-fetches-its-own-data setup:

- `src/records/` — plain immutable-ish data model classes (e.g. `MessageRecord`, `GuildRecord`, `UserRecord`) representing normalized domain entities.
- `src/actions/*ActionCreators.tsx` — functions that call the HTTP API (via `~/lib/HttpClient` and `~/Endpoints`) and dispatch results; this is the only layer that should perform network I/O.
- `src/stores/*Store.tsx` — MobX stores (`makeAutoObservable`) holding client-side state, populated by action creators. Components read from stores via `mobx-react-lite` observers, not directly from actions.
- `src/viewmodels/` — a newer layer for view-specific derived state (currently used for `auth`), sitting between stores and components.
- `src/components/` — React components, organized by feature (`channel/`, `layout/`, `modals/`, `pages/`, `uikit/`), using CSS Modules (`*.module.css`) with generated `.d.ts` typings (`pnpm generate:css-types`, uses `tcm`).
- Path alias `~/*` maps to `frontend/src/*`; `@pkgs/*` maps to `frontend/pkgs/*` (generated WASM bindings, see below).
- i18n via Lingui (`src/locales`, `.po` files); run `pnpm lingui:extract` / `pnpm lingui:compile` after adding translatable strings. Translation automation lives in `scripts/cmd/locales-pending` (Go).
- A Rust/WASM crate (`frontend/crates/libfluxcore`) is compiled to `frontend/pkgs/libfluxcore` via `pnpm wasm:codegen` (wasm-pack) — required before most frontend builds/dev runs (already wired into `pnpm dev`/`pnpm build`/`just dev-prod` etc).
- The same `frontend/src` code is shipped both as a web SPA and, via `src-electron/`, as an Electron desktop app (`electron-builder.config.cjs`). Electron main-process code lives under `src-electron`, compiled separately (`pnpm electron:compile`, `tsconfig.electron.json`).

## Backend architecture

- Entry points: `src/App.ts` (API server, Hono) and `src/worker/Worker.ts` (background jobs: media transcoding, push fanout, retention, GDPR export).
- Feature modules are organized by domain under `src/` (`auth/`, `channel/`, `guild/`, `attachment/`, `feature_flag/`, `gateway/` [RPC client to the Erlang gateway], `favorite_meme/`, `download/`, `admin/`, `instance/`, `geoip/`, `infrastructure/`, `database/`, `errors/`, `constants/`).
- `Schema.ts` / `Tables.ts` / `Models.ts` define the Postgres data layer; Cassandra is used separately for message history (wide-column, high write volume).
- `Config.ts` centralizes env-driven configuration; `RateLimitConfig.ts` defines per-route throttling.
- Import alias `~` maps to `backend/src` (via `module-alias`/`_moduleAliases` in `package.json`, and matching TS path config).
- The backend talks to the gateway service over RPC (`:8081`) to push realtime events to connected clients, and the gateway calls back into the backend via HTTP.

## Cross-cutting notes

- License headers: most source files carry an SPDX/AGPL header block attributing "Fluxer Contributors" (original) and "Floodilka Contributors" (fork, from March 2026). Keep this pattern when adding new files in `frontend/`, `backend/`, `media-proxy/` — check a neighboring file in the same directory for the exact header, and run `just lic` to verify compliance.
- Data plane: Postgres (relational core: users/guilds/channels/auth), Cassandra (message history), Valkey (cache/sessions/pubsub), Meilisearch (full-text search), ClickHouse (analytics via `metrics`), S3/MinIO (object storage). See `dataPlane` view in `docs/architecture/floodilka.c4` for exactly which service writes to what.
- Voice/video is delegated to an external LiveKit server (separate host in production, see the `livekitHost` block in the C4 file), controlled via `livekit-server-sdk` from the backend.
- CI workflows live in `.github/workflows/`: `deploy-production.yml`, `deploy-staging.yml`, `load-test.yml`, `pr-desktop-preview.yml` (builds an unsigned Electron preview per PR, mirrors `just desktop-preview`).
