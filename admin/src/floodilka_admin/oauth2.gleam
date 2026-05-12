//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/web.{type Context}
import gleam/bit_array
import gleam/crypto

pub fn authorize_url(ctx: Context, state: String) -> String {
  ctx.web_app_endpoint
  <> "/oauth2/authorize?response_type=code&client_id="
  <> ctx.oauth_client_id
  <> "&redirect_uri="
  <> ctx.oauth_redirect_uri
  <> "&scope=identify%20email"
  <> "&state="
  <> state
}

pub fn base64_encode_string(value: String) -> String {
  value
  |> bit_array.from_string
  |> bit_array.base64_encode(True)
}

pub fn generate_state() -> String {
  crypto.strong_random_bytes(32)
  |> bit_array.base64_url_encode(False)
}
