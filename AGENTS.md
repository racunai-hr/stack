# Agent rules — racunai.hr (WSL local stack)

## HARD LAW: local develop = Next.js **dev mode**

This workspace is the **local WSL develop** stack. Frontend on `localhost:3000` **must** run as:

```bash
next dev --hostname 0.0.0.0 --port 3000
```

**Not** a production `Dockerfile` runner / `next start` / `NODE_ENV=production` image — unless the user **explicitly** asks for a production/stage build.

### Forbidden by default

- `docker compose build app-web` to pick up UI changes
- Recreating `racunai_app_web` from the production multi-stage image for normal coding
- Claiming “deployed to develop” when you only `git push`ed — push ≠ local runtime
- Making the user wait for a full Next production build to see frontend work

### Required local app-web shape

Configured in [`docker-compose.override.yml`](docker-compose.override.yml):

- bind-mount `./app` → `/app`
- `NODE_ENV=development`
- command: `npm run dev` (HMR)
- env aligned with [`app/.env.local`](app/.env.local) (`NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`)

If `app-web` is in production mode, fix the override and:

```bash
docker compose up -d --force-recreate --no-deps app-web
```

Confirm: process is `next dev`, not a cold production `next-server` from a baked image without source mount.

### Django (local)

API source is already bind-mounted (`./api/app`). Prefer reload/restart over rebuild. Do not flip stage Traefik hosts into “local verify” when `localhost:8000` is the local API.

Browser calls to `http://localhost:8000` send `Host: localhost`. Tenant middleware 404s unless override sets `DEBUG=True` + `TENANT_DEFAULT_SLUG=finestar` (see `docker-compose.override.yml`). After changing those env vars: `docker compose up -d --force-recreate --no-deps django`.

### Cursor rule mirror

Same law is always-applied in [`.cursor/rules/local-dev-mode.mdc`](.cursor/rules/local-dev-mode.mdc). Do not remove or weaken it without an explicit user request.
