%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(gateway_rpc_misc).

-export([execute_method/2, get_local_node_stats/0]).

execute_method(<<"process.memory_stats">>, Params) ->
    Limit =
        case maps:get(<<"limit">>, Params, undefined) of
            undefined ->
                100;
            LimitValue ->
                validation:snowflake_or_throw(<<"limit">>, LimitValue)
        end,

    Guilds = process_memory_stats:get_guild_memory_stats(Limit),
    #{<<"guilds">> => Guilds};
execute_method(<<"process.node_stats">>, _Params) ->
    get_local_node_stats();
execute_method(<<"process.get_all_voice_states">>, _Params) ->
    %% Voice states live on the owning node for each guild / call. Aggregate
    %% across every gateway node so the admin voice monitor sees the whole
    %% cluster, not just whichever replica caught the RPC.
    GuildVoiceStates = cluster_stats:collect_call(guild_manager, get_all_voice_states, 5000),

    CallVoiceStates = cluster_stats:collect_call(call_manager, get_all_call_states, 5000),

    FormattedGuilds = lists:map(fun format_guild_voice_data/1, GuildVoiceStates),
    FormattedCalls = lists:map(fun format_call_voice_data/1, CallVoiceStates),

    #{
        <<"guilds">> => FormattedGuilds,
        <<"calls">> => FormattedCalls
    }.

get_local_node_stats() ->
    %% Cluster-wide totals. Each manager's get_global_count returns the
    %% local node's count; cluster_stats fans out across every gateway
    %% node and sums the answers.
    SessionCount = cluster_stats:sum_call(session_manager, get_global_count, 1000),
    GuildCount = cluster_stats:sum_call(guild_manager, get_global_count, 1000),
    PresenceCount = cluster_stats:sum_call(presence_manager, get_global_count, 1000),
    CallCount = cluster_stats:sum_call(call_manager, get_global_count, 1000),

    MemoryInfo = erlang:memory(),
    TotalMemory = proplists:get_value(total, MemoryInfo, 0),
    ProcessMemory = proplists:get_value(processes, MemoryInfo, 0),
    SystemMemory = proplists:get_value(system, MemoryInfo, 0),

    #{
        <<"status">> => <<"healthy">>,
        <<"sessions">> => SessionCount,
        <<"guilds">> => GuildCount,
        <<"presences">> => PresenceCount,
        <<"calls">> => CallCount,
        <<"memory">> => #{
            <<"total">> => TotalMemory,
            <<"processes">> => ProcessMemory,
            <<"system">> => SystemMemory
        },
        <<"process_count">> => erlang:system_info(process_count),
        <<"process_limit">> => erlang:system_info(process_limit),
        <<"uptime_seconds">> => element(1, erlang:statistics(wall_clock)) div 1000
    }.

format_guild_voice_data(GuildData) ->
    #{
        guild_id := GuildId,
        guild_name := GuildName,
        guild_icon := GuildIcon,
        channels := Channels,
        voice_states := VoiceStates
    } = GuildData,

    ChannelMap = build_channel_name_map(Channels),

    GroupedByChannel = lists:foldl(
        fun(VS, Acc) ->
            ChannelIdBin = maps:get(<<"channel_id">>, VS, null),
            Existing = maps:get(ChannelIdBin, Acc, []),
            maps:put(ChannelIdBin, [format_voice_state(VS) | Existing], Acc)
        end,
        #{},
        VoiceStates
    ),

    ChannelList = maps:fold(
        fun(ChannelIdBin, States, Acc) ->
            ChannelName = maps:get(ChannelIdBin, ChannelMap, ChannelIdBin),
            [#{
                <<"channel_id">> => ChannelIdBin,
                <<"channel_name">> => ChannelName,
                <<"voice_states">> => States
            } | Acc]
        end,
        [],
        GroupedByChannel
    ),

    #{
        <<"guild_id">> => GuildId,
        <<"guild_name">> => GuildName,
        <<"guild_icon">> => GuildIcon,
        <<"channels">> => ChannelList
    }.

format_call_voice_data(CallData) ->
    #{
        channel_id := ChannelId,
        voice_states := VoiceStates
    } = CallData,
    #{
        <<"channel_id">> => ChannelId,
        <<"voice_states">> => lists:map(fun format_voice_state/1, VoiceStates)
    }.

build_channel_name_map(Channels) when is_list(Channels) ->
    lists:foldl(
        fun(Channel, Acc) when is_map(Channel) ->
            Id = type_conv:to_binary(maps:get(<<"id">>, Channel, <<>>)),
            Name = maps:get(<<"name">>, Channel, Id),
            maps:put(Id, Name, Acc);
           (_, Acc) -> Acc
        end,
        #{},
        Channels
    );
build_channel_name_map(_) ->
    #{}.

format_voice_state(VoiceState) ->
    #{
        <<"user_id">> => to_bin(maps:get(<<"user_id">>, VoiceState, <<>>)),
        <<"channel_id">> => to_bin(maps:get(<<"channel_id">>, VoiceState, <<>>)),
        <<"guild_id">> => to_bin(maps:get(<<"guild_id">>, VoiceState, <<>>)),
        <<"connection_id">> => maps:get(<<"connection_id">>, VoiceState, <<>>),
        <<"self_mute">> => maps:get(<<"self_mute">>, VoiceState, false),
        <<"self_deaf">> => maps:get(<<"self_deaf">>, VoiceState, false),
        <<"self_video">> => maps:get(<<"self_video">>, VoiceState, false),
        <<"self_stream">> => maps:get(<<"self_stream">>, VoiceState, false),
        <<"mute">> => maps:get(<<"mute">>, VoiceState, false),
        <<"deaf">> => maps:get(<<"deaf">>, VoiceState, false),
        <<"is_mobile">> => maps:get(<<"is_mobile">>, VoiceState, false),
        <<"platform">> => maps:get(<<"platform">>, VoiceState, <<"web">>)
    }.

to_bin(V) when is_integer(V) -> integer_to_binary(V);
to_bin(V) when is_binary(V) -> V;
to_bin(_) -> <<>>.
