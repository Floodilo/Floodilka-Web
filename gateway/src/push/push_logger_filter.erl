%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(push_logger_filter).

-export([install_progress_filter/0]).

install_progress_filter() ->
    Filter = {fun logger_filters:progress/2, stop},
    case logger:add_handler_filter(default, push_progress_filter, Filter) of
        ok ->
            ok;
        {error, already_exists} ->
            ok;
        {error, Reason} ->
            logger:error(
                "[push] failed to install progress filter: ~p",
                [Reason]
            ),
            {error, Reason}
    end.
