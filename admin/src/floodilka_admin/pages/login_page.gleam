//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/components/layout
import floodilka_admin/components/ui
import floodilka_admin/web.{type Context, href}
import gleam/option.{type Option, None, Some}
import lustre/attribute as a
import lustre/element
import lustre/element/html as h
import wisp.{type Response}

pub fn view(ctx: Context, error: Option(String)) -> Response {
  let html =
    h.html([a.attribute("lang", "en")], [
      layout.build_head("Вход в админку", ctx),
      h.body(
        [
          a.class(
            "min-h-screen bg-neutral-50 flex items-center justify-center p-4",
          ),
        ],
        [
          h.div([a.class("w-full max-w-sm")], [
            h.div(
              [
                a.class(
                  "bg-white border border-neutral-200 rounded-lg p-8 space-y-6",
                ),
              ],
              [
                h.h1(
                  [a.class("text-xl text-sm font-medium text-neutral-900 mb-6")],
                  [
                    element.text("Вход в админку"),
                  ],
                ),
                case error {
                  Some(msg) ->
                    h.div(
                      [
                        a.class(
                          "bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm",
                        ),
                      ],
                      [element.text(msg)],
                    )
                  None -> element.none()
                },
                h.a([href(ctx, "/auth/start")], [
                  ui.button(
                    "Войти через Флудилку",
                    "button",
                    ui.Primary,
                    ui.Medium,
                    ui.Full,
                    [],
                  ),
                ]),
              ],
            ),
          ]),
        ],
      ),
      element.none(),
    ])

  wisp.html_response(element.to_document_string(html), 200)
}
