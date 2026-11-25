#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
if [[ -n "${CODESPACE_NAME:-}" ]]; then
  export __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS="$CODESPACE_NAME-5173.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
  export PUBLIC_WEB_ORIGIN="https://$__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS"
fi

export OPENFOUNDRY_AUTH_PROXY=http://127.0.0.1:50051
if ! curl -fsS http://127.0.0.1:5173/ >/dev/null 2>&1; then
  nohup pnpm dev --host 0.0.0.0 --port 5173 --strictPort </dev/null >/tmp/openfoundry-preview.log 2>&1 &
fi

docker compose -f infra/docker-compose.yml up -d --wait postgres

if ! curl -fsS http://127.0.0.1:50051/health >/dev/null 2>&1; then
  export DATABASE_URL=postgres://openfoundry:openfoundry@127.0.0.1:5432/openfoundry
  export HOST=127.0.0.1 PORT=50051 RUST_LOG=info
  secret_file="$(git rev-parse --git-path openfoundry-preview-jwt)"
  if [[ ! -s "$secret_file" ]]; then
    (umask 077; openssl rand -hex 32 >"$secret_file")
  fi
  export JWT_SECRET="$(cat "$secret_file")"
  nohup cargo run --locked -p auth-service </dev/null >/tmp/openfoundry-auth.log 2>&1 &
fi
