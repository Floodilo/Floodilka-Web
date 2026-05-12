//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

@external(erlang, "io", "format")
fn erlang_io_format(fmt: String, args: List(String)) -> Nil

pub fn debug(msg: String) {
  erlang_io_format("[debug] " <> msg <> "\n", [])
}

pub fn info(msg: String) {
  erlang_io_format("[info] " <> msg <> "\n", [])
}

pub fn error(msg: String) {
  erlang_io_format("[error] " <> msg <> "\n", [])
}
