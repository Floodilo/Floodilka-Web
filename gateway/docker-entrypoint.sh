#!/bin/bash

# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2020-2026 Fluxer Contributors
# Copyright (C) 2026 Floodilka Contributors
# Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

set -e

# Set default values for environment variables if not set
export LOGGER_LEVEL=${LOGGER_LEVEL:-debug}
export RELEASE_NODE=${RELEASE_NODE:-floodilka_gateway@gateway}

# Substitute environment variables in config files
envsubst < /workspace/config/vm.args.template > /workspace/config/vm.args
envsubst < /workspace/config/sys.config.template > /workspace/config/sys.config

# Start inotify watcher in the background for auto-recompilation
(while true; do
    inotifywait -r -e modify,create,delete,move src/ config/ 2>/dev/null && \
    sleep 0.5 && \
    rebar3 compile && \
    envsubst < /workspace/config/vm.args.template > /workspace/config/vm.args && \
    envsubst < /workspace/config/sys.config.template > /workspace/config/sys.config
done) &

# Start the Erlang application
exec erl -pa _build/default/lib/*/ebin \
    -config config/sys.config \
    -args_file config/vm.args \
    -eval 'application:ensure_all_started(floodilka_gateway)' \
    -noshell