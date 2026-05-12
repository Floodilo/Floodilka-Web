/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

pub mod buffer;
mod migrations;
pub mod schemas;
pub mod storage;

use anyhow::Result;
use async_trait::async_trait;

pub use schemas::*;
pub use storage::{ClickHouseStorage, CrashEventData, LatestGaugeSummary, NoOpStorage, Resolution};

#[async_trait]
pub trait Storage: Send + Sync {
    async fn check_health(&self) -> Result<()>;
    async fn insert_counter(&self, req: CounterRequest) -> Result<()>;
    async fn insert_gauge(&self, req: GaugeRequest) -> Result<()>;
    async fn insert_histogram(&self, req: HistogramRequest) -> Result<()>;
    async fn insert_crash(&self, req: CrashRequest) -> Result<CrashEventData>;
    async fn mark_crash_notified(&self, id: &str) -> Result<()>;
    async fn query_counters(
        &self,
        metric_name: &str,
        start_ms: i64,
        end_ms: i64,
        group_by: Option<&str>,
        resolution: Resolution,
    ) -> Result<Vec<DataPoint>>;
    async fn query_gauges(
        &self,
        metric_name: &str,
        start_ms: i64,
        end_ms: i64,
    ) -> Result<Vec<DataPoint>>;
    async fn query_histograms(
        &self,
        metric_name: &str,
        start_ms: i64,
        end_ms: i64,
    ) -> Result<Vec<DataPoint>>;
    async fn query_histogram_percentiles(
        &self,
        metric_name: &str,
        start_ms: i64,
        end_ms: i64,
    ) -> Result<Option<HistogramPercentiles>>;
    async fn get_recent_crashes(&self, limit: usize) -> Result<Vec<CrashEventData>>;
    async fn query_latest_gauges(
        &self,
        metric_name: &str,
        group_by: Option<&str>,
    ) -> Result<Vec<LatestGaugeSummary>>;
}
