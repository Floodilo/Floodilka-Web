#!/bin/bash

# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2020-2026 Fluxer Contributors
# Copyright (C) 2026 Floodilka Contributors
# Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env ]; then
    echo "Missing .env in $(pwd)" >&2
    exit 1
fi

# shellcheck disable=SC1091
set -a; . ./.env; set +a

: "${LIVEKIT_VALKEY_PASSWORD:?LIVEKIT_VALKEY_PASSWORD must be set in .env}"
: "${NODE_PRIVATE_IP:?NODE_PRIVATE_IP must be set in .env}"
: "${NODE_IP:?NODE_IP must be set in .env}"

if [ "${NODE_PRIVATE_IP}" = "192.168.0.125" ]; then
    export VALKEY_REPLICAOF_DIRECTIVE=""
else
    export VALKEY_REPLICAOF_DIRECTIVE="replicaof 192.168.0.125 6379"
fi

mkdir -p conf rendered

envsubst < conf/livekit.yaml.template > rendered/livekit.yaml
chmod 0644 rendered/livekit.yaml

envsubst '${LIVEKIT_VALKEY_PASSWORD} ${VALKEY_REPLICAOF_DIRECTIVE}' \
    < conf/valkey.conf > rendered/valkey.conf
chmod 0644 rendered/valkey.conf

if [ ! -f rendered/sentinel.conf ]; then
    envsubst '${LIVEKIT_VALKEY_PASSWORD} ${NODE_PRIVATE_IP}' \
        < conf/sentinel.conf > rendered/sentinel.conf
    chmod 0644 rendered/sentinel.conf
    echo "Rendered fresh rendered/sentinel.conf"
else
    echo "Keeping existing rendered/sentinel.conf (contains failover state)"
fi

echo "Rendered livekit.yaml ($(wc -l < rendered/livekit.yaml) lines)"
echo "Rendered valkey.conf ($(wc -l < rendered/valkey.conf) lines)"
echo "Sentinel conf at rendered/sentinel.conf"