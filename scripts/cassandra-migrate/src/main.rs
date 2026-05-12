/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

use anyhow::Result;
use clap::{Parser, Subcommand};
use std::env;

mod migrate;

fn get_env_or_default(key: &str, default: &str) -> String {
    env::var(key).unwrap_or_else(|_| default.to_string())
}

#[derive(Parser)]
#[command(name = "cassandra-migrate")]
#[command(about = "Forward-only Cassandra migration tool for Floodilka", long_about = Some("A simple, forward-only migration tool for Cassandra.\nMigrations are stored in floodilka_devops/cassandra/migrations.\nMigration metadata is stored in the 'floodilka' keyspace."))]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(long, default_value_t = get_env_or_default("CASSANDRA_HOST", "localhost"))]
    host: String,

    #[arg(long, default_value = "9042")]
    port: u16,

    #[arg(long, default_value_t = get_env_or_default("CASSANDRA_USERNAME", "cassandra"))]
    username: String,

    #[arg(long, default_value_t = get_env_or_default("CASSANDRA_PASSWORD", "cassandra"))]
    password: String,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a new migration file
    Create {
        /// Name of the migration
        name: String,
    },
    /// Validate all migration files
    Check,
    /// Run pending migrations
    Up,
    /// Acknowledge a failed migration to skip it
    Ack {
        /// Filename of the migration to acknowledge
        filename: String,
    },
    /// Show migration status
    Status,
    /// Test Cassandra connection
    Test,
    /// Debug Cassandra connection
    Debug,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Create { name } => {
            migrate::create_migration(&name)?;
        }
        Commands::Check => {
            migrate::check_migrations()?;
        }
        Commands::Up => {
            migrate::run_migrations(&cli.host, cli.port, &cli.username, &cli.password).await?;
        }
        Commands::Ack { filename } => {
            migrate::acknowledge_migration(
                &cli.host,
                cli.port,
                &cli.username,
                &cli.password,
                &filename,
            )
            .await?;
        }
        Commands::Status => {
            migrate::show_status(&cli.host, cli.port, &cli.username, &cli.password).await?;
        }
        Commands::Test => {
            migrate::test_connection(&cli.host, cli.port, &cli.username, &cli.password).await?;
        }
        Commands::Debug => {
            migrate::debug_connection(&cli.host, cli.port, &cli.username, &cli.password).await?;
        }
    }

    Ok(())
}
