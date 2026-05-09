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

import * as fs from 'node:fs';
import * as os from 'node:os';
import {PrometheusQueryService} from '~/admin/services/PrometheusQueryService';
import type {HonoApp} from '~/App';
import {createUserID} from '~/BrandedTypes';
import {Config} from '~/Config';
import {AdminACLs} from '~/Constants';
import {Logger} from '~/Logger';
import {getUserSearchService} from '~/Meilisearch';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';

const prometheus = new PrometheusQueryService(Config.prometheus.url);

export const SystemAdminController = (app: HonoApp) => {
	app.get(
		'/admin/system/stats',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.GATEWAY_MEMORY_STATS),
		async (ctx) => {
			const gatewayService = ctx.get('gatewayService');
			const userRepository = ctx.get('userRepository');

			const [clusterStats, gatewayStats, onlineUserIds, totalUserCount] = await Promise.all([
				prometheus.getClusterStatsSafe(),
				gatewayService.getNodeStats().catch((err: unknown) => {
					Logger.warn({err}, '[admin] failed to get gateway stats');
					return null;
				}),
				gatewayService.getAllOnlineUserIds().catch((err: unknown) => {
					Logger.warn({err}, '[admin] failed to get online user ids');
					return [] as Array<string>;
				}),
				(async () => {
					const userSearchService = getUserSearchService();
					if (!userSearchService) return 0;
					try {
						return await userSearchService.getTotalCount();
					} catch (err) {
						Logger.warn({err}, '[admin] failed to get total user count');
						return 0;
					}
				})(),
			]);

			let onlineUsers: Array<{
				id: string;
				username: string;
				displayName: string | null;
				avatar: string | null;
				createdAt: string | null;
			}> = [];

			if (onlineUserIds.length > 0) {
				try {
					const userIdsBigInt = onlineUserIds.map((id) => createUserID(BigInt(id)));
					const users = await userRepository.listUsers(userIdsBigInt);
					onlineUsers = users.map((u) => ({
						id: u.id.toString(),
						username: u.username,
						displayName: u.globalName,
						avatar: u.avatarHash,
						createdAt: null,
					}));
				} catch (err) {
					Logger.warn({err}, '[admin] failed to fetch online user details');
				}
			}

			const cpu = clusterStats
				? {
						count: Math.round(clusterStats.cpu.cores),
						usage: Math.round(clusterStats.cpu.usagePercent * 10) / 10,
						loadAvg: [clusterStats.cpu.loadAvg1, clusterStats.cpu.loadAvg5, clusterStats.cpu.loadAvg15],
						model: 'cluster aggregate',
					}
				: localCpu();

			const memory = clusterStats
				? {
						total: clusterStats.memory.totalBytes,
						free: clusterStats.memory.freeBytes,
						used: clusterStats.memory.usedBytes,
						usagePercentage: clusterStats.memory.usagePercent,
					}
				: localMemory();

			const disk = clusterStats
				? {
						root: {
							total: clusterStats.disk.totalBytes,
							used: clusterStats.disk.usedBytes,
							available: clusterStats.disk.availableBytes,
							usagePercentage: clusterStats.disk.usagePercent,
						},
					}
				: localDisk();

			const uptime = clusterStats ? clusterStats.uptime : Math.floor(os.uptime());

			return ctx.json({
				cpu,
				memory,
				disk,
				uptime,
				connections: gatewayStats?.sessions ?? 0,
				presences: gatewayStats?.presences ?? 0,
				guilds: gatewayStats?.guilds ?? 0,
				calls: gatewayStats?.calls ?? 0,
				os: {
					platform: os.platform(),
					release: os.release(),
					type: os.type(),
					arch: os.arch(),
				},
				nodeVersion: process.version,
				timestamp: new Date().toISOString(),
				users: {
					online: onlineUsers.length,
					total: totalUserCount,
					list: onlineUsers,
				},
				source: clusterStats ? 'prometheus' : 'local',
			});
		},
	);

	app.get(
		'/admin/system/nodes',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.GATEWAY_MEMORY_STATS),
		async (ctx) => {
			if (!prometheus.isConfigured) {
				return ctx.json({nodes: [], source: 'unavailable'}, 200);
			}
			try {
				const rows = await prometheus.getPerNodeRows();
				return ctx.json({nodes: rows, source: 'prometheus'});
			} catch (err) {
				Logger.warn({err}, '[admin] failed to fetch per-node stats from Prometheus');
				return ctx.json({nodes: [], source: 'error'}, 200);
			}
		},
	);
};

function localCpu() {
	const cpus = os.cpus();
	let totalIdle = 0;
	let totalTick = 0;
	for (const c of cpus) {
		totalIdle += c.times.idle;
		totalTick += c.times.user + c.times.nice + c.times.sys + c.times.idle + c.times.irq;
	}
	const usage = totalTick > 0 ? Math.round(((totalTick - totalIdle) / totalTick) * 100 * 10) / 10 : 0;
	return {
		count: cpus.length,
		usage,
		loadAvg: os.loadavg(),
		model: cpus[0]?.model ?? 'Unknown',
	};
}

function localMemory() {
	const total = os.totalmem();
	const free = os.freemem();
	const used = total - free;
	return {
		total,
		free,
		used,
		usagePercentage: total > 0 ? Math.round((used / total) * 100) : 0,
	};
}

function localDisk() {
	try {
		const stat = fs.statfsSync('/');
		const total = Number(stat.bsize) * Number(stat.blocks);
		const used = total - Number(stat.bsize) * Number(stat.bfree);
		const available = Number(stat.bsize) * Number(stat.bavail);
		return {
			root: {
				total,
				used,
				available,
				usagePercentage: total > 0 ? Math.round((used / total) * 100) : 0,
			},
		};
	} catch {
		return null;
	}
}
