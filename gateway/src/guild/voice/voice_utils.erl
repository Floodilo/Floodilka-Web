%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(voice_utils).

-export([
    build_voice_token_rpc_request/6,
    build_voice_token_rpc_request/7,
    build_force_disconnect_rpc_request/4,
    build_update_participant_rpc_request/5,
    build_update_participant_permissions_rpc_request/5,
    add_geolocation_to_request/3,
    compute_voice_permissions/3
]).

build_voice_token_rpc_request(GuildId, ChannelId, UserId, ConnectionId, Latitude, Longitude) ->
    BaseReq =
        case GuildId of
            null ->
                #{
                    <<"type">> => <<"voice_get_token">>,
                    <<"channel_id">> => integer_to_binary(ChannelId),
                    <<"user_id">> => integer_to_binary(UserId)
                };
            _ ->
                BaseMap = #{
                    <<"type">> => <<"voice_get_token">>,
                    <<"guild_id">> => integer_to_binary(GuildId),
                    <<"channel_id">> => integer_to_binary(ChannelId),
                    <<"user_id">> => integer_to_binary(UserId)
                },
                case ConnectionId of
                    null ->
                        BaseMap;
                    ConnectionId when is_binary(ConnectionId) ->
                        maps:put(<<"connection_id">>, ConnectionId, BaseMap);
                    ConnectionId when is_integer(ConnectionId) ->
                        maps:put(<<"connection_id">>, integer_to_binary(ConnectionId), BaseMap);
                    _ ->
                        BaseMap
                end
        end,

    add_geolocation_to_request(BaseReq, Latitude, Longitude).

add_geolocation_to_request(RequestMap, Latitude, Longitude) ->
    case {Latitude, Longitude} of
        {Lat, Long} when is_binary(Lat) andalso is_binary(Long) ->
            maps:merge(RequestMap, #{
                <<"latitude">> => Lat,
                <<"longitude">> => Long
            });
        _ ->
            RequestMap
    end.

build_force_disconnect_rpc_request(GuildId, ChannelId, UserId, ConnectionId) ->
    BaseReq = #{
        <<"type">> => <<"voice_force_disconnect_participant">>,
        <<"channel_id">> => integer_to_binary(ChannelId),
        <<"user_id">> => integer_to_binary(UserId),
        <<"connection_id">> => ConnectionId
    },
    case GuildId of
        null ->
            BaseReq;
        _ ->
            maps:put(<<"guild_id">>, integer_to_binary(GuildId), BaseReq)
    end.

build_update_participant_rpc_request(GuildId, ChannelId, UserId, Mute, Deaf) ->
    BaseReq = #{
        <<"type">> => <<"voice_update_participant">>,
        <<"channel_id">> => integer_to_binary(ChannelId),
        <<"user_id">> => integer_to_binary(UserId),
        <<"mute">> => Mute,
        <<"deaf">> => Deaf
    },
    case GuildId of
        null ->
            BaseReq;
        _ ->
            maps:put(<<"guild_id">>, integer_to_binary(GuildId), BaseReq)
    end.

build_update_participant_permissions_rpc_request(
    GuildId, ChannelId, UserId, ConnectionId, VoicePermissions
) ->
    BaseReq = #{
        <<"type">> => <<"voice_update_participant_permissions">>,
        <<"channel_id">> => integer_to_binary(ChannelId),
        <<"user_id">> => integer_to_binary(UserId),
        <<"connection_id">> => ConnectionId,
        <<"can_speak">> => maps:get(can_speak, VoicePermissions, true),
        <<"can_stream">> => maps:get(can_stream, VoicePermissions, true),
        <<"can_video">> => maps:get(can_video, VoicePermissions, true)
    },
    case GuildId of
        null ->
            BaseReq;
        _ ->
            maps:put(<<"guild_id">>, integer_to_binary(GuildId), BaseReq)
    end.

-spec compute_voice_permissions(integer(), integer(), map()) -> map().
compute_voice_permissions(UserId, ChannelId, State) ->
    Permissions = guild_permissions:get_member_permissions(UserId, ChannelId, State),
    SpeakPerm = constants:speak_permission(),
    StreamPerm = constants:stream_permission(),
    AdminPerm = constants:administrator_permission(),

    IsAdmin = (Permissions band AdminPerm) =:= AdminPerm,
    CanSpeak = IsAdmin orelse ((Permissions band SpeakPerm) =:= SpeakPerm),
    CanStream = IsAdmin orelse ((Permissions band StreamPerm) =:= StreamPerm),

    HasVirtualAccess = guild_virtual_channel_access:has_virtual_access(UserId, ChannelId, State),
    FinalCanSpeak = CanSpeak orelse HasVirtualAccess,
    FinalCanStream = CanStream orelse HasVirtualAccess,

    #{
        can_speak => FinalCanSpeak,
        can_stream => FinalCanStream,
        can_video => FinalCanStream
    }.

build_voice_token_rpc_request(
    GuildId, ChannelId, UserId, ConnectionId, Latitude, Longitude, VoicePermissions
) ->
    BaseReq = build_voice_token_rpc_request(
        GuildId, ChannelId, UserId, ConnectionId, Latitude, Longitude
    ),
    maps:merge(BaseReq, #{
        <<"can_speak">> => maps:get(can_speak, VoicePermissions, true),
        <<"can_stream">> => maps:get(can_stream, VoicePermissions, true),
        <<"can_video">> => maps:get(can_video, VoicePermissions, true)
    }).
