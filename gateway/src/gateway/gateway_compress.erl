%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(gateway_compress).

-export([
    new_context/1,
    compress/2,
    decompress/2,
    parse_compression/1,
    close_context/1,
    get_type/1
]).

-type compression() :: none | zstd_stream.
-export_type([compression/0]).

-record(compress_ctx, {type :: compression()}).
-type compress_ctx() :: #compress_ctx{}.
-export_type([compress_ctx/0]).

-spec parse_compression(binary() | undefined) -> compression().
parse_compression(<<"none">>) -> none;
parse_compression(<<"zstd-stream">>) -> zstd_stream;
parse_compression(_) -> none.

-spec new_context(compression()) -> compress_ctx().
new_context(none) ->
    #compress_ctx{type = none};
new_context(zstd_stream) ->
    #compress_ctx{type = zstd_stream}.

-spec close_context(compress_ctx()) -> ok.
close_context(_Ctx) ->
    ok.

-spec get_type(compress_ctx()) -> compression().
get_type(#compress_ctx{type = Type}) ->
    Type.

-spec compress(iodata(), compress_ctx()) -> {ok, binary(), compress_ctx()} | {error, term()}.
compress(Data, Ctx = #compress_ctx{type = none}) ->
    {ok, iolist_to_binary(Data), Ctx};
compress(Data, Ctx = #compress_ctx{type = zstd_stream}) ->
    try
        Binary = iolist_to_binary(Data),
        case ezstd:compress(Binary, 3) of
            Compressed when is_binary(Compressed) ->
                {ok, Compressed, Ctx};
            {error, Reason} ->
                {error, {compress_failed, Reason}}
        end
    catch
        _:Exception ->
            {error, {compress_failed, Exception}}
    end.

-spec decompress(binary(), compress_ctx()) -> {ok, binary(), compress_ctx()} | {error, term()}.
decompress(Data, Ctx = #compress_ctx{type = none}) ->
    {ok, Data, Ctx};
decompress(Data, Ctx = #compress_ctx{type = zstd_stream}) ->
    try
        case ezstd:decompress(Data) of
            Decompressed when is_binary(Decompressed) ->
                {ok, Decompressed, Ctx};
            {error, Reason} ->
                {error, {decompress_failed, Reason}}
        end
    catch
        _:Exception ->
            {error, {decompress_failed, Exception}}
    end.

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

parse_compression_test() ->
    ?assertEqual(none, parse_compression(undefined)),
    ?assertEqual(none, parse_compression(<<>>)),
    ?assertEqual(zstd_stream, parse_compression(<<"zstd-stream">>)),
    ?assertEqual(none, parse_compression(<<"none">>)).

zstd_roundtrip_test() ->
    Ctx = new_context(zstd_stream),
    Data = <<"hello world, this is a test message for zstd compression">>,
    {ok, Compressed, Ctx2} = compress(Data, Ctx),
    ?assert(is_binary(Compressed)),
    {ok, Decompressed, _} = decompress(Compressed, Ctx2),
    ?assertEqual(Data, Decompressed),
    ok = close_context(Ctx2).

-endif.
