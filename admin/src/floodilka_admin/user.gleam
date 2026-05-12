//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import birl
import gleam/int
import gleam/list
import gleam/result
import gleam/string

const floodilka_epoch = 1_420_070_400_000

pub fn get_initials(username: String) -> String {
  case username {
    "" -> "?"
    _ -> {
      username
      |> string.to_graphemes
      |> list.first
      |> result.unwrap("?")
      |> string.uppercase
    }
  }
}

pub fn extract_timestamp(snowflake: String) -> Result(String, Nil) {
  case int.parse(snowflake) {
    Ok(id) -> {
      let timestamp_ms = int.bitwise_shift_right(id, 22) + floodilka_epoch

      let time = birl.from_unix_milli(timestamp_ms)

      Ok(format_human_readable(time))
    }
    Error(_) -> Error(Nil)
  }
}

fn format_human_readable(time: birl.Time) -> String {
  let datetime_string = birl.to_iso8601(time)

  case string.split(datetime_string, "T") {
    [date_part, time_part] -> {
      case string.split(date_part, "-") {
        [year, month, day] -> {
          let time_clean = case string.split(time_part, ".") {
            [hms, _] -> hms
            _ -> time_part
          }

          case string.split(time_clean, ":") {
            [hour, minute, _] -> {
              let month_name = case month {
                "01" -> "Jan"
                "02" -> "Feb"
                "03" -> "Mar"
                "04" -> "Apr"
                "05" -> "May"
                "06" -> "Jun"
                "07" -> "Jul"
                "08" -> "Aug"
                "09" -> "Sep"
                "10" -> "Oct"
                "11" -> "Nov"
                "12" -> "Dec"
                _ -> month
              }

              month_name
              <> " "
              <> day
              <> ", "
              <> year
              <> " at "
              <> hour
              <> ":"
              <> minute
            }
            _ -> datetime_string
          }
        }
        _ -> datetime_string
      }
    }
    _ -> datetime_string
  }
}
