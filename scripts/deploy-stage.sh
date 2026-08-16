#!/usr/bin/env bash
# Stage deploy on WSL only. Never SSHs to dedicated-hel1.
# Never touches production racunai.hr hosts.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

unset SSH_AUTH_SOCK || true

if [[ "${SKIP_CLOUDFLARE:-}" != "1" ]]; then
  "${ROOT_DIR}/scripts/cloudflare_tunnel_upsert.sh"
fi

set -a
# shellcheck disable=SC1091
[[ -f "${ROOT_DIR}/cloudflared/.env" ]] && source "${ROOT_DIR}/cloudflared/.env"
# shellcheck disable=SC1091
[[ -f "${ROOT_DIR}/.env" ]] && source "${ROOT_DIR}/.env"
set +a

if [[ -n "${POSTGRES_ADMIN_URL:-}" && -n "${GATEWAY_DB_PASSWORD:-}" ]]; then
  python3 "${ROOT_DIR}/intermediary/deploy/provision_database.py"
fi

docker compose up -d --build
echo "stage deploy finished"
