%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(presence_cache_shard).
-behaviour(gen_server).

-include_lib("floodilka_gateway/include/timeout_config.hrl").

-export([start_link/1, table_name/1, get_all_keys/1]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-type state() :: #{table := atom(), shard_index := non_neg_integer()}.

-define(TABLE_PREFIX, presence_cache).

-spec start_link(non_neg_integer()) -> {ok, pid()} | {error, term()}.
start_link(ShardIndex) ->
    gen_server:start_link(?MODULE, #{shard_index => ShardIndex}, []).

-spec init(map()) -> {ok, state()}.
init(#{shard_index := ShardIndex}) ->
    process_flag(trap_exit, true),
    TableName = table_name(ShardIndex),
    ensure_table(TableName),
    {ok, #{table => TableName, shard_index => ShardIndex}}.

-spec handle_call(term(), gen_server:from(), state()) -> {reply, term(), state()}.
handle_call({put, UserId, Presence}, _From, State) ->
    Table = maps:get(table, State),
    {reply, do_put(Table, UserId, Presence), State};
handle_call({delete, UserId}, _From, State) ->
    Table = maps:get(table, State),
    ets:delete(Table, UserId),
    {reply, ok, State};
handle_call({get, UserId}, _From, State) ->
    Table = maps:get(table, State),
    Reply =
        case catch ets:lookup(Table, UserId) of
            [{_, Presence}] -> {ok, Presence};
            _ -> not_found
        end,
    {reply, Reply, State};
handle_call({bulk_get, UserIds}, _From, State) ->
    Table = maps:get(table, State),
    Presences =
        lists:filtermap(
            fun(Uid) ->
                case catch ets:lookup(Table, Uid) of
                    [{_, Presence}] -> {true, Presence};
                    _ -> false
                end
            end,
            lists:usort(UserIds)
        ),
    {reply, Presences, State};
handle_call(_Request, _From, State) ->
    {reply, ok, State}.

-spec handle_cast(term(), state()) -> {noreply, state()}.
handle_cast(_Msg, State) ->
    {noreply, State}.

-spec handle_info(term(), state()) -> {noreply, state()}.
handle_info(_Info, State) ->
    {noreply, State}.

-spec terminate(term(), state()) -> ok.
terminate(_Reason, _State) ->
    ok.

-spec code_change(term(), term(), term()) -> {ok, state()}.
code_change(_OldVsn, State, _Extra) when is_map(State) ->
    {ok, State};
code_change(_OldVsn, {state, Table, ShardIndex}, _Extra) ->
    {ok, #{table => Table, shard_index => ShardIndex}}.

-spec do_put(atom(), integer(), map()) -> ok.
do_put(Table, UserId, Presence) ->
    Status = maps:get(<<"status">>, Presence, <<"offline">>),
    case Status of
        <<"invisible">> ->
            ets:delete(Table, UserId),
            ok;
        <<"offline">> ->
            ets:delete(Table, UserId),
            ok;
        _ ->
            ets:insert(Table, {UserId, Presence}),
            ok
    end.

-spec ensure_table(atom()) -> ok.
ensure_table(Table) ->
    case ets:info(Table) of
        undefined ->
            ets:new(Table, [named_table, public, set, {read_concurrency, true}]),
            ok;
        _ ->
            ok
    end.

-spec get_all_keys(atom()) -> [term()].
get_all_keys(Table) ->
    case catch ets:tab2list(Table) of
        List when is_list(List) -> [Key || {Key, _} <- List];
        _ -> []
    end.

-spec table_name(non_neg_integer()) -> atom().
table_name(Index) ->
    list_to_atom(atom_to_list(?TABLE_PREFIX) ++ "_" ++ integer_to_list(Index)).
