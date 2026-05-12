//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/acl
import floodilka_admin/api/guilds
import floodilka_admin/components/ui
import floodilka_admin/pages/guild_detail/forms
import floodilka_admin/web.{type Context}
import gleam/list
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn features_tab(
  ctx: Context,
  guild: guilds.GuildLookupResult,
  guild_id: String,
  admin_acls: List(String),
) {
  h.div([a.class("space-y-6")], [
    case acl.has_permission(admin_acls, "guild:update:features") {
      True ->
        ui.card(ui.PaddingMedium, [
          h.h2([a.class("text-base font-medium text-neutral-900 mb-4")], [
            element.text("Функции сервера"),
          ]),
          h.p([a.class("text-sm text-neutral-600 mb-4")], [
            element.text("Выберите функции для этого сервера."),
          ]),
          forms.render_features_form(ctx, guild.features, guild_id),
        ])
      False ->
        ui.card(ui.PaddingMedium, [
          ui.heading_card_with_margin("Функции сервера"),
          case list.is_empty(guild.features) {
            True ->
              h.p([a.class("text-sm text-neutral-600")], [
                element.text("Нет включённых функций"),
              ])
            False ->
              h.div([a.class("flex flex-wrap gap-2")], {
                list.map(guild.features, fn(feature) {
                  h.span(
                    [
                      a.class(
                        "px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded",
                      ),
                    ],
                    [element.text(feature)],
                  )
                })
              })
          },
        ])
    },
  ])
}
