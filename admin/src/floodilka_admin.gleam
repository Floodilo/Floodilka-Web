//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/config
import floodilka_admin/middleware/cache_middleware
import floodilka_admin/router
import floodilka_admin/web.{type Context, Context, normalize_base_path}
import gleam/erlang/process
import mist
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()

  let assert Ok(cfg) = config.load_config()

  let base_path = normalize_base_path(cfg.base_path)

  let ctx =
    Context(
      api_endpoint: cfg.api_endpoint,
      oauth_client_id: cfg.oauth_client_id,
      oauth_client_secret: cfg.oauth_client_secret,
      oauth_redirect_uri: cfg.oauth_redirect_uri,
      secret_key_base: cfg.secret_key_base,
      static_directory: "priv/static",
      media_endpoint: cfg.media_endpoint,
      cdn_endpoint: cfg.cdn_endpoint,
      asset_version: cfg.build_timestamp,
      base_path: base_path,
      app_endpoint: cfg.admin_endpoint,
      web_app_endpoint: cfg.web_app_endpoint,
      metrics_endpoint: cfg.metrics_endpoint,
    )

  let assert Ok(_) =
    wisp_mist.handler(handle_request(_, ctx), cfg.secret_key_base)
    |> mist.new
    |> mist.bind("0.0.0.0")
    |> mist.port(cfg.port)
    |> mist.start

  process.sleep_forever()
}

fn handle_request(req: wisp.Request, ctx: Context) -> wisp.Response {
  let static_dir = ctx.static_directory

  case wisp.path_segments(req) {
    ["static", ..] -> {
      use <- wisp.serve_static(req, under: "/static", from: static_dir)
      router.handle_request(req, ctx)
    }
    _ -> router.handle_request(req, ctx)
  }
  |> cache_middleware.add_cache_headers
}
