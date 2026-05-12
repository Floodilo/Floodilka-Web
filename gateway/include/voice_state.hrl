%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-record(voice_flags, {
    self_mute = false :: boolean(),
    self_deaf = false :: boolean(),
    self_video = false :: boolean(),
    self_stream = false :: boolean(),
    is_mobile = false :: boolean(),
    platform = <<"web">> :: binary()
}).

-type voice_flags() :: #voice_flags{}.
