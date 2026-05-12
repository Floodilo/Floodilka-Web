//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/api/common
import floodilka_admin/web.{type Context, href}
import gleam/option
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn error_view(error: common.ApiError) {
  h.div(
    [a.class("bg-red-50 border border-red-200 rounded-lg p-6 text-center")],
    [
      h.p([a.class("text-red-800 text-sm font-medium mb-2")], [
        element.text("Ошибка"),
      ]),
      h.p([a.class("text-red-600")], [
        element.text(case error {
          common.Unauthorized -> "Не авторизован"
          common.Forbidden(msg) -> "Доступ запрещён — " <> msg
          common.NotFound -> "Не найдено"
          common.ServerError -> "Ошибка сервера"
          common.NetworkError -> "Ошибка сети"
        }),
      ]),
    ],
  )
}

pub fn api_error_view(
  ctx: Context,
  err: common.ApiError,
  back_url: option.Option(String),
  back_label: option.Option(String),
) {
  let #(title, message) = case err {
    common.Unauthorized -> #(
      "Требуется авторизация",
      "Сессия истекла. Пожалуйста, войдите снова.",
    )
    common.Forbidden(msg) -> #("Доступ запрещён", msg)
    common.NotFound -> #("Не найдено", "Запрашиваемый ресурс не найден.")
    common.ServerError -> #(
      "Ошибка сервера",
      "Произошла внутренняя ошибка сервера. Попробуйте позже.",
    )
    common.NetworkError -> #(
      "Ошибка сети",
      "Не удалось подключиться к API. Попробуйте позже.",
    )
  }

  h.div([a.class("max-w-4xl mx-auto")], [
    h.div([a.class("bg-red-50 border border-red-200 rounded-lg p-8")], [
      h.div([a.class("flex items-start gap-4")], [
        h.div(
          [
            a.class(
              "flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center",
            ),
          ],
          [
            h.span([a.class("text-red-600 text-base font-semibold")], [
              element.text("!"),
            ]),
          ],
        ),
        h.div([a.class("flex-1")], [
          h.h2([a.class("text-base font-semibold text-red-900 mb-2")], [
            element.text(title),
          ]),
          h.p([a.class("text-red-700 mb-6")], [element.text(message)]),
          case back_url {
            option.Some(url) ->
              h.a(
                [
                  href(ctx, url),
                  a.class(
                    "inline-flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors",
                  ),
                ],
                [
                  h.span([a.class("text-lg")], [element.text("←")]),
                  element.text(option.unwrap(back_label, "Назад")),
                ],
              )
            option.None -> element.none()
          },
        ]),
      ]),
    ]),
  ])
}
