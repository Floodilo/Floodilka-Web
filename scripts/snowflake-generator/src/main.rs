/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

use clap::Parser;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const FLOODILKA_EPOCH: i64 = 1420070400000;

#[derive(Parser)]
#[command(name = "snowflake-generator")]
#[command(about = "Generates unique Floodilka snowflake IDs", long_about = None)]
struct Cli {
    /// Number of snowflakes to generate
    #[arg(long, short, default_value = "1")]
    count: usize,

    /// Optional Unix timestamp in milliseconds (defaults to current time)
    #[arg(long, short)]
    timestamp: Option<i64>,
}

fn generate_snowflake(timestamp: Option<i64>) -> i64 {
    let ts = match timestamp {
        Some(t) => t,
        None => SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64,
    };

    (ts - FLOODILKA_EPOCH) << 22
}

fn main() {
    let cli = Cli::parse();

    if cli.count < 1 {
        eprintln!("Error: count must be at least 1");
        std::process::exit(1);
    }

    if cli.count == 1 {
        let snowflake = generate_snowflake(cli.timestamp);
        println!("{snowflake}");
    } else {
        for _ in 0..cli.count {
            let snowflake = generate_snowflake(cli.timestamp);
            println!("{snowflake}");

            if cli.timestamp.is_none() {
                thread::sleep(Duration::from_millis(1));
            }
        }
    }
}
