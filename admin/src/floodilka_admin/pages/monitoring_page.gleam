//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
////
//// This file is part of Floodilka, a fork of Fluxer
//// (https://github.com/fluxerapp/fluxer).
//// Modified by Floodilka Contributors starting March 2026.
////
//// Floodilka is free software: you can redistribute it and/or modify
//// it under the terms of the GNU Affero General Public License as published by
//// the Free Software Foundation, either version 3 of the License, or
//// (at your option) any later version.
////
//// Floodilka is distributed in the hope that it will be useful,
//// but WITHOUT ANY WARRANTY; without even the implied warranty of
//// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//// GNU Affero General Public License for more details.
////
//// You should have received a copy of the GNU Affero General Public License
//// along with Floodilka. If not, see <https://www.gnu.org/licenses/>.

import floodilka_admin/api/common
import floodilka_admin/api/system
import floodilka_admin/components/flash
import floodilka_admin/components/layout
import floodilka_admin/components/ui
import floodilka_admin/web.{type Context, type Session}
import gleam/float
import gleam/int
import gleam/list
import gleam/option
import lustre/attribute as a
import lustre/element
import lustre/element/html as h
import wisp.{type Response}

pub fn view(
  ctx: Context,
  session: Session,
  current_admin: option.Option(common.UserLookupResult),
  flash_data: option.Option(flash.Flash),
) -> Response {
  let nodes_result = system.get_system_nodes(ctx, session)

  let content =
    h.div([], [
      ui.flex_row_between([
        ui.heading_page("Мониторинг серверов"),
        h.div([a.class("text-xs text-neutral-400")], [
          element.text("Автообновление каждые 10 сек"),
        ]),
      ]),
      case nodes_result {
        Ok(resp) ->
          case resp.source {
            "prometheus" -> render_nodes_table(resp.nodes)
            _ -> render_unavailable()
          }
        Error(_) -> render_error()
      },
    ])

  let html =
    layout.page_with_refresh(
      "Мониторинг серверов",
      "monitoring",
      ctx,
      session,
      current_admin,
      flash_data,
      content,
      True,
    )
  wisp.html_response(element.to_document_string(html), 200)
}

fn render_nodes_table(nodes: List(system.SystemNodeRow)) {
  let header_cell = fn(text) {
    h.th(
      [
        a.class(
          "px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider",
        ),
      ],
      [element.text(text)],
    )
  }

  h.div(
    [a.class("bg-white border border-neutral-200 rounded-lg shadow-sm mt-4")],
    [
      h.table([a.class("min-w-full divide-y divide-neutral-200")], [
        h.thead([a.class("bg-neutral-50")], [
          h.tr([], [
            header_cell("Нода"),
            header_cell("CPU"),
            header_cell("Память"),
            header_cell("Диск"),
            header_cell("Load 1m"),
            header_cell("Uptime"),
          ]),
        ]),
        h.tbody(
          [a.class("divide-y divide-neutral-100")],
          list.map(nodes, render_node_row),
        ),
      ]),
    ],
  )
}

fn render_node_row(node: system.SystemNodeRow) {
  let mem_pct = percent_of(node.memory_used_bytes, node.memory_total_bytes)
  let disk_pct = percent_of(node.disk_used_bytes, node.disk_total_bytes)
  let cpu_pct = float.round(node.cpu_usage_percent)

  h.tr([a.class("hover:bg-neutral-50")], [
    h.td([a.class("px-3 py-2 text-sm font-medium text-neutral-900")], [
      element.text(node.name),
    ]),
    h.td([a.class("px-3 py-2 text-sm")], [usage_bar(cpu_pct, percent_label(cpu_pct))]),
    h.td([a.class("px-3 py-2 text-sm")], [
      usage_bar(
        mem_pct,
        bytes_label(node.memory_used_bytes) <> " / " <> bytes_label(node.memory_total_bytes),
      ),
    ]),
    h.td([a.class("px-3 py-2 text-sm")], [
      usage_bar(
        disk_pct,
        bytes_label(node.disk_used_bytes) <> " / " <> bytes_label(node.disk_total_bytes),
      ),
    ]),
    h.td([a.class("px-3 py-2 text-sm text-neutral-700")], [
      element.text(float_to_string_2(node.load_avg1)),
    ]),
    h.td([a.class("px-3 py-2 text-sm text-neutral-500")], [
      element.text(uptime_label(node.uptime_seconds)),
    ]),
  ])
}

fn usage_bar(percent: Int, label: String) {
  let bar_color = case percent {
    p if p >= 80 -> "bg-red-500"
    p if p >= 60 -> "bg-yellow-500"
    _ -> "bg-green-500"
  }

  h.div([a.class("flex items-center gap-2 min-w-[180px]")], [
    h.div([a.class("flex-1 bg-neutral-200 rounded-full h-1.5")], [
      h.div(
        [
          a.class("h-1.5 rounded-full " <> bar_color),
          a.attribute("style", "width: " <> int.to_string(clamp_percent(percent)) <> "%"),
        ],
        [],
      ),
    ]),
    h.span([a.class("text-xs text-neutral-600 whitespace-nowrap")], [
      element.text(label),
    ]),
  ])
}

fn render_unavailable() {
  h.div(
    [
      a.class(
        "mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center",
      ),
    ],
    [
      h.p([a.class("text-yellow-800 text-sm")], [
        element.text(
          "Prometheus не настроен (FLOODILKA_PROMETHEUS_URL). Метрики кластера недоступны.",
        ),
      ]),
    ],
  )
}

fn render_error() {
  h.div(
    [
      a.class("mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center"),
    ],
    [
      h.p([a.class("text-red-800 text-sm")], [
        element.text("Не удалось получить метрики кластера."),
      ]),
    ],
  )
}

fn percent_of(used: Float, total: Float) -> Int {
  case total >. 0.0 {
    True -> float.round(used /. total *. 100.0)
    False -> 0
  }
}

fn clamp_percent(p: Int) -> Int {
  case p {
    n if n < 0 -> 0
    n if n > 100 -> 100
    n -> n
  }
}

fn percent_label(p: Int) -> String {
  int.to_string(clamp_percent(p)) <> "%"
}

fn bytes_label(bytes: Float) -> String {
  let one_gb = 1_073_741_824.0
  let one_mb = 1_048_576.0
  case bytes >=. one_gb {
    True -> float_to_string_1(bytes /. one_gb) <> " GB"
    False -> float_to_string_1(bytes /. one_mb) <> " MB"
  }
}

fn uptime_label(seconds: Int) -> String {
  let days = seconds / 86_400
  let hours = { seconds % 86_400 } / 3600
  case days {
    0 -> int.to_string(hours) <> "h"
    _ -> int.to_string(days) <> "d " <> int.to_string(hours) <> "h"
  }
}

fn float_to_string_1(value: Float) -> String {
  let rounded = float.round(value *. 10.0) |> int.to_float
  float.to_string(rounded /. 10.0)
}

fn float_to_string_2(value: Float) -> String {
  let rounded = float.round(value *. 100.0) |> int.to_float
  float.to_string(rounded /. 100.0)
}
