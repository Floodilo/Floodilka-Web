/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface CounterParams {
	name: string;
	dimensions?: Record<string, string>;
	value?: number;
}

export interface GaugeParams {
	name: string;
	dimensions?: Record<string, string>;
	value: number;
}

export interface HistogramParams {
	name: string;
	dimensions?: Record<string, string>;
	valueMs: number;
}

export interface CrashParams {
	guildId: string;
	stacktrace: string;
}

export interface BatchMetric {
	type: 'counter' | 'gauge' | 'histogram';
	name: string;
	dimensions?: Record<string, string>;
	value?: number;
	valueMs?: number;
}

export interface IMetricsService {
	counter(params: CounterParams): void;
	gauge(params: GaugeParams): void;
	histogram(params: HistogramParams): void;
	crash(params: CrashParams): void;
	batch(metrics: Array<BatchMetric>): void;
	isEnabled(): boolean;
}
