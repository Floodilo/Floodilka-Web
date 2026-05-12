#!/bin/sh

# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2020-2026 Fluxer Contributors
# Copyright (C) 2026 Floodilka Contributors
# Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

set -e

sed -e "s|\${LIVEKIT_DOMAIN_PROD}|${LIVEKIT_DOMAIN_PROD}|g" \
    -e "s|\${LIVEKIT_DOMAIN_TURN_PROD}|${LIVEKIT_DOMAIN_TURN_PROD}|g" \
    /etc/caddy.yaml.template > /etc/caddy.yaml

exec caddy run --config /etc/caddy.yaml --adapter yaml "$@"