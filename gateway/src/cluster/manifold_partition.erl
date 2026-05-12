%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

%% @doc Receiver-side partition worker for manifold fan-out.
%%
%% One process per partition per node. Receives `{forward, Pids, Msg}`
%% from manifold:send/2 (local or remote) and runs the actual local
%% Pid ! Msg loop. Splitting receivers across NUM_PARTITIONS workers
%% lets multiple concurrent broadcasts proceed in parallel on
%% schedulers_online cores instead of serialising through one mailbox.
%%
%% Each delivery uses [noconnect, nosuspend] so a stuck receiver can't
%% block this worker — undeliverable messages are silently dropped, the
%% same semantics as gen_server:cast.
%%
%% No internal state; we only need a process to own a registered name
%% and a mailbox.

-module(manifold_partition).
-behaviour(gen_server).

-export([start_link/1]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-record(state, {
    index :: non_neg_integer(),
    delivered = 0 :: non_neg_integer()
}).

-spec start_link(non_neg_integer()) -> {ok, pid()} | {error, term()}.
start_link(Index) ->
    Name = manifold:partition_name(Index),
    gen_server:start_link({local, Name}, ?MODULE, [Index], []).

-spec init([non_neg_integer()]) -> {ok, #state{}}.
init([Index]) ->
    process_flag(trap_exit, true),
    process_flag(message_queue_data, off_heap),
    {ok, #state{index = Index}}.

handle_call(get_stats, _From, #state{index = Idx, delivered = N} = State) ->
    {reply, #{partition => Idx, delivered => N}, State};
handle_call(_Req, _From, State) ->
    {reply, ok, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info({forward, Pids, Msg}, #state{delivered = N} = State) ->
    deliver(Pids, Msg),
    {noreply, State#state{delivered = N + length(Pids)}};
handle_info(_Info, State) ->
    {noreply, State}.

terminate(_Reason, _State) -> ok.
code_change(_OldVsn, State, _Extra) -> {ok, State}.

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec deliver([pid()], term()) -> ok.
deliver([], _Msg) -> ok;
deliver([Pid | Rest], Msg) ->
    erlang:send(Pid, Msg, [noconnect, nosuspend]),
    deliver(Rest, Msg).
