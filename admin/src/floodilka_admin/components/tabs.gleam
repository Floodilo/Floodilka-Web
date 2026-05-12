//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/web.{type Context, href}
import gleam/list
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub type Tab {
  Tab(label: String, path: String, active: Bool)
}

pub fn render_tabs(ctx: Context, tabs: List(Tab)) -> element.Element(a) {
  h.div([a.class("border-b border-neutral-200 mb-6")], [
    h.nav(
      [a.class("flex gap-6 overflow-x-auto no-scrollbar -mb-px px-1")],
      list.map(tabs, fn(tab) { render_tab(ctx, tab) }),
    ),
  ])
}

fn render_tab(ctx: Context, tab: Tab) -> element.Element(a) {
  let class_active = case tab.active {
    True ->
      "border-b-2 border-neutral-900 text-neutral-900 text-sm pb-3 whitespace-nowrap"
    False ->
      "border-b-2 border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 text-sm pb-3 transition-colors whitespace-nowrap"
  }

  h.a([href(ctx, tab.path), a.class(class_active)], [element.text(tab.label)])
}
