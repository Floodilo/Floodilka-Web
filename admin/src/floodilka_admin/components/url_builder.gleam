//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import gleam/list
import gleam/option.{type Option}
import gleam/string
import gleam/uri

pub fn build_url(
  base: String,
  params: List(#(String, Option(String))),
) -> String {
  let filtered_params =
    params
    |> list.filter_map(fn(param) {
      let #(key, value_opt) = param
      case value_opt {
        option.Some(value) -> {
          let trimmed = string.trim(value)
          case trimmed {
            "" -> Error(Nil)
            v -> Ok(#(key, v))
          }
        }
        option.None -> Error(Nil)
      }
    })

  case filtered_params {
    [] -> base
    params -> {
      let query_string =
        params
        |> list.map(fn(pair) {
          let #(key, value) = pair
          key <> "=" <> uri.percent_encode(value)
        })
        |> string.join("&")
      base <> "?" <> query_string
    }
  }
}
