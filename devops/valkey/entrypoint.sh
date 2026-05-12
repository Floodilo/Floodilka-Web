#!/bin/sh

# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2020-2026 Fluxer Contributors
# Copyright (C) 2026 Floodilka Contributors
# Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

set -e

# Substitute environment variables in the config file
sed -e "s|\${VALKEY_PASSWORD}|${VALKEY_PASSWORD}|g" \
    /etc/valkey/valkey.conf.template > /tmp/valkey.conf

# Start Valkey with the processed config
exec valkey-server /tmp/valkey.conf "$@"