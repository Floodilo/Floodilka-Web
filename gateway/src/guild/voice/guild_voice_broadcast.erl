%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(guild_voice_broadcast).

-export([broadcast_voice_state_update/3]).
-export([broadcast_voice_server_update_to_session/7]).

-ifdef(TEST).
-define(WARN_MISSING_CONN(_VoiceState), ok).
-else.
-define(WARN_MISSING_CONN(VoiceState),
    logger:warning(
        "[guild_voice_broadcast] Skipping VOICE_STATE_UPDATE broadcast - missing connection_id: ~p",
        [VoiceState]
    )
).
-endif.

broadcast_voice_state_update(VoiceState, State, OldChannelIdBin) ->
    case maps:get(<<"connection_id">>, VoiceState, undefined) of
        undefined ->
            ?WARN_MISSING_CONN(VoiceState),
            ok;
        ConnectionId ->
            Sessions = maps:get(sessions, State, #{}),
            ChannelIdBin = maps:get(<<"channel_id">>, VoiceState, null),

            FilterChannelIdBin =
                case ChannelIdBin of
                    null ->
                        OldChannelIdBin;
                    _ ->
                        ChannelIdBin
                end,

            FilterChannelId = utils:binary_to_integer_safe(FilterChannelIdBin),

            UserId = maps:get(<<"user_id">>, VoiceState, <<"unknown">>),
            GuildId = maps:get(id, State, 0),
            AllSessionDetails = [{Sid, maps:get(user_id, S)} || {Sid, S} <- maps:to_list(Sessions)],
            logger:info(
                "[guild_voice_broadcast] Broadcasting voice state update: "
                "guild_id=~p user_id=~p channel_id=~p connection_id=~p "
                "total_sessions=~p all_sessions=~p filter_channel_id=~p",
                [
                    GuildId,
                    UserId,
                    ChannelIdBin,
                    ConnectionId,
                    maps:size(Sessions),
                    AllSessionDetails,
                    FilterChannelId
                ]
            ),

            FilteredSessions = guild_sessions:filter_sessions_for_channel(
                Sessions, FilterChannelId, undefined, State
            ),

            SessionDetails = [{Sid, maps:get(user_id, S)} || {Sid, S} <- FilteredSessions],
            Pids = [maps:get(pid, S) || {_Sid, S} <- FilteredSessions],

            logger:info(
                "[guild_voice_broadcast] Filtered sessions: "
                "guild_id=~p user_id=~p filtered_count=~p session_details=~p pids=~p",
                [GuildId, UserId, length(FilteredSessions), SessionDetails, Pids]
            ),

            lists:foreach(
                fun(Pid) when is_pid(Pid) ->
                    logger:info(
                        "[guild_voice_broadcast] Sending voice_state_update to session pid ~p",
                        [Pid]
                    ),
                    gen_server:cast(Pid, {dispatch, voice_state_update, VoiceState})
                end,
                Pids
            )
    end.

broadcast_voice_server_update_to_session(
    GuildId, ChannelId, SessionId, Token, Endpoint, ConnectionId, State
) ->
    VoiceServerUpdate = #{
        <<"token">> => Token,
        <<"endpoint">> => Endpoint,
        <<"guild_id">> => integer_to_binary(GuildId),
        <<"channel_id">> => integer_to_binary(ChannelId),
        <<"connection_id">> => ConnectionId
    },

    Sessions = maps:get(sessions, State, #{}),

    case maps:get(SessionId, Sessions, undefined) of
        undefined ->
            ok;
        SessionData ->
            SessionPid = maps:get(pid, SessionData, null),
            case SessionPid of
                Pid when is_pid(Pid) ->
                    gen_server:cast(Pid, {dispatch, voice_server_update, VoiceServerUpdate});
                _ ->
                    ok
            end
    end.
