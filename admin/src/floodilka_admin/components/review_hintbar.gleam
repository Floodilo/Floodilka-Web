//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import gleam/option
import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn view(
  left_key: String,
  left_label: String,
  right_key: String,
  right_label: String,
  exit_key: String,
  exit_label: String,
  note: option.Option(String),
) {
  let note_element = case note {
    option.Some(text) ->
      h.div([a.class("body-sm text-neutral-600")], [element.text(text)])
    option.None -> element.none()
  }

  h.div(
    [
      a.class(
        "review-hintbar mt-6 p-4 bg-neutral-50 border-t border-neutral-200",
      ),
    ],
    [
      h.div([a.class("max-w-7xl mx-auto flex items-center justify-between")], [
        h.div([a.class("flex gap-6 items-center")], [
          h.div([a.class("flex items-center gap-2")], [
            h.span(
              [
                a.class(
                  "review-kbd px-2 py-1 bg-white border border-neutral-300 rounded text-xs",
                ),
              ],
              [element.text(left_key)],
            ),
            h.span([a.class("body-sm text-neutral-700")], [
              element.text(left_label),
            ]),
          ]),
          h.div([a.class("flex items-center gap-2")], [
            h.span(
              [
                a.class(
                  "review-kbd px-2 py-1 bg-white border border-neutral-300 rounded text-xs",
                ),
              ],
              [element.text(right_key)],
            ),
            h.span([a.class("body-sm text-neutral-700")], [
              element.text(right_label),
            ]),
          ]),
          h.div([a.class("flex items-center gap-2")], [
            h.span(
              [
                a.class(
                  "review-kbd px-2 py-1 bg-white border border-neutral-300 rounded text-xs",
                ),
              ],
              [element.text(exit_key)],
            ),
            h.span([a.class("body-sm text-neutral-700")], [
              element.text(exit_label),
            ]),
          ]),
        ]),
        note_element,
      ]),
    ],
  )
}
