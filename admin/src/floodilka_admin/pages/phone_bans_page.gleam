//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import floodilka_admin/api/common
import floodilka_admin/components/flash
import floodilka_admin/pages/ban_management_page
import floodilka_admin/web.{type Context, type Session}
import gleam/option
import wisp.{type Request, type Response}

pub fn view(
  ctx: Context,
  session: Session,
  current_admin: option.Option(common.UserLookupResult),
  flash_data: option.Option(flash.Flash),
) -> Response {
  ban_management_page.view(
    ctx,
    session,
    current_admin,
    flash_data,
    ban_management_page.PhoneBan,
  )
}

pub fn handle_action(
  req: Request,
  ctx: Context,
  session: Session,
  action: option.Option(String),
) -> Response {
  ban_management_page.handle_action(
    req,
    ctx,
    session,
    ban_management_page.PhoneBan,
    action,
  )
}
