%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(push_subscriptions).

-export([fetch_and_send_subscriptions/9]).
-export([fetch_and_cache_user_guild_settings/3]).
-export([delete_failed_subscriptions/1]).
-export([delete_failed_mobile_tokens/1]).

-import(rpc_client, [call/1]).

fetch_and_send_subscriptions(
    UserIds,
    MessageData,
    GuildId,
    ChannelId,
    MessageId,
    GuildName,
    ChannelName,
    State,
    BadgeCounts
) ->
    SubscriptionsReq = #{
        <<"type">> => <<"get_push_subscriptions">>,
        <<"user_ids">> => [integer_to_binary(UserId) || UserId <- UserIds]
    },

    case call(SubscriptionsReq) of
        {ok, ResponseData} ->
            WebData = maps:get(<<"web">>, ResponseData, #{}),
            MobileData = maps:get(<<"mobile">>, ResponseData, #{}),

            %% Send web push and cache subscriptions
            NewState = lists:foldl(
                fun(UserId, S) ->
                    UserIdBin = integer_to_binary(UserId),
                    case maps:get(UserIdBin, WebData, []) of
                        [] ->
                            push_cache:cache_user_subscriptions(UserId, [], S);
                        Subscriptions ->
                            BadgeCount = maps:get(UserId, BadgeCounts, 0),
                            push_sender:send_to_user_subscriptions(
                                UserId,
                                Subscriptions,
                                MessageData,
                                GuildId,
                                ChannelId,
                                MessageId,
                                GuildName,
                                ChannelName,
                                BadgeCount
                            ),
                            push_cache:cache_user_subscriptions(UserId, Subscriptions, S)
                    end
                end,
                State,
                UserIds
            ),

            %% Send mobile push notifications via RPC
            push_sender:send_mobile_notifications(
                UserIds, MobileData, MessageData, GuildId,
                ChannelId, MessageId, GuildName, ChannelName, BadgeCounts
            ),

            NewState;
        {error, _Reason} ->
            State
    end.

fetch_and_cache_user_guild_settings(UserId, GuildId, _State) ->
    Req = #{
        <<"type">> => <<"get_user_guild_settings">>,
        <<"user_ids">> => [integer_to_binary(UserId)],
        <<"guild_id">> => integer_to_binary(GuildId)
    },

    case rpc_client:call(Req) of
        {ok, Data} ->
            UserGuildSettings = maps:get(<<"user_guild_settings">>, Data, [null]),
            [SettingsData | _] = UserGuildSettings,
            case SettingsData of
                null ->
                    null;
                Settings ->
                    gen_server:cast(
                        push, {cache_user_guild_settings, UserId, GuildId, Settings}
                    ),
                    Settings
            end;
        {error, _Reason} ->
            null
    end.

delete_failed_subscriptions(FailedSubscriptions) ->
    DeleteReq = #{
        <<"type">> => <<"delete_push_subscriptions">>,
        <<"subscriptions">> => FailedSubscriptions
    },
    call(DeleteReq).

delete_failed_mobile_tokens(FailedTokens) ->
    DeleteReq = #{
        <<"type">> => <<"delete_mobile_push_tokens">>,
        <<"tokens">> => FailedTokens
    },
    call(DeleteReq).
