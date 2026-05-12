//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/api/common.{
  type ApiError, Forbidden, NetworkError, NotFound, ServerError, Unauthorized,
}
import floodilka_admin/web.{type Context, type Session}
import gleam/dynamic/decode
import gleam/http
import gleam/http/request
import gleam/httpc
import gleam/json
import gleam/option

pub type RefreshSearchIndexResponse {
  RefreshSearchIndexResponse(job_id: String)
}

pub type IndexRefreshStatus {
  IndexRefreshStatus(
    status: String,
    total: option.Option(Int),
    indexed: option.Option(Int),
    started_at: option.Option(String),
    completed_at: option.Option(String),
    error: option.Option(String),
  )
}

pub fn refresh_search_index(
  ctx: Context,
  session: Session,
  index_type: String,
  audit_log_reason: option.Option(String),
) -> Result(RefreshSearchIndexResponse, ApiError) {
  refresh_search_index_with_guild(
    ctx,
    session,
    index_type,
    option.None,
    audit_log_reason,
  )
}

pub fn refresh_search_index_with_guild(
  ctx: Context,
  session: Session,
  index_type: String,
  guild_id: option.Option(String),
  audit_log_reason: option.Option(String),
) -> Result(RefreshSearchIndexResponse, ApiError) {
  let fields = case guild_id {
    option.Some(id) -> [
      #("index_type", json.string(index_type)),
      #("guild_id", json.string(id)),
    ]
    option.None -> [#("index_type", json.string(index_type))]
  }
  let url = ctx.api_endpoint <> "/admin/search/refresh-index"
  let body = json.object(fields) |> json.to_string

  let assert Ok(req) = request.to(url)
  let req =
    req
    |> request.set_method(http.Post)
    |> request.set_header("authorization", "Bearer " <> session.access_token)
    |> request.set_header("content-type", "application/json")
    |> request.set_body(body)

  let req = case audit_log_reason {
    option.Some(reason) -> request.set_header(req, "x-audit-log-reason", reason)
    option.None -> req
  }

  case httpc.send(req) {
    Ok(resp) if resp.status == 200 -> {
      let decoder = {
        use job_id <- decode.field("job_id", decode.string)
        decode.success(RefreshSearchIndexResponse(job_id: job_id))
      }

      case json.parse(resp.body, decoder) {
        Ok(result) -> Ok(result)
        Error(_) -> Error(ServerError)
      }
    }
    Ok(resp) if resp.status == 401 -> Error(Unauthorized)
    Ok(resp) if resp.status == 403 -> {
      let message_decoder = {
        use message <- decode.field("message", decode.string)
        decode.success(message)
      }

      let message = case json.parse(resp.body, message_decoder) {
        Ok(msg) -> msg
        Error(_) ->
          "Missing required permissions. Contact an administrator to request access."
      }

      Error(Forbidden(message))
    }
    Ok(resp) if resp.status == 404 -> Error(NotFound)
    Ok(_resp) -> Error(ServerError)
    Error(_) -> Error(NetworkError)
  }
}

pub fn get_index_refresh_status(
  ctx: Context,
  session: Session,
  job_id: String,
) -> Result(IndexRefreshStatus, ApiError) {
  let fields = [#("job_id", json.string(job_id))]
  let url = ctx.api_endpoint <> "/admin/search/refresh-status"
  let body = json.object(fields) |> json.to_string

  let assert Ok(req) = request.to(url)
  let req =
    req
    |> request.set_method(http.Post)
    |> request.set_header("authorization", "Bearer " <> session.access_token)
    |> request.set_header("content-type", "application/json")
    |> request.set_body(body)

  case httpc.send(req) {
    Ok(resp) if resp.status == 200 -> {
      let decoder = {
        use status <- decode.field("status", decode.string)
        use total <- decode.optional_field(
          "total",
          option.None,
          decode.optional(decode.int),
        )
        use indexed <- decode.optional_field(
          "indexed",
          option.None,
          decode.optional(decode.int),
        )
        use started_at <- decode.optional_field(
          "started_at",
          option.None,
          decode.optional(decode.string),
        )
        use completed_at <- decode.optional_field(
          "completed_at",
          option.None,
          decode.optional(decode.string),
        )
        use error <- decode.optional_field(
          "error",
          option.None,
          decode.optional(decode.string),
        )
        decode.success(IndexRefreshStatus(
          status: status,
          total: total,
          indexed: indexed,
          started_at: started_at,
          completed_at: completed_at,
          error: error,
        ))
      }

      case json.parse(resp.body, decoder) {
        Ok(result) -> Ok(result)
        Error(_) -> Error(ServerError)
      }
    }
    Ok(resp) if resp.status == 401 -> Error(Unauthorized)
    Ok(resp) if resp.status == 403 -> {
      let message_decoder = {
        use message <- decode.field("message", decode.string)
        decode.success(message)
      }

      let message = case json.parse(resp.body, message_decoder) {
        Ok(msg) -> msg
        Error(_) ->
          "Missing required permissions. Contact an administrator to request access."
      }

      Error(Forbidden(message))
    }
    Ok(resp) if resp.status == 404 -> Error(NotFound)
    Ok(_resp) -> Error(ServerError)
    Error(_) -> Error(NetworkError)
  }
}
