%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(gateway_rpc_voice).

-export([execute_method/2]).

-spec execute_method(binary(), map()) -> term().
execute_method(<<"voice.confirm_connection">>, Params) ->
    ConnectionId = maps:get(<<"connection_id">>, Params),
    case parse_optional_guild_id(Params) of
        undefined ->
            ChannelIdBin = maps:get(<<"channel_id">>, Params),
            gateway_rpc_call:execute_method(
                <<"call.confirm_connection">>,
                #{
                    <<"channel_id">> => ChannelIdBin,
                    <<"connection_id">> => ConnectionId
                }
            );
        GuildId ->
            TokenNonce = maps:get(<<"token_nonce">>, Params, undefined),
            gateway_rpc_guild:execute_method(
                <<"guild.confirm_voice_connection_from_livekit">>,
                #{
                    <<"guild_id">> => integer_to_binary(GuildId),
                    <<"connection_id">> => ConnectionId,
                    <<"token_nonce">> => TokenNonce
                }
            )
    end;
execute_method(<<"voice.disconnect_user_if_in_channel">>, Params) ->
    ChannelIdBin = maps:get(<<"channel_id">>, Params),
    UserIdBin = maps:get(<<"user_id">>, Params),
    ConnectionId = maps:get(<<"connection_id">>, Params, undefined),
    case parse_optional_guild_id(Params) of
        undefined ->
            CallParams = #{
                <<"channel_id">> => ChannelIdBin,
                <<"user_id">> => UserIdBin
            },
            gateway_rpc_call:execute_method(
                <<"call.disconnect_user_if_in_channel">>,
                maybe_put_connection_id(ConnectionId, CallParams)
            );
        GuildId ->
            GuildParams = #{
                <<"guild_id">> => integer_to_binary(GuildId),
                <<"user_id">> => UserIdBin,
                <<"expected_channel_id">> => ChannelIdBin
            },
            gateway_rpc_guild:execute_method(
                <<"guild.disconnect_voice_user_if_in_channel">>,
                maybe_put_connection_id(ConnectionId, GuildParams)
            )
    end;
execute_method(Method, _Params) ->
    throw({error, <<"Unknown method: ", Method/binary>>}).

-spec parse_optional_guild_id(map()) -> integer() | undefined.
parse_optional_guild_id(Params) ->
    case maps:get(<<"guild_id">>, Params, undefined) of
        undefined ->
            undefined;
        null ->
            undefined;
        GuildIdBin ->
            validation:snowflake_or_throw(<<"guild_id">>, GuildIdBin)
    end.

-spec maybe_put_connection_id(binary() | undefined, map()) -> map().
maybe_put_connection_id(undefined, Params) ->
    Params;
maybe_put_connection_id(ConnectionId, Params) ->
    Params#{<<"connection_id">> => ConnectionId}.
