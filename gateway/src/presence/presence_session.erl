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

-module(presence_session).

-export([
    handle_session_connect/3,
    handle_presence_update/2,
    dispatch_sessions_replace/1,
    notify_sessions_guild_join/2,
    notify_sessions_guild_leave/2,
    find_session_by_ref/2
]).

handle_session_connect(Request, Pid, State) ->
    #{session_id := SessionId, status := Status} = Request,
    Afk = maps:get(afk, Request, false),
    Mobile = maps:get(mobile, Request, false),
    SocketPid = maps:get(socket_pid, Request, undefined),
    Sessions = maps:get(sessions, State),

    case maps:is_key(SessionId, Sessions) of
        true ->
            SessionsData = presence_status:collect_sessions_for_replace(Sessions),
            {reply, {ok, SessionsData}, State};
        false ->
            Ref = monitor(process, Pid),
            SessionEntry = #{
                session_id => SessionId,
                status => Status,
                afk => Afk,
                mobile => Mobile,
                pid => Pid,
                mref => Ref,
                socket_pid => SocketPid
            },
            NewSessions = maps:put(SessionId, SessionEntry, Sessions),
            NewState = maps:put(sessions, NewSessions, State),

            UserId = maps:get(user_id, State),
            gateway_pg:join({user, UserId}, Pid),

            SessionsData = presence_status:collect_sessions_for_replace(NewSessions),
            {reply, {ok, SessionsData}, NewState}
    end.

handle_presence_update(Request, State) ->
    #{session_id := SessionId, status := Status} = Request,
    Afk = maps:get(afk, Request, false),
    Sessions = maps:get(sessions, State),

    case maps:get(SessionId, Sessions, undefined) of
        undefined ->
            {noreply, State};
        Session ->
            UpdatedSession = Session#{status => Status, afk => Afk},
            NewSessions = maps:put(SessionId, UpdatedSession, Sessions),
            NewState = maps:put(sessions, NewSessions, State),
            dispatch_sessions_replace(NewState),
            {noreply, NewState}
    end.

dispatch_sessions_replace(State) ->
    Sessions = maps:get(sessions, State),
    SessionsData = presence_status:collect_sessions_for_replace(Sessions),
    cast_to_session_pids(Sessions, {dispatch, sessions_replace, SessionsData}).

notify_sessions_guild_join(GuildId, State) ->
    Sessions = maps:get(sessions, State),
    cast_to_session_pids(Sessions, {guild_join, GuildId}).

notify_sessions_guild_leave(GuildId, State) ->
    Sessions = maps:get(sessions, State),
    cast_to_session_pids(Sessions, {guild_leave, GuildId}).

cast_to_session_pids(Sessions, Msg) ->
    Pids = [
        Pid
     || S <- maps:values(Sessions),
        (Pid = maps:get(pid, S, undefined)) =/= undefined,
        is_pid(Pid)
    ],
    case Pids of
        [] -> ok;
        _ -> manifold:cast(Pids, Msg)
    end.

find_session_by_ref(Ref, Sessions) ->
    maps:fold(
        fun(SessionId, S, Acc) ->
            case maps:get(mref, S) of
                Ref -> {ok, SessionId};
                _ -> Acc
            end
        end,
        not_found,
        Sessions
    ).
