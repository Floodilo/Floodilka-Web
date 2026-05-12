//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/api/common
import floodilka_admin/components/flash
import floodilka_admin/components/layout
import floodilka_admin/components/ui
import floodilka_admin/web.{type Context, type Session}
import gleam/option.{type Option}
import lustre/attribute as a
import lustre/element
import lustre/element/html as h
import wisp.{type Response}

pub fn view(
  ctx: Context,
  session: Session,
  current_admin: Option(common.UserLookupResult),
  flash_data: Option(flash.Flash),
) -> Response {
  let content =
    h.div([a.class("max-w-2xl mx-auto")], [
      ui.heading_page("Вы оказались в странном месте..."),
      ui.card(ui.PaddingMedium, [
        ui.stack("4", [
          h.p([a.class("text-neutral-700 leading-relaxed")], [
            element.text(
              "Ваш аккаунт авторизован, но для ваших текущих прав нет доступных разделов администрирования.",
            ),
          ]),
          h.p([a.class("text-neutral-600 leading-relaxed")], [
            element.text(
              "Если вы считаете, что это ошибка, обратитесь к администратору для получения необходимого доступа.",
            ),
          ]),
        ]),
      ]),
    ])

  let html =
    layout.page(
      "Странное место",
      "strange-place",
      ctx,
      session,
      current_admin,
      flash_data,
      content,
    )

  wisp.html_response(element.to_document_string(html), 200)
}
