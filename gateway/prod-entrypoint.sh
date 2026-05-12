#!/bin/bash

# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2020-2026 Fluxer Contributors
# Copyright (C) 2026 Floodilka Contributors
# Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

set -e

CONTAINER_IP=$(hostname -i | awk '{print $1}')
export RELEASE_NODE="${RELEASE_NODE_OVERRIDE:-floodilka_gateway@${CONTAINER_IP}}"
export NODE_COOKIE="${NODE_COOKIE:-floodilka_default_change_me}"
export LOGGER_LEVEL="${LOGGER_LEVEL:-info}"

exec /opt/floodilka_gateway/bin/floodilka_gateway foreground