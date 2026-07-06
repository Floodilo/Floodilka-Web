env_file := "dev/.env"
compose_file := "dev/compose.yaml"
data_compose := "dev/compose.data.yaml"
network_name := "floodilka-shared"
compose_base := "docker compose --env-file " + env_file + " -f " + compose_file
livekit_template := "dev/templates/livekit.yaml"

up *SERVICES:
  just ensure-network
  {{compose_base}} up -d {{SERVICES}}

watch *SERVICES:
  just ensure-network
  {{compose_base}} watch {{SERVICES}}

down:
  {{compose_base}} down

nuke:
  {{compose_base}} down -v

restart *SERVICES:
  {{compose_base}} down {{SERVICES}}
  {{compose_base}} up -d {{SERVICES}}

logs *SERVICES:
  {{compose_base}} logs -f --tail 100 {{SERVICES}}

ps:
  {{compose_base}} ps

sh SERVICE shell="sh":
  {{compose_base}} exec {{SERVICE}} {{shell}}

exec SERVICE CMD:
  {{compose_base}} exec {{SERVICE}} sh -c "{{CMD}}"

livekit-sync:
  #!/usr/bin/env bash
  set -euo pipefail
  if [ ! -f {{env_file}} ]; then
    echo "{{env_file}} missing"
    exit 1
  fi
  node --env-file {{env_file}} scripts/just/livekit-sync.js --output dev/livekit.yaml

ensure-network:
  set -euo pipefail
  docker network inspect {{network_name}} >/dev/null 2>&1 || docker network create {{network_name}}

bootstrap:
  just ensure-network
  just livekit-sync

setup:
  set -euo pipefail
  just ensure-network
  if [ ! -f dev/.env ]; then cp dev/.env.example dev/.env; fi
  if [ ! -f dev/livekit.yaml ]; then cp {{livekit_template}} dev/livekit.yaml; fi

mig name:
  @cargo run --release --quiet --manifest-path scripts/cassandra-migrate/Cargo.toml -- create "{{name}}"

mig-check:
  @cargo run --release --quiet --manifest-path scripts/cassandra-migrate/Cargo.toml -- check

mig-up host="localhost" user="cassandra" pass="cassandra":
  @cargo run --release --quiet --manifest-path scripts/cassandra-migrate/Cargo.toml -- --host "{{host}}" --username "{{user}}" --password "{{pass}}" up

mig-status host="localhost" user="cassandra" pass="cassandra":
  @cargo run --release --quiet --manifest-path scripts/cassandra-migrate/Cargo.toml -- --host "{{host}}" --username "{{user}}" --password "{{pass}}" status

lic:
  @cargo run --release --quiet --manifest-path scripts/license-enforcer/Cargo.toml

snow count="1":
  @cargo run --release --quiet --manifest-path scripts/snowflake-generator/Cargo.toml -- --count {{count}}

integration-tests:
  set -euo pipefail
  trap 'docker compose -f tests/integration/compose.yaml down' EXIT
  docker compose -f tests/integration/compose.yaml up --build --abort-on-container-exit integration-tests

go-tools-install:
  GOTOOLCHAIN=go1.25.5 go install honnef.co/go/tools/cmd/staticcheck@2025.1.1
  GOTOOLCHAIN=go1.25.5 go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.61.0

go-integration-check:
  gofmt -w tests/integration
  go test ./tests/integration/...
  $(go env GOPATH)/bin/staticcheck ./tests/integration/...
  $(go env GOPATH)/bin/golangci-lint run ./tests/integration/...

dev-prod port="3000" upstream="https://floodilka.com":
  #!/usr/bin/env bash
  set -euo pipefail
  cd frontend
  export PROD_API_PROXY=1
  export PROD_API_UPSTREAM="{{upstream}}"
  export PROD_API_PORT="{{port}}"
  export PUBLIC_BOOTSTRAP_API_ENDPOINT=/api
  pnpm wasm:codegen
  pnpm generate:colors
  pnpm generate:masks
  pnpm generate:css-types
  pnpm lingui:compile
  lsof -ti :{{port}} | xargs kill -9 2>/dev/null || true
  pnpm exec rspack serve --port {{port}}

# HMR renderer on :8088 (port the Electron shell expects in dev) + Electron shell, prod API via local proxy
desktop-dev upstream="https://floodilka.com":
  #!/usr/bin/env bash
  set -euo pipefail
  cd frontend
  export PROD_API_PROXY=1
  export PROD_API_UPSTREAM="{{upstream}}"
  export PROD_API_PORT=8088
  export PUBLIC_BOOTSTRAP_API_ENDPOINT=/api
  pnpm wasm:codegen
  pnpm generate:colors
  pnpm generate:masks
  pnpm generate:css-types
  pnpm lingui:compile
  lsof -ti :8088 | xargs kill -9 2>/dev/null || true
  pnpm exec rspack serve --port 8088 &
  renderer_pid=$!
  trap 'kill "$renderer_pid" 2>/dev/null || true' EXIT
  until curl -sf http://localhost:8088 >/dev/null 2>&1; do
    kill -0 "$renderer_pid" 2>/dev/null || { echo "renderer dev server exited"; exit 1; }
    sleep 0.5
  done
  pnpm electron:compile
  NODE_ENV=development pnpm exec electron .

# Local unsigned unpacked desktop build (Windows/macOS/Linux), same shape as the PR desktop preview workflow
desktop-preview channel="stable":
  #!/usr/bin/env bash
  set -euo pipefail
  cd frontend
  export BUILD_CHANNEL="{{channel}}"
  export FLOODILKA_EMBED_WEB_BUNDLE=1
  export PUBLIC_BOOTSTRAP_API_ENDPOINT=/api
  export PUBLIC_BOOTSTRAP_API_PUBLIC_ENDPOINT=/api
  export CSC_IDENTITY_AUTO_DISCOVERY=false
  pnpm wasm:codegen
  pnpm generate:colors
  pnpm generate:masks
  pnpm generate:css-types
  pnpm exec lingui compile --strict
  rm -rf dist
  pnpm exec rspack build --mode production
  pnpm electron:compile
  case "$(uname -s)" in
    Darwin)
      pnpm exec electron-builder --dir --config electron-builder.config.cjs \
        --config.mac.identity=null --config.mac.notarize=false \
        --config.npmRebuild=false --publish never
      echo "Unpacked app: frontend/dist-electron/mac*/ (run: xattr -cr <App>.app before first launch)"
      ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT)
      pnpm exec electron-builder --dir --config electron-builder.config.cjs \
        --config.win.signAndEditExecutable=false \
        --config.npmRebuild=false --publish never
      echo "Unpacked app: frontend/dist-electron/win-unpacked/"
      ;;
    *)
      pnpm exec electron-builder --dir --config electron-builder.config.cjs \
        --config.npmRebuild=false --publish never
      echo "Unpacked app: frontend/dist-electron/linux-unpacked/"
      ;;
  esac
