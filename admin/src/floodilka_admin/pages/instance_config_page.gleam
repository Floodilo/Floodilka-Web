//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/acl
import floodilka_admin/api/common
import floodilka_admin/api/instance_config
import floodilka_admin/components/errors
import floodilka_admin/components/flash
import floodilka_admin/components/layout
import floodilka_admin/components/ui
import floodilka_admin/constants
import floodilka_admin/pages/instance_config_sections as sections
import floodilka_admin/web.{type Context, type Session}
import gleam/list
import gleam/option
import gleam/result
import lustre/attribute as a
import lustre/element
import lustre/element/html as h
import wisp.{type Request, type Response}

pub fn view(
  ctx: Context,
  session: Session,
  current_admin: option.Option(common.UserLookupResult),
  flash_data: option.Option(flash.Flash),
) -> Response {
  let result = instance_config.get_instance_config(ctx, session)
  let reservation_view_acl = case current_admin {
    option.Some(admin) ->
      acl.has_permission(
        admin.acls,
        constants.acl_instance_snowflake_reservation_view,
      )
    option.None -> False
  }
  let reservation_manage_acl = case current_admin {
    option.Some(admin) ->
      acl.has_permission(
        admin.acls,
        constants.acl_instance_snowflake_reservation_manage,
      )
    option.None -> False
  }

  let content = case result {
    Ok(config) -> {
      let base_children = [
        ui.heading_page("Конфигурация инстанса"),
        sections.render_config_form(ctx, config),
      ]

      case reservation_view_acl {
        True ->
          case instance_config.list_snowflake_reservations(ctx, session) {
            Ok(reservations) -> {
              let children =
                list.append(base_children, [
                  sections.render_snowflake_reservation_section(
                    ctx,
                    reservations,
                    reservation_manage_acl,
                  ),
                ])
              h.div([a.class("space-y-6")], children)
            }
            Error(err) -> errors.error_view(err)
          }
        False -> h.div([a.class("space-y-6")], base_children)
      }
    }
    Error(err) -> errors.error_view(err)
  }

  let html =
    layout.page(
      "Конфигурация инстанса",
      "instance-config",
      ctx,
      session,
      current_admin,
      flash_data,
      content,
    )
  wisp.html_response(element.to_document_string(html), 200)
}

pub fn handle_action(
  req: Request,
  ctx: Context,
  session: Session,
  action_name: String,
) -> Response {
  case action_name {
    "update" -> handle_update(req, ctx, session)
    "add-reservation" -> handle_add_snowflake_reservation(req, ctx, session)
    "delete-reservation" ->
      handle_delete_snowflake_reservation(req, ctx, session)
    _ -> flash.redirect_with_error(ctx, "/instance-config", "Неизвестное действие")
  }
}

fn handle_update(req: Request, ctx: Context, session: Session) -> Response {
  use form_data <- wisp.require_form(req)

  let registration_alerts_webhook_url =
    list.key_find(form_data.values, "registration_alerts_webhook_url")
    |> result.unwrap("")

  let system_alerts_webhook_url =
    list.key_find(form_data.values, "system_alerts_webhook_url")
    |> result.unwrap("")

  case
    instance_config.update_instance_config(
      ctx,
      session,
      registration_alerts_webhook_url,
      system_alerts_webhook_url,
    )
  {
    Ok(_) ->
      flash.redirect_with_success(
        ctx,
        "/instance-config",
        "Конфигурация обновлена",
      )
    Error(_) ->
      flash.redirect_with_error(
        ctx,
        "/instance-config",
        "Не удалось обновить конфигурацию",
      )
  }
}

fn handle_add_snowflake_reservation(
  req: Request,
  ctx: Context,
  session: Session,
) -> Response {
  use form_data <- wisp.require_form(req)

  let email =
    list.key_find(form_data.values, "reservation_email")
    |> result.unwrap("")

  let snowflake =
    list.key_find(form_data.values, "reservation_snowflake")
    |> result.unwrap("")

  case email == "" {
    True ->
      flash.redirect_with_error(
        ctx,
        "/instance-config",
        "Email и Snowflake ID обязательны.",
      )
    False ->
      case snowflake == "" {
        True ->
          flash.redirect_with_error(
            ctx,
            "/instance-config",
            "Email и Snowflake ID обязательны.",
          )
        False ->
          case
            instance_config.add_snowflake_reservation(
              ctx,
              session,
              email,
              snowflake,
            )
          {
            Ok(_) ->
              flash.redirect_with_success(
                ctx,
                "/instance-config",
                "Резервация добавлена.",
              )
            Error(_) ->
              flash.redirect_with_error(
                ctx,
                "/instance-config",
                "Не удалось добавить резервацию.",
              )
          }
      }
  }
}

fn handle_delete_snowflake_reservation(
  req: Request,
  ctx: Context,
  session: Session,
) -> Response {
  use form_data <- wisp.require_form(req)

  let email =
    list.key_find(form_data.values, "reservation_email")
    |> result.unwrap("")

  case email == "" {
    True ->
      flash.redirect_with_error(
        ctx,
        "/instance-config",
        "Email резервации обязателен.",
      )
    False ->
      case instance_config.delete_snowflake_reservation(ctx, session, email) {
        Ok(_) ->
          flash.redirect_with_success(
            ctx,
            "/instance-config",
            "Резервация удалена.",
          )
        Error(_) ->
          flash.redirect_with_error(
            ctx,
            "/instance-config",
            "Не удалось удалить резервацию.",
          )
      }
  }
}
