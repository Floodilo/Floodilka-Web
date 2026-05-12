//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import gleam/int
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn range_slider_section(
  slider_id: String,
  value_id: String,
  min_value: Int,
  max_value: Int,
  current_value: Int,
) {
  [
    h.input([
      a.id(slider_id),
      a.type_("range"),
      a.name("count"),
      a.min(int.to_string(min_value)),
      a.max(int.to_string(max_value)),
      a.value(int.to_string(current_value)),
      a.class("w-full h-2 bg-neutral-200 rounded-lg accent-neutral-900"),
    ]),
    h.div(
      [a.class("flex items-baseline justify-between text-xs text-neutral-500")],
      [
        h.span([], [element.text("Выбранное количество")]),
        h.span([a.id(value_id), a.class("font-semibold text-neutral-900")], [
          element.text(int.to_string(current_value)),
        ]),
      ],
    ),
  ]
}

pub fn slider_sync_script(
  slider_id: String,
  value_id: String,
) -> element.Element(a) {
  let script =
    "(function(){const slider=document.getElementById('"
    <> slider_id
    <> "');const value=document.getElementById('"
    <> value_id
    <> "');if(!slider||!value)return;const update=()=>value.textContent=slider.value;update();slider.addEventListener('input',update);})();"

  h.script([a.attribute("defer", "defer")], script)
}
