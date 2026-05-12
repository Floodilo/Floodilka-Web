//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import gleam/http/response.{type Response}
import gleam/list
import gleam/result
import gleam/string
import wisp

pub fn add_cache_headers(res: Response(wisp.Body)) -> Response(wisp.Body) {
  case list.key_find(res.headers, "cache-control") {
    Ok(_) -> res
    Error(_) -> {
      let content_type =
        list.key_find(res.headers, "content-type")
        |> result.unwrap("")

      let cache_header = case should_cache(content_type) {
        True -> "public, max-age=31536000, immutable"
        False -> "no-cache"
      }

      response.set_header(res, "cache-control", cache_header)
    }
  }
}

fn should_cache(content_type: String) -> Bool {
  let cacheable_types = [
    "text/css", "application/javascript", "font/", "image/", "video/", "audio/",
    "application/font-woff2",
  ]

  list.any(cacheable_types, fn(type_prefix) {
    string.starts_with(content_type, type_prefix)
  })
}
