//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/constants
import gleam/list

pub fn has_permission(admin_acls: List(String), required_acl: String) -> Bool {
  list.contains(admin_acls, required_acl)
  || list.contains(admin_acls, constants.acl_wildcard)
}
