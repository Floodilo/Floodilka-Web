/*
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka, a fork of Fluxer
 * (https://github.com/fluxerapp/fluxer).
 * Modified by Floodilka Contributors starting March 2026.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {Logger} from '~/Logger';

interface PromInstantValue {
	metric: Record<string, string>;
	value: [number, string];
}

interface PromQueryResponse {
	status: 'success' | 'error';
	data?: {
		resultType: 'vector' | 'matrix' | 'scalar' | 'string';
		result: Array<PromInstantValue>;
	};
	errorType?: string;
	error?: string;
}

export interface ClusterCpuStats {
	usagePercent: number;
	loadAvg1: number;
	loadAvg5: number;
	loadAvg15: number;
	cores: number;
}

export interface ClusterMemoryStats {
	totalBytes: number;
	usedBytes: number;
	freeBytes: number;
	usagePercent: number;
}

export interface ClusterDiskStats {
	totalBytes: number;
	usedBytes: number;
	availableBytes: number;
	usagePercent: number;
}

export interface NodeRow {
	name: string;
	cpuUsagePercent: number;
	memoryUsedBytes: number;
	memoryTotalBytes: number;
	diskUsedBytes: number;
	diskTotalBytes: number;
	loadAvg1: number;
	uptimeSeconds: number;
}

export class PrometheusQueryService {
	private readonly url: string | undefined;
	private readonly timeoutMs: number = 3000;

	constructor(url: string | undefined) {
		this.url = url;
	}

	get isConfigured(): boolean {
		return !!this.url;
	}

	private async query(promql: string): Promise<Array<PromInstantValue>> {
		if (!this.url) {
			throw new Error('Prometheus URL not configured');
		}
		const target = `${this.url}/api/v1/query?query=${encodeURIComponent(promql)}`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
		try {
			const response = await fetch(target, {signal: controller.signal});
			if (!response.ok) {
				throw new Error(`Prometheus HTTP ${response.status}`);
			}
			const body = (await response.json()) as PromQueryResponse;
			if (body.status !== 'success' || !body.data) {
				throw new Error(`Prometheus error: ${body.error ?? 'unknown'}`);
			}
			return body.data.result;
		} finally {
			clearTimeout(timeout);
		}
	}

	private firstValue(result: Array<PromInstantValue>, fallback: number): number {
		const raw = result[0]?.value?.[1];
		if (raw === undefined) return fallback;
		const parsed = Number.parseFloat(raw);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	async getClusterCpu(): Promise<ClusterCpuStats> {
		const [usage, load1, load5, load15, cores] = await Promise.all([
			this.query('100 - avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100'),
			this.query('avg(node_load1)'),
			this.query('avg(node_load5)'),
			this.query('avg(node_load15)'),
			this.query('sum(count by (instance, cpu) (node_cpu_seconds_total{mode="idle"}))'),
		]);
		return {
			usagePercent: Math.max(0, this.firstValue(usage, 0)),
			loadAvg1: this.firstValue(load1, 0),
			loadAvg5: this.firstValue(load5, 0),
			loadAvg15: this.firstValue(load15, 0),
			cores: this.firstValue(cores, 0),
		};
	}

	async getClusterMemory(): Promise<ClusterMemoryStats> {
		const [total, available] = await Promise.all([
			this.query('sum(node_memory_MemTotal_bytes)'),
			this.query('sum(node_memory_MemAvailable_bytes)'),
		]);
		const totalBytes = this.firstValue(total, 0);
		const availableBytes = this.firstValue(available, 0);
		const usedBytes = Math.max(0, totalBytes - availableBytes);
		return {
			totalBytes,
			usedBytes,
			freeBytes: availableBytes,
			usagePercent: totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0,
		};
	}

	async getClusterDisk(): Promise<ClusterDiskStats> {
		const filter = '{fstype!~"tmpfs|devtmpfs|overlay|squashfs|ramfs",mountpoint="/"}';
		const [size, avail] = await Promise.all([
			this.query(`sum(node_filesystem_size_bytes${filter})`),
			this.query(`sum(node_filesystem_avail_bytes${filter})`),
		]);
		const totalBytes = this.firstValue(size, 0);
		const availableBytes = this.firstValue(avail, 0);
		const usedBytes = Math.max(0, totalBytes - availableBytes);
		return {
			totalBytes,
			usedBytes,
			availableBytes,
			usagePercent: totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0,
		};
	}

	async getMaxUptimeSeconds(): Promise<number> {
		const result = await this.query('max(node_time_seconds - node_boot_time_seconds)');
		return Math.floor(this.firstValue(result, 0));
	}

	async getPerNodeRows(): Promise<Array<NodeRow>> {
		const filter = '{fstype!~"tmpfs|devtmpfs|overlay|squashfs|ramfs",mountpoint="/"}';
		const [cpu, memTotal, memAvail, diskSize, diskAvail, load1, uptime] = await Promise.all([
			this.query('100 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100'),
			this.query('node_memory_MemTotal_bytes'),
			this.query('node_memory_MemAvailable_bytes'),
			this.query(`node_filesystem_size_bytes${filter}`),
			this.query(`node_filesystem_avail_bytes${filter}`),
			this.query('node_load1'),
			this.query('node_time_seconds - node_boot_time_seconds'),
		]);

		const byInstance = new Map<string, NodeRow>();
		const ensure = (instance: string): NodeRow => {
			let row = byInstance.get(instance);
			if (!row) {
				row = {
					name: instance,
					cpuUsagePercent: 0,
					memoryUsedBytes: 0,
					memoryTotalBytes: 0,
					diskUsedBytes: 0,
					diskTotalBytes: 0,
					loadAvg1: 0,
					uptimeSeconds: 0,
				};
				byInstance.set(instance, row);
			}
			return row;
		};

		for (const v of cpu) ensure(v.metric.instance ?? '').cpuUsagePercent = Number.parseFloat(v.value[1]);
		for (const v of memTotal) ensure(v.metric.instance ?? '').memoryTotalBytes = Number.parseFloat(v.value[1]);
		for (const v of memAvail) {
			const row = ensure(v.metric.instance ?? '');
			row.memoryUsedBytes = Math.max(0, row.memoryTotalBytes - Number.parseFloat(v.value[1]));
		}
		for (const v of diskSize) ensure(v.metric.instance ?? '').diskTotalBytes = Number.parseFloat(v.value[1]);
		for (const v of diskAvail) {
			const row = ensure(v.metric.instance ?? '');
			row.diskUsedBytes = Math.max(0, row.diskTotalBytes - Number.parseFloat(v.value[1]));
		}
		for (const v of load1) ensure(v.metric.instance ?? '').loadAvg1 = Number.parseFloat(v.value[1]);
		for (const v of uptime) ensure(v.metric.instance ?? '').uptimeSeconds = Math.floor(Number.parseFloat(v.value[1]));

		return Array.from(byInstance.values()).sort((a, b) => a.name.localeCompare(b.name));
	}

	async getClusterStatsSafe() {
		try {
			const [cpu, memory, disk, uptime] = await Promise.all([
				this.getClusterCpu(),
				this.getClusterMemory(),
				this.getClusterDisk(),
				this.getMaxUptimeSeconds(),
			]);
			return {cpu, memory, disk, uptime};
		} catch (err) {
			Logger.warn({err}, '[admin] Prometheus cluster stats failed');
			return null;
		}
	}
}
