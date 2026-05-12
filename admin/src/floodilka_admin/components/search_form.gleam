//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/components/ui
import floodilka_admin/web.{type Context, href}
import gleam/list
import gleam/option.{type Option}
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn search_form(
  ctx: Context,
  query: Option(String),
  placeholder: String,
  help_text: Option(String),
  clear_url: String,
  additional_filters: List(element.Element(a)),
) -> element.Element(a) {
  ui.card(ui.PaddingSmall, [
    h.form([a.method("get"), a.class("flex flex-col gap-4")], [
      case list.is_empty(additional_filters) {
        True ->
          h.div([a.class("flex gap-2")], [
            h.input([
              a.type_("text"),
              a.name("q"),
              a.value(option.unwrap(query, "")),
              a.placeholder(placeholder),
              a.class(
                "flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
              ),
              a.attribute("autocomplete", "off"),
            ]),
            ui.button_primary("Поиск", "submit", []),
            h.a(
              [
                href(ctx, clear_url),
                a.class(
                  "px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors",
                ),
              ],
              [element.text("Очистить")],
            ),
          ])
        False ->
          h.div([a.class("flex flex-col gap-4")], [
            h.div([a.class("flex gap-2")], [
              h.input([
                a.type_("text"),
                a.name("q"),
                a.value(option.unwrap(query, "")),
                a.placeholder(placeholder),
                a.class(
                  "flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
                ),
                a.attribute("autocomplete", "off"),
              ]),
            ]),
            h.div(
              [a.class("grid grid-cols-1 md:grid-cols-4 gap-4")],
              additional_filters,
            ),
            h.div([a.class("flex gap-2")], [
              ui.button_primary("Поиск", "submit", []),
              h.a(
                [
                  href(ctx, clear_url),
                  a.class(
                    "px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors",
                  ),
                ],
                [element.text("Очистить")],
              ),
            ]),
          ])
      },
      case help_text {
        option.Some(text) ->
          h.p([a.class("text-xs text-neutral-500")], [element.text(text)])
        option.None -> element.none()
      },
    ]),
  ])
}
