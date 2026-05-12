//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/components/ui
import floodilka_admin/constants
import floodilka_admin/web.{type Context, action}
import gleam/int
import gleam/list
import gleam/option
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn render_features_form(
  ctx: Context,
  current_features: List(String),
  guild_id: String,
) {
  let all_features = constants.get_guild_features()

  let known_feature_values = list.map(all_features, fn(f) { f.value })
  let custom_features =
    list.filter(current_features, fn(f) {
      !list.contains(known_feature_values, f)
    })

  h.form(
    [
      a.method("POST"),
      action(
        ctx,
        "/guilds/" <> guild_id <> "?action=update-features&tab=features",
      ),
      a.id("features-form"),
    ],
    [
      h.div(
        [a.class("space-y-3")],
        list.map(all_features, fn(feature) {
          render_feature_checkbox(feature, current_features)
        }),
      ),
      h.div([a.class("mt-6 pt-6 border-t border-neutral-200")], [
        h.label([a.class("block")], [
          h.span([a.class("text-sm text-neutral-900 mb-2 block")], [
            element.text("Пользовательские функции"),
          ]),
          h.p([a.class("text-xs text-neutral-600 mb-2")], [
            element.text(
              "Введите пользовательские функции через запятую (например, CUSTOM_FEATURE_1, CUSTOM_FEATURE_2)",
            ),
          ]),
          h.input([
            a.type_("text"),
            a.name("custom_features"),
            a.placeholder("CUSTOM_FEATURE_1, CUSTOM_FEATURE_2"),
            a.value(
              list.fold(custom_features, "", fn(acc, f) {
                case acc {
                  "" -> f
                  _ -> acc <> ", " <> f
                }
              }),
            ),
            a.class(
              "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900",
            ),
            a.attribute(
              "onchange",
              "document.getElementById('features-save-button').classList.remove('hidden')",
            ),
          ]),
        ]),
      ]),
      h.div(
        [
          a.class("mt-6 pt-6 border-t border-neutral-200"),
          a.id("features-save-button"),
        ],
        [
          ui.button_primary("Сохранить", "submit", []),
        ],
      ),
    ],
  )
}

pub fn render_feature_checkbox(
  feature: constants.GuildFeature,
  current_features: List(String),
) {
  let is_checked = list.contains(current_features, feature.value)

  let onchange_script = case feature.value {
    "UNAVAILABLE_FOR_EVERYONE" ->
      "if(this.checked){const other=document.querySelector('input[value=\"UNAVAILABLE_FOR_EVERYONE_BUT_STAFF\"]');if(other)other.checked=false;}document.getElementById('features-save-button').classList.remove('hidden')"
    "UNAVAILABLE_FOR_EVERYONE_BUT_STAFF" ->
      "if(this.checked){const other=document.querySelector('input[value=\"UNAVAILABLE_FOR_EVERYONE\"]');if(other)other.checked=false;}document.getElementById('features-save-button').classList.remove('hidden')"
    _ ->
      "document.getElementById('features-save-button').classList.remove('hidden')"
  }
  ui.custom_checkbox(
    "features[]",
    feature.value,
    feature.value,
    is_checked,
    option.Some(onchange_script),
  )
}

pub fn render_disabled_operations_form(
  ctx: Context,
  current_disabled_operations: Int,
  guild_id: String,
) {
  let all_operations = constants.get_disabled_operations()

  h.form(
    [
      a.method("POST"),
      action(
        ctx,
        "/guilds/"
          <> guild_id
          <> "?action=update-disabled-operations&tab=settings",
      ),
      a.id("disabled-ops-form"),
    ],
    [
      h.div(
        [a.class("space-y-3")],
        list.map(all_operations, fn(operation) {
          render_disabled_operation_checkbox(
            operation,
            current_disabled_operations,
          )
        }),
      ),
      h.div(
        [
          a.class("mt-6 pt-6 border-t border-neutral-200 hidden"),
          a.id("disabled-ops-save-button"),
        ],
        [
          ui.button_primary("Сохранить", "submit", []),
        ],
      ),
    ],
  )
}

pub fn render_disabled_operation_checkbox(
  operation: constants.Flag,
  current_disabled_operations: Int,
) {
  let is_checked =
    int.bitwise_and(current_disabled_operations, operation.value)
    == operation.value

  ui.custom_checkbox(
    "disabled_operations[]",
    int.to_string(operation.value),
    operation.name,
    is_checked,
    option.Some(
      "document.getElementById('disabled-ops-save-button').classList.remove('hidden')",
    ),
  )
}
