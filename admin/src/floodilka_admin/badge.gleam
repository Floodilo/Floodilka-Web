//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import gleam/int
import gleam/list

pub type Badge {
  Badge(name: String, icon: String)
}

const flag_staff = 1

const flag_ctp_member = 2

const flag_partner = 4

const flag_bug_hunter = 8

pub fn get_user_badges(cdn_endpoint: String, flags: String) -> List(Badge) {
  case int.parse(flags) {
    Ok(flags_int) -> {
      []
      |> add_badge_if_has_flag(
        flags_int,
        flag_staff,
        Badge("Staff", cdn_endpoint <> "/badges/staff.svg"),
      )
      |> add_badge_if_has_flag(
        flags_int,
        flag_ctp_member,
        Badge("CTP Member", cdn_endpoint <> "/badges/ctp.svg"),
      )
      |> add_badge_if_has_flag(
        flags_int,
        flag_partner,
        Badge("Partner", cdn_endpoint <> "/badges/partner.svg"),
      )
      |> add_badge_if_has_flag(
        flags_int,
        flag_bug_hunter,
        Badge("Bug Hunter", cdn_endpoint <> "/badges/bug-hunter.svg"),
      )
      |> list.reverse
    }
    Error(_) -> []
  }
}

fn add_badge_if_has_flag(
  badges: List(Badge),
  flags: Int,
  flag: Int,
  badge: Badge,
) -> List(Badge) {
  case int.bitwise_and(flags, flag) == flag {
    True -> [badge, ..badges]
    False -> badges
  }
}
