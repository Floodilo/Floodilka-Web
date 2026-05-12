//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn compact_info(label: String, value: String) {
  h.div([], [
    h.span([a.class("text-neutral-500")], [element.text(label <> ": ")]),
    h.span([a.class("text-neutral-900")], [element.text(value)]),
  ])
}

pub fn compact_info_mono(label: String, value: String) {
  h.div([], [
    h.span([a.class("text-neutral-500")], [element.text(label <> ": ")]),
    h.span([a.class("text-neutral-900")], [element.text(value)]),
  ])
}

pub fn compact_info_with_element(label: String, value: element.Element(a)) {
  h.div([], [
    h.span([a.class("text-neutral-500")], [element.text(label <> ": ")]),
    h.span([a.class("text-neutral-900")], [value]),
  ])
}

pub fn form_field(
  label: String,
  name: String,
  type_: String,
  placeholder: String,
  required: Bool,
  help: String,
) {
  h.div([a.class("space-y-1")], [
    h.label([a.class("text-sm text-neutral-700")], [
      element.text(label),
    ]),
    h.input([
      a.type_(type_),
      a.name(name),
      a.placeholder(placeholder),
      a.required(required),
      a.class(
        "w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900",
      ),
      case type_ == "number" {
        True -> a.attribute("step", "any")
        False -> a.class("")
      },
    ]),
    h.p([a.class("text-xs text-neutral-500")], [element.text(help)]),
  ])
}

pub fn form_field_with_value(
  label: String,
  name: String,
  type_: String,
  value: String,
  required: Bool,
  help: String,
) {
  h.div([a.class("space-y-1")], [
    h.label([a.class("text-sm text-neutral-700")], [
      element.text(label),
    ]),
    h.input([
      a.type_(type_),
      a.name(name),
      a.value(value),
      a.required(required),
      a.class(
        "w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900",
      ),
      case type_ == "number" {
        True -> a.attribute("step", "any")
        False -> a.class("")
      },
    ]),
    h.p([a.class("text-xs text-neutral-500")], [element.text(help)]),
  ])
}

pub fn info_item(label: String, value: String) {
  h.div([], [
    h.p([a.class("text-xs text-neutral-600")], [element.text(label)]),
    h.p([a.class("text-sm text-neutral-900")], [element.text(value)]),
  ])
}
