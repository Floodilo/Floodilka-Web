%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

%% @doc Cluster-wide presence pub/sub.
%%
%% Was a per-node sharded gen_server using local pg scopes; that broke at
%% replicas:3 because subscribers on one gateway node never saw publishes
%% from another (each node had its own isolated registry). Re-implemented
%% as a thin wrapper over the cluster-wide gateway_pg scope plus
%% manifold-batched fan-out, so subscribe / publish work transparently
%% regardless of which gateway node either side is on.
%%
%% Subscribe / unsubscribe always run with self() (caller is the
%% subscriber), which is local by construction and satisfies pg's
%% locality requirement. Publish reads pg:get_members across the cluster
%% and uses manifold:send/2 — receivers expect a raw {presence, UserId,
%% Payload} message, same shape as before.
%%
%% The gen_server is kept as a no-op placeholder so the supervisor child
%% spec keeps working without re-wiring. It can be removed in a follow-up
%% cleanup once nothing depends on its registered name.

-module(presence_bus).
-behaviour(gen_server).

-export([start_link/0, subscribe/1, unsubscribe/1, publish/2]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-spec start_link() -> {ok, pid()} | {error, term()}.
start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

-spec subscribe(integer()) -> ok.
subscribe(UserId) when is_integer(UserId) ->
    gateway_pg:join({presence_subscriber, UserId}, self()),
    ok.

-spec unsubscribe(integer()) -> ok.
unsubscribe(UserId) when is_integer(UserId) ->
    gateway_pg:leave({presence_subscriber, UserId}, self()),
    ok.

-spec publish(integer(), term()) -> ok.
publish(UserId, Payload) when is_integer(UserId) ->
    Subscribers = gateway_pg:members({presence_subscriber, UserId}),
    case Subscribers of
        [] -> ok;
        Pids -> manifold:send(Pids, {presence, UserId, Payload})
    end,
    ok.

%% ─── gen_server placeholder (kept to honour supervisor child spec) ─────────

init([]) ->
    process_flag(trap_exit, true),
    {ok, #{}}.

handle_call(_Req, _From, State) -> {reply, ok, State}.
handle_cast(_Msg, State) -> {noreply, State}.
handle_info(_Info, State) -> {noreply, State}.
terminate(_Reason, _State) -> ok.
code_change(_OldVsn, State, _Extra) -> {ok, State}.
