%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%%
%% This file is part of Floodilka, a fork of Fluxer
%% (https://github.com/fluxerapp/fluxer).
%% Modified by Floodilka Contributors starting March 2026.
%%
%% Floodilka is free software: you can redistribute it and/or modify
%% it under the terms of the GNU Affero General Public License as published by
%% the Free Software Foundation, either version 3 of the License, or
%% (at your option) any later version.
%%
%% Floodilka is distributed in the hope that it will be useful,
%% but WITHOUT ANY WARRANTY; without even the implied warranty of
%% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
%% GNU Affero General Public License for more details.
%%
%% You should have received a copy of the GNU Affero General Public License
%% along with Floodilka. If not, see <https://www.gnu.org/licenses/>.

%% @doc Batched cluster-wide fan-out, modeled on Discord's Manifold.
%%
%% Discord-pattern step 5b. Naive fan-out — `[Pid ! Msg || Pid <- Pids]`
%% with thousands of remote pids — sends one inter-node message per pid,
%% saturates the inter-node TCP buffer, and pegs the sender's mailbox.
%% Manifold groups pids by destination node and sends a single message
%% per (node, partition) pair carrying the full pid list; the receiving
%% partition worker then does the local Pid ! Msg loop. Net effect: O(N
%% local sends + 1 wire message per remote node × NUM_PARTITIONS),
%% instead of O(N wire messages).
%%
%% Partitions exist for the receiving side only — they parallelise local
%% delivery across schedulers so a single broadcast doesn't queue
%% behind itself. Source-side grouping is just `phash2(Pid, NUM)`.
%%
%% send/2 vs cast/2:
%%   send/2  — raw `Pid ! Msg`. Use when receivers expect any term.
%%   cast/2  — wraps the term as `{'$gen_cast', Msg}`, exactly what a
%%             gen_server's handle_cast/2 receives. Equivalent of
%%             `[gen_server:cast(P, Msg) || P <- Pids]` but batched.

-module(manifold).

-export([
    send/2,
    cast/2,
    partitions/0,
    partition_name/1
]).

-define(NUM_PARTITIONS, 8).

-spec partitions() -> pos_integer().
partitions() -> ?NUM_PARTITIONS.

-spec partition_name(non_neg_integer()) -> atom().
partition_name(Idx) when is_integer(Idx), Idx >= 0, Idx < ?NUM_PARTITIONS ->
    list_to_atom("floodilka_mfp_" ++ integer_to_list(Idx)).

-spec send([pid()], term()) -> ok.
send(Pids, Msg) ->
    deliver(Pids, Msg, raw).

-spec cast([pid()], term()) -> ok.
cast(Pids, Msg) ->
    deliver(Pids, {'$gen_cast', Msg}, raw).

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec deliver([pid()], term(), raw) -> ok.
deliver([], _Msg, _Mode) ->
    ok;
deliver(Pids, Msg, raw) ->
    Grouped = group_by_node_partition(Pids),
    maps:foreach(
        fun({Node, Partition}, BatchPids) ->
            forward(Node, Partition, BatchPids, Msg)
        end,
        Grouped
    ),
    ok.

-spec group_by_node_partition([pid()]) -> #{{node(), non_neg_integer()} => [pid()]}.
group_by_node_partition(Pids) ->
    lists:foldl(
        fun(Pid, Acc) when is_pid(Pid) ->
            Key = {node(Pid), erlang:phash2(Pid, ?NUM_PARTITIONS)},
            maps:update_with(Key, fun(L) -> [Pid | L] end, [Pid], Acc);
           (_, Acc) -> Acc
        end,
        #{},
        Pids
    ).

-spec forward(node(), non_neg_integer(), [pid()], term()) -> ok.
forward(Node, PartitionIdx, BatchPids, Msg) ->
    Name = partition_name(PartitionIdx),
    Dest =
        case Node =:= node() of
            true -> Name;
            false -> {Name, Node}
        end,
    erlang:send(Dest, {forward, BatchPids, Msg}, [noconnect, nosuspend]),
    ok.
