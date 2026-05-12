//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/api/common.{
  type ApiError, Forbidden, NetworkError, NotFound, ServerError, Unauthorized,
}
import floodilka_admin/web
import gleam/dynamic/decode
import gleam/http
import gleam/http/request
import gleam/httpc
import gleam/json

pub type GuildEmojiAsset {
  GuildEmojiAsset(
    id: String,
    name: String,
    animated: Bool,
    creator_id: String,
    media_url: String,
  )
}

pub type ListGuildEmojisResponse {
  ListGuildEmojisResponse(guild_id: String, emojis: List(GuildEmojiAsset))
}

pub type GuildStickerAsset {
  GuildStickerAsset(
    id: String,
    name: String,
    format_type: Int,
    creator_id: String,
    media_url: String,
  )
}

pub type ListGuildStickersResponse {
  ListGuildStickersResponse(guild_id: String, stickers: List(GuildStickerAsset))
}

pub fn list_guild_emojis(
  ctx: web.Context,
  session: web.Session,
  guild_id: String,
) -> Result(ListGuildEmojisResponse, ApiError) {
  let url = ctx.api_endpoint <> "/admin/guilds/" <> guild_id <> "/emojis"
  let assert Ok(req) = request.to(url)
  let req =
    req
    |> request.set_method(http.Get)
    |> request.set_header("authorization", "Bearer " <> session.access_token)

  case httpc.send(req) {
    Ok(resp) if resp.status == 200 -> {
      let emoji_decoder = {
        use id <- decode.field("id", decode.string)
        use name <- decode.field("name", decode.string)
        use animated <- decode.field("animated", decode.bool)
        use creator_id <- decode.field("creator_id", decode.string)
        use media_url <- decode.field("media_url", decode.string)
        decode.success(GuildEmojiAsset(
          id: id,
          name: name,
          animated: animated,
          creator_id: creator_id,
          media_url: media_url,
        ))
      }

      let decoder = {
        use guild_id <- decode.field("guild_id", decode.string)
        use emojis <- decode.field("emojis", decode.list(emoji_decoder))
        decode.success(ListGuildEmojisResponse(
          guild_id: guild_id,
          emojis: emojis,
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

pub fn list_guild_stickers(
  ctx: web.Context,
  session: web.Session,
  guild_id: String,
) -> Result(ListGuildStickersResponse, ApiError) {
  let url = ctx.api_endpoint <> "/admin/guilds/" <> guild_id <> "/stickers"
  let assert Ok(req) = request.to(url)
  let req =
    req
    |> request.set_method(http.Get)
    |> request.set_header("authorization", "Bearer " <> session.access_token)

  case httpc.send(req) {
    Ok(resp) if resp.status == 200 -> {
      let sticker_decoder = {
        use id <- decode.field("id", decode.string)
        use name <- decode.field("name", decode.string)
        use format_type <- decode.field("format_type", decode.int)
        use creator_id <- decode.field("creator_id", decode.string)
        use media_url <- decode.field("media_url", decode.string)
        decode.success(GuildStickerAsset(
          id: id,
          name: name,
          format_type: format_type,
          creator_id: creator_id,
          media_url: media_url,
        ))
      }

      let decoder = {
        use guild_id <- decode.field("guild_id", decode.string)
        use stickers <- decode.field("stickers", decode.list(sticker_decoder))
        decode.success(ListGuildStickersResponse(
          guild_id: guild_id,
          stickers: stickers,
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
