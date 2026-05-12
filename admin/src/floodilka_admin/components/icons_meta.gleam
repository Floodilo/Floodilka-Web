//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import lustre/attribute as a
import lustre/element.{type Element}
import lustre/element/html as h

pub fn build_icon_links(cdn_endpoint: String) -> List(Element(t)) {
  [
    h.link([
      a.rel("icon"),
      a.attribute("type", "image/x-icon"),
      a.href(cdn_endpoint <> "/web/favicon.ico"),
    ]),
    h.link([
      a.rel("apple-touch-icon"),
      a.href(cdn_endpoint <> "/web/apple-touch-icon.png"),
    ]),
    h.link([
      a.rel("icon"),
      a.attribute("type", "image/png"),
      a.attribute("sizes", "32x32"),
      a.href(cdn_endpoint <> "/web/favicon-32x32.png"),
    ]),
    h.link([
      a.rel("icon"),
      a.attribute("type", "image/png"),
      a.attribute("sizes", "16x16"),
      a.href(cdn_endpoint <> "/web/favicon-16x16.png"),
    ]),
  ]
}
